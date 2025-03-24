import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/test/message');
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Error loading message');
        console.error('Error:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SyncPlayer2</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App; 