import EmergencySession from '../models/EmergencySession.js';
import Doctor from '../models/Doctor.js';
import nodemailer from 'nodemailer';

// Setup email service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const findNearestDoctor = async (location) => {
  try {
    const doctor = await Doctor.findOne({ isAvailable: true })
      .populate('userId', 'name email')
      .lean();

    return doctor;
  } catch (error) {
    throw new Error(`Failed to find doctor: ${error.message}`);
  }
};

export const notifyDoctor = async (doctorEmail, patientName, severity) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: doctorEmail,
      subject: `🚨 EMERGENCY REQUEST - Severity: ${severity}`,
      html: `
        <h2>Emergency Medical Request</h2>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Severity:</strong> ${severity}</p>
        <p>A patient has requested emergency medical assistance.</p>
        <p>Please respond immediately.</p>
        <button style="background-color: #ff0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          Accept Emergency Request
        </button>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
};

export const notifyPatient = async (patientEmail, doctorName) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: patientEmail,
      subject: '✅ Doctor Connected - Emergency Assistance',
      html: `
        <h2>Emergency Response</h2>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p>A medical professional has been assigned to your emergency request.</p>
        <p>Starting video consultation now...</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
};