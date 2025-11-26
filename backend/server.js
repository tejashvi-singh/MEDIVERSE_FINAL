import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Routes Import
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/emergency', emergencyRoutes);

// WebSocket Events
io.on('connection', (socket) => {
  console.log('✅ New connection:', socket.id);

  // Emergency request event
  socket.on('emergency-request', (data) => {
    console.log('🚨 Emergency request:', data);
    io.emit('emergency-request-received', {
      ...data,
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  // Doctor connect event
  socket.on('doctor-connected', (data) => {
    console.log('👨‍⚕️ Doctor connected:', data);
    io.to(data.patientSocketId).emit('doctor-connected-to-patient', {
      doctorName: data.doctorName,
      doctorId: data.doctorId,
      timestamp: new Date()
    });
  });

  // Video call events
  socket.on('call-patient', (data) => {
    io.to(data.patientSocketId).emit('incoming-call', {
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      callId: data.callId
    });
  });

  socket.on('accept-call', (data) => {
    io.to(data.doctorSocketId).emit('call-accepted', {
      patientId: data.patientId,
      callId: data.callId
    });
  });

  socket.on('end-call', (data) => {
    io.emit('call-ended', {
      callId: data.callId,
      timestamp: new Date()
    });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server Running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date()
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 WebSocket ready for real-time communication`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare'}`);
});

export default app;