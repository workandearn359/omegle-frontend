import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://omegle-backend-rux2.onrender.com'); // ✅ Correct URL

const App = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [strangerConnected, setStrangerConnected] = useState(false);
  const [strangerId, setStrangerId] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to backend');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from backend');
    });

    socket.on('stranger', (data) => {
      if (data.message) {
        alert(data.message);

        if (data.message === 'Your partner has disconnected.') {
          setStrangerConnected(false);
          setChatMessages([]);
        }
      } else {
        setStrangerConnected(true);
        setStrangerId(data.id);
        alert('You have been connected with a stranger!');
      }
    });

    socket.on('chat message', (message) => {
      setChatMessages((prev) => [...prev, { sender: 'stranger', text: message }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('stranger');
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && strangerConnected && strangerId) {
      socket.emit('chat message', { id: strangerId, message });
      setChatMessages((prev) => [...prev, { sender: 'you', text: message }]);
      setMessage('');
    }
  };

  const handleNext = () => {
    socket.emit('next');
    setChatMessages([]);
    setStrangerConnected(false);
    setStrangerId(null);
  };

  return (
    <div className="container">
      <h1 className="title">Omegle Clone</h1>
      {isConnected ? (
        <>
          <div className="chat-box">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'you' ? 'you' : 'stranger'}`}>
                <strong>{msg.sender === 'you' ? 'You' : 'Stranger'}:</strong> {msg.text}
              </div>
            ))}
          </div>

          {strangerConnected && (
            <div className="controls">
              <textarea
                className="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <div className="button-row">
                <button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  Send
                </button>
                <button className="next-button" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="connecting-message">Connecting...</p>
      )}
    </div>
  );
};

export default App;
