import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: Number,
  bloodType: String,
  allergies: [String],
  medicalHistory: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  medicalRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }],
  healthScore: { type: Number, default: 85 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);