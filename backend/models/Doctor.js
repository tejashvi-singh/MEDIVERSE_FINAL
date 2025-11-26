import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  licenseNumber: String,
  experience: Number,
  bio: String,
  rating: { type: Number, default: 4.5 },
  isAvailable: { type: Boolean, default: true },
  consultationFee: Number,
  workingHours: {
    start: String,
    end: String
  },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Doctor', doctorSchema);