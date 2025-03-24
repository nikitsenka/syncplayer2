import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="message-list">
      <h2>Test Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessageList;