import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const createMedicalRecord = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const {
      patientId, recordType, title, description, diagnosis,
      treatment, medications, labResults, vitals, followUpDate
    } = req.body;

    const record = new MedicalRecord({
      patientId,
      doctorId: doctor._id,
      recordType,
      title,
      description,
      diagnosis,
      treatment,
      medications: medications || [],
      labResults: labResults || [],
      vitals: vitals || {},
      followUpDate
    });

    await record.save();

    // Update patient's medical records
    const patient = await Patient.findById(patientId);
    patient.medicalRecords.push(record._id);
    patient.lastCheckup = new Date();
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      record
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyMedicalRecords = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let records;

    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.userId });
      records = await MedicalRecord.find({ patientId: patient._id })
        .populate('doctorId')
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name' }
        })
        .sort({ recordDate: -1 });
    } else if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.userId });
      records = await MedicalRecord.find({ doctorId: doctor._id })
        .populate('patientId')
        .populate({
          path: 'patientId',
          populate: { path: 'userId', select: 'name' }
        })
        .sort({ recordDate: -1 });
    }

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialty' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name' }
      });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
