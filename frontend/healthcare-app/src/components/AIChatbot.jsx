import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, X, Minimize2, Bot, User as UserIcon, Loader } from "lucide-react";
import { chatAPI } from "../services/api";

function AIChatbot({ isOpen, onClose, userRole }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI Healthcare Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call the backend API which uses OpenAI
      const response = await chatAPI.sendMessage({
        content: userMessage.content,
        sessionId: sessionId
      });

      if (response.data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response if API fails
      const fallbackMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or consult with a healthcare professional for immediate concerns.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = userRole === 'patient' ? [
    "What should I do for a fever?",
    "I have a headache",
    "How to manage stress?",
    "Tips for better sleep"
  ] : [
    "Common symptoms of diabetes",
    "Treatment for hypertension",
    "Drug interactions checker",
    "Emergency protocols"
  ];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button 
          onClick={() => setIsMinimized(false)} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">AI Assistant</span>
          {messages.length > 1 && (
            <span className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {messages.length - 1}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-96 bg-white rounded-xl shadow-2xl flex flex-col h-[600px] border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold">AI Healthcare Assistant</h3>
            <p className="text-xs opacity-90">Powered by OpenAI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMinimized(true)} 
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose} 
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-blue-600' 
                  : msg.isError 
                    ? 'bg-red-500' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? (
                  <UserIcon className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : msg.isError
                      ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-sm'
                      : 'bg-white text-gray-800 shadow-md border border-gray-200 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white shadow-md border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && !loading && (
        <div className="px-4 pb-3 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2 pt-3">Quick prompts:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 px-3 py-2 rounded-lg transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about health..."
            rows="1"
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-xl transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI responses are for informational purposes only. Consult a doctor for medical advice.
        </p>
      </div>
    </div>
  );
}

export default AIChatbot;