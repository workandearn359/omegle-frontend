import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://omegle-backend-rux2.onrender.com');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [connected, setConnected] = useState(false);
  const [strangerConnected, setStrangerConnected] = useState(false);

  useEffect(() => {
    // Handle backend connections and events
    socket.on('connect', () => {
      console.log('Connected to backend');
    });

    socket.on('stranger-connected', () => {
      setConnected(true);
      setStrangerConnected(true);
      setChat((prev) => [...prev, 'Stranger connected!']);
    });

    socket.on('message', (data) => {
      setChat((prev) => [...prev, `Stranger: ${data}`]);
    });

    // Clean up the listeners when component is unmounted
    return () => {
      socket.off('connect');
      socket.off('stranger-connected');
      socket.off('message');
    };
  }, []);

  // Function to send message to stranger
  const sendMessage = () => {
    if (message.trim() === '') return;
    socket.emit('message', message);
    setChat((prev) => [...prev, `You: ${message}`]);
    setMessage('');
  };

  // Function to trigger next stranger
  const nextStranger = () => {
    socket.emit('next');
    setChat((prev) => [...prev, 'You clicked Next!']);
    setStrangerConnected(false); // Reset the connection status
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Omegle Clone Chat</h1>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid gray', padding: '10px' }}>
        {chat.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!strangerConnected}
        placeholder={strangerConnected ? 'Type your message' : 'Waiting for stranger...'}
      />
      <button onClick={sendMessage} disabled={!strangerConnected}>
        Send
      </button>
      <button onClick={nextStranger} disabled={!strangerConnected}>
        Next
      </button>
    </div>
  );
}

export default App;
