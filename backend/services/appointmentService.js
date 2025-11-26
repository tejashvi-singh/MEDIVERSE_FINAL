import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const scheduleAppointment = async (appointmentData) => {
  try {
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    return appointment;
  } catch (error) {
    throw new Error(`Failed to schedule appointment: ${error.message}`);
  }
};

export const sendAppointmentConfirmation = async (patientEmail, doctorName, appointmentDate) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: patientEmail,
      subject: '✅ Appointment Confirmed',
      html: `
        <h2>Appointment Confirmation</h2>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p>Your appointment has been confirmed. Please arrive 10 minutes early.</p>
        <p>If you need to reschedule, please contact us at least 24 hours before.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
};

export const sendAppointmentReminder = async (patientEmail, doctorName, appointmentDate) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: patientEmail,
      subject: '⏰ Appointment Reminder',
      html: `
        <h2>Appointment Reminder</h2>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p>Your appointment is coming up soon. Please be ready.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
};

export const checkConflictingAppointments = async (doctorId, date, time) => {
  try {
    const conflict = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $in: ['confirmed', 'pending'] }
    });

    return !!conflict;
  } catch (error) {
    throw new Error(`Failed to check conflicts: ${error.message}`);
  }
};