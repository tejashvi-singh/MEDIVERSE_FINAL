import Patient from '../models/Patient.js';
import User from '../models/User.js';

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.userId })
      .populate('userId', 'name email phoneNumber address')
      .populate('doctors', 'specialty consultationFee rating');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      success: true,
      patient
    });
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const allowedUpdates = [
      'dateOfBirth', 'age', 'gender', 'bloodType', 'allergies',
      'chronicConditions', 'currentMedications', 'medicalHistory',
      'emergencyContact', 'insurance'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();

    // Update user info if provided
    if (req.body.name || req.body.phoneNumber || req.body.address) {
      const user = await User.findById(req.userId);
      if (req.body.name) user.name = req.body.name;
      if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
      if (req.body.address) user.address = req.body.address;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      patient
    });
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
