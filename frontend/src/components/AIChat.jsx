import React, { useState } from "react";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your plant assistant 🌱" },
  ]);

  // 🔊 Speak AI response
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Voice input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Try using Google Chrome or Safari!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  // 💬 Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/ask-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiReply = data.reply || "No response";

      const aiMsg = { role: "ai", text: aiReply };
      setMessages((prev) => [...prev, aiMsg]);

      speak(aiReply); // 🔊 speak

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Server error 😢" },
      ]);
    }

    setInput("");
  };

  return (
    <>
      {!open && (
        <button className="chat-button" onClick={() => setOpen(true)}>
          💬
        </button>
      )}

      {open && (
        <div className="chat-box">

          {/* Header */}
          <div className="chat-header">
            <span>🌿 Plant Assistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "user-message" : "ai-message"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input">
            <button onClick={startListening}>🎤</button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or speak..."
            />

            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}
    </>
  );
};

export default AIChat;