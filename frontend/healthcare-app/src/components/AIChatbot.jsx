import React, { useState } from "react";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Bot,
  User
} from "lucide-react";

function AIChatbot({ onClose, userRole }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Healthcare Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  // send message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const reply =
        input.toLowerCase().includes("fever")
          ? "For fever: Rest, stay hydrated, take paracetamol. See a doctor if it persists."
          : "I'm here to help with health questions. What would you like to know?";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() }
      ]);
    }, 1000);

    setInput("");
  };

  // minimized widget
  if (isMinimized) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999999,
        }}
      >
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            background: "linear-gradient(135deg,#2196F3,#1976D2)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <MessageCircle size={20} />
          AI Assistant
          <span
            style={{
              background: "white",
              color: "#2196F3",
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "10px",
              fontWeight: "600"
            }}
          >
            {messages.length - 1}
          </span>
        </button>
      </div>
    );
  }

  // full chat window
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        height: "600px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        zIndex: 999999,     // 🔥 FIXED
        pointerEvents: "auto", // 🔥 FIXED
      }}
    >
      {/* header */}
      <div
        style={{
          padding: "15px",
          background: "linear-gradient(135deg,#2196F3,#1976D2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "16px 16px 0 0",
          color: "white"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Bot size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              AI Assistant
            </h3>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>
              Powered by AI
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <Minimize2 size={18} color="white" />
          </button>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <X size={18} color="white" />
          </button>
        </div>
      </div>

      {/* messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "linear-gradient(135deg,#f5f5f5,#e3f2fd)"
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "15px"
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                maxWidth: "80%",
                flexDirection: msg.role === "user" ? "row-reverse" : "row"
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg,#f093fb,#f5576c)"
                      : "linear-gradient(135deg,#667eea,#764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {msg.role === "user" ? (
                  <User size={18} color="white" />
                ) : (
                  <Bot size={18} color="white" />
                )}
              </div>

              <div>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#667eea,#764ba2)"
                        : "white",
                    color: msg.role === "user" ? "white" : "#333",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.content}</p>
                </div>

                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "11px",
                    color: "#777",
                    textAlign: msg.role === "user" ? "right" : "left"
                  }}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* input */}
      <div
        style={{
          padding: "15px",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          gap: "10px"
        }}
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            resize: "none",
            fontSize: "14px"
          }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Send size={20} />
        </button>
      </div>

      {/* footer */}
      <p
        style={{
          fontSize: "11px",
          textAlign: "center",
          margin: 0,
          padding: "6px",
          background: "#fffde7",
          borderTop: "1px solid #fbc02d",
          color: "#777"
        }}
      >
        AI responses are informational only. Consult a doctor for advice.
      </p>
    </div>
  );
}

export default AIChatbot;