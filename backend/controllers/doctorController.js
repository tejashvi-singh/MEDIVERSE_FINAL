import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const getAllDoctors = async (req, res) => {
  try {
    const { specialty, available } = req.query;
    
    let query = {};
    if (specialty) query.specialty = specialty;
    if (available === 'true') query.isAvailable = true;

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phoneNumber')
      .sort({ rating: -1, completedAppointments: -1 });

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phoneNumber address');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const allowedUpdates = [
      'specialty', 'bio', 'qualification', 'experience',
      'consultationFee', 'workingHours', 'isAvailable'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId })
      .populate({
        path: 'patients',
        populate: { path: 'userId', select: 'name email phoneNumber' }
      });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      success: true,
      count: doctor.patients.length,
      patients: doctor.patients
    });
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
