/**
 * MessageInput.jsx - 메시지 입력 컴포넌트
 * 
 * 이 컴포넌트는 채팅방에서 메시지를 입력하고 보낼 수 있는 입력창이에요!
 * 
 * 핵심 기능:
 * 1. 메시지를 입력할 수 있는 텍스트 박스
 * 2. Enter 키를 누르거나 전송 버튼(✓)을 클릭하면 메시지가 전송돼요
 * 3. 메시지를 보낸 후에는 입력창이 자동으로 비워지고 다시 포커스가 가요
 * 4. 전송 중일 때는 입력창이 비활성화되어 중복 전송을 막아요
 */
import React, { useState, useRef } from 'react';
import { getChatWindowStyles } from '../styles/chatWindowStyles';

const MessageInput = ({ onSendMessage, currentTheme, disabled = false }) => {
  // 입력한 메시지를 저장하는 변수 (예: "안녕하세요!")
  const [message, setMessage] = useState('');
  // 입력창을 직접 제어하기 위한 참조 (포커스를 주기 위해 사용)
  const inputRef = useRef(null);
  const styles = getChatWindowStyles(currentTheme);

  // 메시지를 전송하는 함수 (Enter 키나 전송 버튼을 눌렀을 때 실행)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      await onSendMessage(message.trim());
      setMessage('');
      // 메시지 전송 후 입력창에 포커스
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // Enter 키를 눌렀을 때 메시지를 전송하는 함수
  // Shift + Enter는 줄바꿈을 위해 사용할 수 있어요
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.inputArea}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <input 
          ref={inputRef}
          type="text" 
          placeholder={disabled ? "전송 중..." : "메시지 입력..."}
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <button 
          type="submit" 
          style={{ ...styles.sendButton, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
          disabled={disabled}
        >
          ✓
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

