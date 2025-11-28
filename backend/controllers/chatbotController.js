// backend/controllers/chatbotController.js
const OpenAI = require('openai');

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for medical context
const SYSTEM_PROMPT = `You are a helpful and empathetic AI health assistant for MEDIVERSE, a healthcare platform. 

Your role is to:
- Provide general health information and wellness advice
- Help users understand common symptoms
- Offer guidance on when to seek professional medical care
- Answer questions about healthy lifestyle choices
- Provide emotional support and reassurance

Important guidelines:
- Always be empathetic and supportive
- Never provide specific medical diagnoses
- Always recommend consulting healthcare professionals for serious concerns
- Provide evidence-based information when possible
- Be clear about the limitations of AI medical advice
- If unsure, acknowledge it and suggest professional consultation

Remember: You are an assistant, not a replacement for professional medical care.`;

exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please contact support.',
        response: 'I apologize, but the AI service is currently unavailable. Please try again later or contact support.'
      });
    }

    // Prepare conversation messages
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ];

    // Add conversation history (limit to last 10 messages for context)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using GPT-3.5 for cost efficiency
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      'I apologize, but I could not generate a response. Please try again.';

    res.status(200).json({
      success: true,
      response: aiResponse,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'AI service quota exceeded',
        response: 'I apologize, but the AI service is temporarily unavailable. Please try again later.'
      });
    }

    if (error.code === 'invalid_api_key') {
      return res.status(503).json({
        success: false,
        message: 'AI service configuration error',
        response: 'I apologize, but there is a configuration issue. Please contact support.'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      response: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.'
    });
  }
};

// Health check endpoint
exports.healthCheck = async (req, res) => {
  try {
    const isConfigured = !!process.env.OPENAI_API_KEY;
    
    res.status(200).json({
      success: true,
      status: isConfigured ? 'online' : 'not configured',
      model: 'gpt-3.5-turbo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service unavailable'
    });
  }
};

// Get conversation suggestions based on common health topics
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      'What are the symptoms of common cold?',
      'How can I improve my sleep quality?',
      'What is a balanced diet?',
      'When should I see a doctor for a headache?',
      'How to manage stress effectively?',
      'What are the benefits of regular exercise?',
      'How much water should I drink daily?',
      'What are the signs of high blood pressure?'
    ];

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
};