import mongoose from 'mongoose';

const emergencySessionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  status: { 
    type: String, 
    enum: ['connecting', 'connected', 'ended'],
    default: 'connecting'
  },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('EmergencySession', emergencySessionSchema);