/**
 * 💬 채팅방 컴포넌트
 * 
 * 🎯 이 파일이 하는 일:
 *    - 특정 채팅방의 메시지들을 보여줌
 *    - 새 메시지 입력하고 보내기
 *    - 뒤로 가기 버튼으로 목록으로 돌아가기
 * 
 * 📦 부모(DmRoutes)에서 받는 데이터:
 *    - chat: 현재 채팅방 정보
 *    - onBack: 뒤로가기 버튼 클릭 시 실행할 함수
 *    - onSendMessage: 메시지 보내기 함수
 *    - theme: 현재 테마 (light/dark)
 * 
 * 🔌 백엔드 연동 시 필요한 데이터 형식:
 *    chat = {
 *      id: 1,
 *      userName: 'Jenny Kim',
 *      avatar: '👤',
 *      messages: [
 *        {
 *          id: 1,              // 메시지 고유 번호
 *          text: '안녕하세요!',  // 메시지 내용
 *          time: '오후 4:30',   // 보낸 시간
 *          isMine: false        // 내가 보낸 건지? (true: 내 메시지, false: 상대방 메시지)
 *        },
 *        ...
 *      ],
 *      isPending: false  // 대기 중 여부
 *    }
 * 
 * 🔌 실시간 채팅 구현 시:
 *    WebSocket을 사용하면 메시지가 바로바로 보여요!
 *    const socket = new WebSocket('ws://서버주소/dm');
 *    socket.onmessage = (event) => {
 *      const newMessage = JSON.parse(event.data);
 *      // 새 메시지를 화면에 추가
 *    };
 */

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import './ChatRoom.css';

export default function ChatRoom({ chat, onBack, onSendMessage, theme }) {
  // ✏️ 입력창에 쓴 메시지 저장
  const [messageInput, setMessageInput] = useState('');
  
  // 🎨 테마에 따라 CSS 클래스 결정
  const themeClass = theme === 'dark' ? 'dark' : 'light';
  
  // 📜 메시지 목록 끝부분 참조 (자동 스크롤용)
  const messagesEndRef = useRef(null);

  // ============================================
  // 🔌 백엔드 연동: 메시지 목록 가져오기
  // ============================================
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       // 📡 서버에 "이 채팅방의 메시지들 줘!" 요청
  //       const response = await fetch(`${API_BASE_URL}/rooms/${chat.id}/messages`, {
  //         headers: {
  //           'Authorization': `Bearer ${로그인토큰}`
  //         }
  //       });
  //       const messages = await response.json();
  //       // ✅ 메시지 목록 업데이트
  //     } catch (error) {
  //       console.error('메시지 가져오기 실패:', error);
  //     }
  //   };
  //   
  //   fetchMessages();
  // }, [chat.id]);

  // 📜 새 메시지 오면 자동으로 맨 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  /**
   * 📤 메시지 보내기 버튼 클릭 시
   */
  const handleSend = () => {
    // 빈 메시지는 안 보냄
    if (messageInput.trim()) {
      onSendMessage(chat.id, messageInput);  // 부모한테 "이 메시지 보내줘!" 요청
      setMessageInput('');  // 입력창 비우기
    }
  };

  /**
   * ⌨️ 엔터 키 누르면 메시지 보내기
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // 줄바꿈 방지
      handleSend();
    }
  };

  // ============================================
  // 🎨 화면 그리기
  // ============================================
  return (
    <div className="chat-room">
      {/* ====================================== */}
      {/* 📌 헤더: 뒤로가기 + 상대방 정보 */}
      {/* ====================================== */}
      <div className={`chat-room-header ${themeClass}`}>
        {/* ← 뒤로가기 버튼 */}
        <button onClick={onBack} className={`chat-room-back-btn ${themeClass}`}>
          <ArrowLeft size={20} />
        </button>
        
        {/* 👤 상대방 프로필 */}
        <div className="chat-room-avatar">
          {chat.avatar}
          {/* 🔌 백엔드 연동 시: <img src={chat.avatarUrl} /> */}
        </div>
        
        {/* 상대방 이름 */}
        <h2 className={`chat-room-username ${themeClass}`}>{chat.userName}</h2>
      </div>

      {/* ====================================== */}
      {/* 💬 메시지 목록 영역 */}
      {/* ====================================== */}
      <div className={`chat-room-messages ${themeClass}`}>
        {/* 아직 메시지가 없으면 안내 문구 표시 */}
        {chat.isPending && chat.messages.length === 0 ? (
          <div className={`chat-room-empty-state ${themeClass}`}>
            <p>메시지를 보내서 대화를 시작하세요</p>
          </div>
        ) : (
          <div className="chat-room-message-list">
            {/* 🔄 각 메시지를 하나씩 그리기 */}
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message-row ${message.isMine ? 'mine' : 'theirs'}`}
              >
                {/* 💙 내 메시지: 오른쪽 정렬, 파란 배경 */}
                {message.isMine ? (
                  <div className="chat-message-wrapper">
                    {/* 시간 먼저, 그 다음 메시지 */}
                    <span className={`chat-message-time ${themeClass}`}>
                      {message.time}
                    </span>
                    <div className="chat-message-bubble mine">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  /* 🤍 상대방 메시지: 왼쪽 정렬, 흰 배경 */
                  <div className="chat-message-wrapper">
                    {/* 메시지 먼저, 그 다음 시간 */}
                    <div className={`chat-message-bubble theirs ${themeClass}`}>
                      {message.text}
                    </div>
                    <span className={`chat-message-time ${themeClass}`}>
                      {message.time}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {/* 📜 자동 스크롤을 위한 빈 요소 */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ====================================== */}
      {/* ✏️ 메시지 입력 영역 */}
      {/* ====================================== */}
      <div className={`chat-room-input-area ${themeClass}`}>
        <div className={`chat-room-input-wrapper ${themeClass}`}>
          {/* 텍스트 입력창 */}
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className={`chat-room-input ${themeClass}`}
          />
          
          {/* 📤 보내기 버튼 */}
          <button
            onClick={handleSend}
            disabled={!messageInput.trim()}  // 빈 메시지면 비활성화
            className={`chat-room-send-btn ${messageInput.trim() ? 'active' : `disabled ${themeClass}`}`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
