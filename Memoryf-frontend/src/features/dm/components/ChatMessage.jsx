import React from 'react';
import { getChatMessageStyles } from '../styles/chatMessageStyles';

const ChatMessage = ({ type, text, time, theme }) => {
  const isSent = type === 'sent';
  const styles = getChatMessageStyles(theme);

  return (
    <div style={{ 
      ...styles.messageContainer, 
      ...(isSent ? styles.messageContainerOwn : {})
    }}>
      {/* 보낸 메시지: 시간 -> 버블, 받은 메시지: 버블 -> 시간 */}
      {isSent ? (
        <>
          <span 
            style={{ 
              ...styles.timestamp, 
              ...(isSent ? styles.timestampOwn : {}) 
            }}
          >
            {time}
          </span>
          <div 
            style={{ 
              ...styles.messageBubble, 
              ...(isSent ? styles.messageBubbleOwn : {}) 
            }}
          >
            {text}
          </div>
        </>
      ) : (
        <>
          <div 
            style={{ 
              ...styles.messageBubble
            }}
          >
            {text}
          </div>
          <span 
            style={{ 
              ...styles.timestamp
            }}
          >
            {time}
          </span>
        </>
      )}
    </div>
  );
};

export default ChatMessage;