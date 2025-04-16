import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://omegle-backend-rux2.onrender.com');

const App = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to backend');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from backend');
    });

    socket.on('stranger-connected', () => {
      alert('You have been connected with a stranger!');
    });

    socket.on('message', (message) => {
      setChatMessages((prev) => [...prev, { sender: 'stranger', text: message }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('stranger-connected');
      socket.off('message');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setChatMessages((prev) => [...prev, { sender: 'you', text: message }]);
      setMessage('');
    }
  };

  const handleNext = () => {
    socket.emit('next');
    setChatMessages([]);
  };

  return (
    <div className="container">
      <h1 className="title">Omegle Clone</h1>
      {isConnected ? (
        <>
          <div className="chat-box">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'you' ? 'you' : 'stranger'}`}
              >
                <strong>{msg.sender === 'you' ? 'You' : 'Stranger'}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="controls">
            <textarea
              className="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <div className="button-row">
              <button onClick={handleSendMessage} disabled={!message.trim()}>
                Send
              </button>
              <button onClick={handleNext}>Next</button>
            </div>
          </div>
        </>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
};

export default App;
