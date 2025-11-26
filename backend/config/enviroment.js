export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // Email Configuration
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      senderEmail: process.env.SENDER_EMAIL
    },
  
    // AI/Chatbot
    openaiKey: process.env.OPENAI_API_KEY,
  
    // Twilio (Optional)
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE
    }
  };
  
  export const validateConfig = () => {
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'SMTP_HOST', 'SMTP_USER'];
    
    for (const variable of requiredVars) {
      if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
      }
    }
  };