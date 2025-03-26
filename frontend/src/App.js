import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import * as jsmediatags from 'jsmediatags';
import './App.css';

// Make jsmediatags available globally
window.jsmediatags = jsmediatags;

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get('/api/hello');
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Error loading message from server');
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SyncPlayer</h1>
        <p>{message}</p>
        <AudioPlayer />
      </header>
    </div>
  );
}

export default App;