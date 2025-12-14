import React from 'react';
import ChatMessage from './ChatMessage';
import { getChatWindowStyles } from '../styles/chatWindowStyles';

const recipientProfilePic = '../assets/bono.jpg';

const ChatWindow = ({ chat, onBack, currentTheme }) => {
  const styles = getChatWindowStyles(currentTheme);

  return (
    <div style={styles.chatContainer}>
      {/* 챗 헤더 (상대방 정보) */}
      <div style={styles.header}>
        <span style={styles.backButton} onClick={onBack}>&larr;</span>
        <img src={recipientProfilePic} alt="Profile" style={styles.profileImage} />
        <div style={styles.username}>{chat.name}</div>
      </div>

      {/* 메시지 표시 영역 */}
      <div style={styles.messageArea}>
        <ChatMessage type="received" text="안녕하세요! 사진이 정말 예뻐요 😊" time="오후 4:30" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
        <ChatMessage type="sent" text="감사합니다! 여행 사진이에요." time="오후 4:31" theme={currentTheme} />
        <ChatMessage type="received" text="어디로 가셨어요? 색감이 너무 좋네요." time="오후 4:33" theme={currentTheme} />
      </div>

      {/* 입력창 영역 */}
      <div style={styles.inputArea}>
        <input 
          type="text" 
          placeholder="메시지 입력..." 
          style={styles.input}
        />
        <button style={styles.sendButton}>✓</button>
      </div>
    </div>
  );
};

export default ChatWindow;