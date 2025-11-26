import ChatMessage from '../models/ChatMessage.js';
import axios from 'axios';

export const sendMessage = async (req, res) => {
  try {
    const { content, userRole, sessionId } = req.body;

    // Save user message
    const userMessage = new ChatMessage({
      userId: req.userId,
      role: 'user',
      content,
      sessionId,
      type: 'text'
    });
    await userMessage.save();

    // Generate AI response
    let aiResponse = 'Thank you for your message.';

    if (userRole === 'patient') {
      const symptomResponses = {
        fever: 'For fever: Rest, stay hydrated, take paracetamol (500mg). Consult if persists beyond 3 days.',
        headache: 'For headache: Rest, apply warm compress, stay hydrated. Take ibuprofen if needed.',
        cough: 'For cough: Drink warm liquids, use humidifier. Consult if persists 2+ weeks.',
        cold: 'For cold: Rest, fluids, saline drops, vitamin C. Usually resolves in 7-10 days.',
        stomach: 'For stomach issues: Bland diet, hydration, rest. Avoid dairy/fatty foods.',
        fatigue: 'For fatigue: Sleep 7-9 hours, nutritious food, exercise, manage stress.'
      };

      for (const [symptom, response] of Object.entries(symptomResponses)) {
        if (content.toLowerCase().includes(symptom)) {
          aiResponse = response;
          break;
        }
      }
    }

    // Save AI response
    const assistantMessage = new ChatMessage({
      userId: req.userId,
      role: 'assistant',
      content: aiResponse,
      sessionId,
      type: 'advice'
    });
    await assistantMessage.save();

    res.json({
      userMessage,
      assistantMessage,
      response: aiResponse
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ 
      userId: req.userId,
      sessionId: req.params.sessionId 
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};