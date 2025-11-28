import ChatMessage from '../models/ChatMessage.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const sendChatMessage = async (req, res) => {
  try {
    const { content, sessionId } = req.body;

    // Save user message
    const userMessage = new ChatMessage({
      userId: req.userId,
      role: 'user',
      content,
      sessionId: sessionId || `session_${Date.now()}`,
      type: 'text'
    });
    await userMessage.save();

    // Get conversation history
    const history = await ChatMessage.find({
      userId: req.userId,
      sessionId: userMessage.sessionId
    })
      .sort({ createdAt: 1 })
      .limit(10);

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are a helpful medical AI assistant. Provide accurate health information, but always remind users to consult healthcare professionals for serious concerns. Be empathetic, clear, and concise.
        Guidelines:
- For symptoms, provide general advice and when to seek medical help
- Never diagnose conditions definitively
- Recommend seeing a doctor for persistent or severe symptoms
- Provide first aid guidance when appropriate
- Be supportive and understanding`
      },
      ...history.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content }
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Save assistant message
    const assistantMessage = new ChatMessage({
      userId: req.userId,
      role: 'assistant',
      content: aiResponse,
      sessionId: userMessage.sessionId,
      type: 'advice'
    });
    await assistantMessage.save();

    res.json({
      success: true,
      userMessage,
      assistantMessage,
      response: aiResponse
    });
  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response if OpenAI fails
    const fallbackResponse = 'I apologize, but I\'m having trouble connecting right now. Please try again or consult with a healthcare professional for immediate concerns.';
    
    const assistantMessage = new ChatMessage({
      userId: req.userId,
      role: 'assistant',
      content: fallbackResponse,
      sessionId: req.body.sessionId || `session_${Date.now()}`,
      type: 'text'
    });
    await assistantMessage.save();

    res.json({
      success: true,
      response: fallbackResponse,
      assistantMessage
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const messages = await ChatMessage.find({
      userId: req.userId,
      sessionId
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyChatSessions = async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      { $match: { userId: req.userId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};