import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dateOfBirth: Date,
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [{ name: String, dosage: String, frequency: String }],
  medicalHistory: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    validUntil: Date
  },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  medicalRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }],
  healthScore: { type: Number, default: 85, min: 0, max: 100 },
  lastCheckup: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
```

### backend/models/Appointment.js
```javascript
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientName: String,
  doctorName: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  endTime: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  type: { 
    type: String, 
    enum: ['consultation', 'follow-up', 'check-up', 'emergency'],
    default: 'consultation'
  },
  specialty: String,
  reason: String,
  symptoms: [String],
  notes: String,
  diagnosis: String,
  prescription: [{
    medicine: String,
    dosage: String,
    duration: String,
    instructions: String
  }],
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  fee: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  cancelReason: String,
  cancelledBy: { type: String, enum: ['patient', 'doctor', 'system'] },
  reminderSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 });
appointmentSchema.index({ patientId: 1, date: 1 });

export default mongoose.model('Appointment', appointmentSchema);