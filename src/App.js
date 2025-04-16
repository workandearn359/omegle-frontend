import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("https://omegle-backend-rux2.onrender.com");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for a matched partner
    socket.on("match", (partnerId) => {
      setPartner(partnerId);
    });

    return () => {
      socket.off("chat message");
      socket.off("match");
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      socket.emit("chat message", input);
      setMessages((prevMessages) => [...prevMessages, input]);
      setInput("");
    }
  };

  const handleNext = () => {
    setMessages([]);
    setPartner(null);
    socket.emit("next");
  };

  return (
    <div className="App">
      <h1>Omegle Clone</h1>
      <div className="chat-container">
        {partner ? (
          <div>
            <h3>Connected to: {partner}</h3>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={handleNext}>Next</button>
          </div>
        ) : (
          <h3>Waiting for a partner...</h3>
        )}
      </div>
    </div>
  );
}

export default App;
