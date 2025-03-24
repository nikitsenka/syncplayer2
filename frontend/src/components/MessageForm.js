import React, { useState } from 'react';

function MessageForm({ onAddMessage }) {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onAddMessage(content);
      setContent('');
    }
  };
  
  return (
    <div className="message-form">
      <h2>Add a Test Message</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a test message"
        />
        <button type="submit">Add Message</button>
      </form>
    </div>
  );
}

export default MessageForm;