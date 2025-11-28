import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'symptom', 'advice', 'emergency'], default: 'text' },
  sessionId: String,
  metadata: {
    symptoms: [String],
    severity: Number,
    recommendedAction: String
  },
  createdAt: { type: Date, default: Date.now }
});

chatMessageSchema.index({ userId: 1, sessionId: 1, createdAt: -1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
```