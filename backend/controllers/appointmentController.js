import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, symptoms, specialty } = req.body;
    
    const patient = await Patient.findOne({ userId: req.userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for existing appointment at same time
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const patientUser = await User.findById(req.userId);

    const appointment = new Appointment({
      patientId: patient._id,
      doctorId,
      patientName: patientUser.name,
      doctorName: doctor.userId.name,
      date: new Date(date),
      time,
      reason: reason || 'General consultation',
      symptoms: symptoms || [],
      specialty: specialty || doctor.specialty,
      fee: doctor.consultationFee,
      status: 'pending'
    });

    await appointment.save();

    // Update references
    patient.appointments.push(appointment._id);
    await patient.save();

    doctor.totalAppointments += 1;
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Appointment request sent successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let appointments;

    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.userId });
      appointments = await Appointment.find({ patientId: patient._id })
        .populate('doctorId')
        .sort({ date: -1, time: -1 });
    } else if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.userId });
      appointments = await Appointment.find({ doctorId: doctor._id })
        .populate('patientId')
        .sort({ date: -1, time: -1 });
    }

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes, diagnosis, prescription } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (prescription) appointment.prescription = prescription;
    appointment.updatedAt = new Date();

    await appointment.save();

    // Update doctor stats
    if (status === 'completed') {
      const doctor = await Doctor.findById(appointment.doctorId);
      doctor.completedAppointments += 1;
      await doctor.save();
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const user = await User.findById(req.userId);
    
    appointment.status = 'cancelled';
    appointment.cancelReason = reason || 'No reason provided';
    appointment.cancelledBy = user.role;
    appointment.updatedAt = new Date();

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};