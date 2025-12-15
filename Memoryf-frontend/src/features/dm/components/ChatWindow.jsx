/**
 * ChatWindow.jsx - 채팅창 컴포넌트
 * 
 * 이 컴포넌트는 채팅방 전체 화면을 보여주는 큰 상자예요!
 * 
 * 핵심 기능:
 * 1. 상대방 정보를 보여주는 헤더 (이름, 프로필 사진, 뒤로가기 버튼)
 * 2. 메시지들을 보여주는 메시지 영역 (채팅 내용이 쌓이는 곳)
 * 3. 메시지를 입력하고 전송하는 입력창
 * 4. 새 메시지가 오면 자동으로 스크롤이 맨 아래로 내려가요
 * 5. 서버에 메시지를 보내서 저장해요
 */
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { getChatWindowStyles } from '../styles/chatWindowStyles';

const recipientProfilePic = '/src/assets/images/profiles/bono.jpg';

// 시간을 예쁘게 보여주는 함수 (예: "오후 4:30")
// 24시간 형식을 12시간 형식으로 바꿔줘요
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${ampm} ${displayHours}:${displayMinutes}`;
};

// 처음 화면에 보여줄 예시 메시지들 (나중에 서버에서 가져올 거예요)
const getInitialMessages = () => [
  { id: 1, type: 'received', text: '안녕하세요! 사진이 정말 예뻐요 😊', time: '오후 4:30', timestamp: new Date() },
  { id: 2, type: 'sent', text: '감사합니다! 여행 사진이에요.', time: '오후 4:31', timestamp: new Date() },
  { id: 3, type: 'received', text: '어디로 가셨어요? 색감이 너무 좋네요.', time: '오후 4:33', timestamp: new Date() },
];

const ChatWindow = ({ chat, onBack, currentTheme, onSendMessage }) => {
  const styles = getChatWindowStyles(currentTheme);
  // 채팅방에 있는 모든 메시지들을 저장하는 변수
  const [messages, setMessages] = useState(getInitialMessages());
  // 지금 메시지를 보내는 중인지 확인하는 변수 (중복 전송 방지)
  const [isSending, setIsSending] = useState(false);
  // 메시지 영역의 맨 아래를 가리키는 참조 (스크롤을 위해 사용)
  const messageEndRef = useRef(null);
  const messageAreaRef = useRef(null);

  // 새 메시지가 추가될 때마다 자동으로 스크롤을 맨 아래로 내려줘요
  // 이렇게 하면 새 메시지를 놓치지 않고 볼 수 있어요!
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 서버에 메시지를 보내서 저장하는 함수
  // 서버는 메시지를 데이터베이스에 저장해두는 곳이에요!
  const sendMessageToServer = async (messageText) => {
    // 실제 서버에 메시지를 보내는 코드
    try {
      // 서버가 있다고 가정하고 API 호출
      const response = await fetch('/api/dm/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chat.id,
          message: messageText,
          timestamp: new Date().toISOString(),
        }),
      });

      // 서버 응답이 없거나 에러가 발생해도 로컬에서 메시지 표시
      if (!response.ok) {
        console.warn('서버 응답 실패, 로컬에서 메시지 표시');
      }

      return await response.json().catch(() => null);
    } catch (error) {
      // 네트워크 오류 등으로 서버에 전송하지 못해도 로컬에서 메시지 표시
      console.warn('메시지 전송 실패 (로컬에서 표시):', error);
      return null;
    }
  };

  // 메시지를 전송하는 함수 (MessageInput에서 호출됨)
  const handleSendMessage = async (messageText) => {
    // 빈 메시지나 전송 중이면 아무것도 하지 않아요
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    const now = new Date();
    // 새로 보낼 메시지 정보를 만들어요
    const newMessage = {
      id: Date.now(), // 각 메시지마다 고유한 번호를 줘요
      type: 'sent', // 내가 보낸 메시지라는 뜻
      text: messageText, // 메시지 내용
      time: formatTime(now), // 보낸 시간 (예: "오후 4:30")
      timestamp: now,
    };

    // 서버 응답을 기다리지 않고 먼저 화면에 메시지를 보여줘요
    // 이렇게 하면 더 빠르게 느껴져요!
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // 상위 컴포넌트에 알림 (선택적)
    if (onSendMessage) {
      onSendMessage(messageText);
    }

    // 서버에 메시지 전송
    try {
      const serverResponse = await sendMessageToServer(messageText);
      
      // 서버 응답이 있으면 서버에서 받은 메시지 ID로 업데이트
      if (serverResponse && serverResponse.messageId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, id: serverResponse.messageId }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      // 에러가 발생해도 이미 UI에 표시된 메시지는 유지
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={styles.chatContainer}>
      {/* 챗 헤더 (상대방 정보) */}
      <div style={styles.header}>
        <span style={styles.backButton} onClick={onBack}>&larr;</span>
        <img src={recipientProfilePic} alt="Profile" style={styles.profileImage} />
        <div style={styles.username}>{chat.name}</div>
      </div>

      {/* 메시지 표시 영역 */}
      <div ref={messageAreaRef} style={styles.messageArea}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            type={message.type}
            text={message.text}
            time={message.time}
            theme={currentTheme}
          />
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* 메시지 입력 컴포넌트 */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        currentTheme={currentTheme}
        disabled={isSending}
      />
    </div>
  );
};

export default ChatWindow;