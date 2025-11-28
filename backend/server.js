import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Server Running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// WebSocket Events
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('✅ New WebSocket connection:', socket.id);

  // User joins
  socket.on('user-join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Appointment notifications
  socket.on('appointment-created', (data) => {
    console.log('📅 New appointment created:', data);
    // Notify doctor
    const doctorSocketId = activeUsers.get(data.doctorId);
    if (doctorSocketId) {
      io.to(doctorSocketId).emit('new-appointment-request', data);
    }
  });

  socket.on('appointment-updated', (data) => {
    console.log('📅 Appointment updated:', data);
    // Notify patient
    const patientSocketId = activeUsers.get(data.patientId);
    if (patientSocketId) {
      io.to(patientSocketId).emit('appointment-status-changed', data);
    }
  });

  // Emergency request
  socket.on('emergency-request', (data) => {
    console.log('🚨 Emergency request:', data);
    io.emit('emergency-alert', {
      ...data,
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  // Video call signaling
  socket.on('call-user', (data) => {
    const { to, offer, from } = data;
    const toSocketId = activeUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit('incoming-call', {
        from,
        offer,
        callerSocketId: socket.id
      });
    }
  });

  socket.on('answer-call', (data) => {
    const { to, answer } = data;
    const toSocketId = activeUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit('call-answered', { answer });
    }
  });

  socket.on('ice-candidate', (data) => {
    const { to, candidate } = data;
    const toSocketId = activeUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit('ice-candidate', { candidate });
    }
  });

  socket.on('end-call', (data) => {
    const { to } = data;
    const toSocketId = activeUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit('call-ended');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    if (socket.userId) {
      activeUsers.delete(socket.userId);
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error Handler
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Healthcare Platform Server Started');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare'}`);
  console.log(`📱 WebSocket: Active on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  httpServer.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

export default app;