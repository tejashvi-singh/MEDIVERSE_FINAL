import axios from 'axios';

export const analyzeSymptoms = async (symptoms, age, sex) => {
  try {
    // Using basic symptom analysis (Replace with OpenAI for advanced)
    const symptomDatabase = {
      fever: {
        severity: 6,
        recommendation: 'General Practitioner',
        treatment: 'Rest, hydration, antipyretics',
        redFlags: ['High fever >104F', 'Confusion', 'Severe headache']
      },
      headache: {
        severity: 4,
        recommendation: 'General Practitioner',
        treatment: 'Rest, pain relief, hydration',
        redFlags: ['Sudden severe headache', 'Vision changes', 'Stiff neck']
      },
      cough: {
        severity: 5,
        recommendation: 'Pulmonologist',
        treatment: 'Cough suppressants, fluids',
        redFlags: ['Bloody cough', 'Chest pain', 'Shortness of breath']
      },
      chest_pain: {
        severity: 9,
        recommendation: 'Cardiologist - URGENT',
        treatment: 'Immediate medical attention required',
        redFlags: ['Persistent', 'Radiating', 'Difficulty breathing']
      },
      breathing_difficulty: {
        severity: 8,
        recommendation: 'Emergency - Pulmonologist',
        treatment: 'Immediate medical attention',
        redFlags: ['Severe', 'Rapid onset', 'Blue lips']
      }
    };

    const analysis = symptomDatabase[symptoms.toLowerCase()] || {
      severity: 3,
      recommendation: 'General Practitioner',
      treatment: 'Consultation recommended',
      redFlags: []
    };

    return {
      severity: analysis.severity,
      summary: `Based on reported symptoms, severity level is ${analysis.severity}/10`,
      recommendedSpecialty: analysis.recommendation,
      treatment: analysis.treatment,
      redFlags: analysis.redFlags,
      advice: [
        'Stay hydrated',
        'Get adequate rest',
        'Monitor symptoms',
        'Seek immediate help if symptoms worsen'
      ]
    };
  } catch (error) {
    throw new Error(`Chatbot analysis failed: ${error.message}`);
  }
};

// Optional: Integrate with OpenAI
export const analyzeWithOpenAI = async (symptoms) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a medical assistant. Analyze symptoms and provide preliminary guidance.'
          },
          {
            role: 'user',
            content: symptoms
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
};