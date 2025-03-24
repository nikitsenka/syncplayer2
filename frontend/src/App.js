import React, { useState, useEffect } from 'react';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import { getAllMessages, createMessage } from './services/messageService';

function App() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleAddMessage = async (content) => {
    try {
      const newMessage = await createMessage({ content });
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };
  
  return (
    <div className="App">
      <header>
        <h1>SyncPlayer</h1>
      </header>
      <main>
        <MessageForm onAddMessage={handleAddMessage} />
        <MessageList messages={messages} />
      </main>
    </div>
  );
}

export default App;