import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, X, Minimize2 } from "lucide-react";

function AIChatbot({ isOpen, onClose, userRole }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let response = 'Thank you for your message.';
      if (userRole === 'patient') {
        if (input.toLowerCase().includes('fever')) response = 'For fever: Rest, stay hydrated, take paracetamol. See a doctor if it persists.';
        else if (input.toLowerCase().includes('headache')) response = 'For headache: Rest, apply warm compress, stay hydrated.';
        else if (input.toLowerCase().includes('cough')) response = 'For cough: Drink warm liquids, use humidifier. Consult if persists 2+ weeks.';
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button onClick={() => setIsMinimized(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <MessageCircle className="w-5 h-5" />
          AI Assistant
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-96 bg-white rounded-lg shadow-2xl flex flex-col h-96">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI Assistant
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(true)} className="hover:bg-blue-500 p-1 rounded">
            <Minimize2 className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="hover:bg-blue-500 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-lg flex gap-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-3 bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me anything..." className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleSendMessage} disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;