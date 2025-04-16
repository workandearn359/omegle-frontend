import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:10000'); // Make sure this matches your backend URL

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
      setChatMessages((prevMessages) => [...prevMessages, message]);
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
      setChatMessages((prevMessages) => [...prevMessages, message]);
      setMessage('');
    }
  };

  const handleNext = () => {
    socket.emit('next');
    setChatMessages([]); // Clear chat history for the new connection
  };

  return (
    <div>
      <h1>Omegle Clone</h1>
      <div>
        {isConnected ? (
          <div>
            <div>
              {chatMessages.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={handleNext}>Next</button>
          </div>
        ) : (
          <p>Connecting...</p>
        )}
      </div>
    </div>
  );
};

export default App;
