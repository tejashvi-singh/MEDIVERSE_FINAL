import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  recordType: {
    type: String,
    enum: ['lab-report', 'prescription', 'imaging', 'diagnosis', 'vaccination', 'surgery', 'discharge-summary', 'other'],
    required: true
  },
  title: { type: String, required: true },
  description: String,
  findings: String,
  diagnosis: String,
  treatment: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    unit: String,
    status: { type: String, enum: ['normal', 'abnormal', 'critical'] }
  }],
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    oxygenLevel: Number
  },
  attachments: [{
    fileName: String,
    fileType: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  followUpDate: Date,
  followUpInstructions: String,
  isConfidential: { type: Boolean, default: false },
  recordDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

medicalRecordSchema.index({ patientId: 1, recordDate: -1 });
medicalRecordSchema.index({ doctorId: 1, recordDate: -1 });

export default mongoose.model('MedicalRecord', medicalRecordSchema);