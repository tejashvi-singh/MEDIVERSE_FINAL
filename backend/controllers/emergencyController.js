import EmergencySession from '../models/EmergencySession.js';
import Doctor from '../models/Doctor.js';

export const requestEmergency = async (req, res) => {
  try {
    const { patientId, severity, location } = req.body;

    // Find nearest available doctor
    const doctor = await Doctor.findOne({ isAvailable: true })
      .limit(1);

    if (!doctor) {
      return res.status(503).json({ message: 'No doctors available' });
    }

    const session = new EmergencySession({
      patientId,
      doctorId: doctor.userId,
      severity,
      location,
      status: 'connecting'
    });

    await session.save();

    res.status(201).json({
      message: 'Emergency session created',
      sessionId: session._id,
      doctor: { name: doctor.name, specialty: doctor.specialty }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmergencyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await EmergencySession.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        endTime: status === 'ended' ? new Date() : undefined
      },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmergencyHistory = async (req, res) => {
  try {
    const sessions = await EmergencySession.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};