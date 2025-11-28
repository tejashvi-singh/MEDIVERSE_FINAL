// backend/routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { chat, healthCheck, getSuggestions } = require('../controllers/chatbotController');

router.post('/chat', chat);
router.get('/health', healthCheck);
router.get('/suggestions', getSuggestions);

module.exports = router;

// ========================================

// backend/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  confirmAppointment,
  rejectAppointment,
  cancelAppointment,
  completeAppointment
} = require('../controllers/appointmentController');

// Patient routes
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.patch('/:id/cancel', protect, cancelAppointment);

// Doctor routes
router.get('/doctor/my-appointments', protect, getDoctorAppointments);
router.patch('/:id/confirm', protect, confirmAppointment);
router.patch('/:id/reject', protect, rejectAppointment);
router.patch('/:id/complete', protect, completeAppointment);

module.exports = router;

// ========================================

// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get all doctors
router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name email specialization phone');
    
    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors'
    });
  }
});

module.exports = router;

// ========================================

// backend/routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createRecord,
  getMyRecords,
  getPatientRecords,
  getRecordById
} = require('../controllers/medicalRecordController');

// Patient routes
router.get('/my-records', protect, getMyRecords);

// Doctor routes
router.post('/create', protect, authorize('doctor'), createRecord);
router.get('/patient/:patientId', protect, authorize('doctor'), getPatientRecords);

// Shared routes
router.get('/:id', protect, getRecordById);

module.exports = router;