import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: '🏥 Welcome to Healthcare Platform',
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Thank you for registering on our Healthcare Platform.</p>
        <p>We're excited to help you with your health journey.</p>
        <a href="${process.env.FRONTEND_URL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Get Started
        </a>
      `
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Welcome email failed:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: '🔐 Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Password reset email failed:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: '✉️ Email Verification',
      html: `
        <h2>Verify Your Email</h2>
        <p>Enter this code to verify your email:</p>
        <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 2px;">
          ${verificationCode}
        </h3>
        <p>This code will expire in 30 minutes.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Verification email failed:', error);
    throw error;
  }
};