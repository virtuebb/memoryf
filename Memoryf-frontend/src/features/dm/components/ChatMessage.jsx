/**
 * ChatMessage.jsx - 개별 메시지 컴포넌트
 * 
 * 이 컴포넌트는 채팅방에서 보이는 한 개의 메시지 버블이에요!
 * 
 * 핵심 기능:
 * 1. 내가 보낸 메시지는 오른쪽에, 받은 메시지는 왼쪽에 표시돼요
 * 2. 메시지 옆에 보낸 시간을 보여줘요
 * 3. 보낸 메시지와 받은 메시지의 색깔이 달라서 구분하기 쉬워요
 * 4. 테마 색상에 따라 메시지 버블 색이 바뀌어요
 */
import React from 'react';
import { getChatMessageStyles } from '../styles/chatMessageStyles';

const ChatMessage = ({ type, text, time, theme }) => {
  // 이 메시지가 내가 보낸 건지 확인해요
  const isSent = type === 'sent';
  const styles = getChatMessageStyles(theme);

  return (
    <div style={{ 
      ...styles.messageContainer, 
      // 내가 보낸 메시지는 오른쪽 정렬, 받은 메시지는 왼쪽 정렬
      ...(isSent ? styles.messageContainerOwn : {})
    }}>
      {/* 보낸 메시지는 시간이 왼쪽, 받은 메시지는 시간이 오른쪽에 있어요 */}
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