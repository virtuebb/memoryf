import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDm } from '../context/DmContext';
import React from 'react';
import '../css/DmRoom.css';
import { selectDmMessages } from '../api/dmApi.js';

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatRoom({ chat, onBack, onSendMessage, onMarkAsRead, themeClass = 'light', hideHeader = false }) {
  // 📍 페이지 이동용 navigate
  const navigate = useNavigate();
  
  // 🔌 WebSocket 연결 상태 가져오기
  const { isConnected, myUserId, handleLeaveChatRoom, fetchMessages } = useDm();
  
  // ✏️ 입력창에 쓴 메시지 저장
  const [messageInput, setMessageInput] = useState('');
  
  // 🎨 themeClass는 부모에서 직접 전달받음 (전역 ThemeContext 사용)
  
  // 📜 메시지 컨테이너 참조 (자동 스크롤용)
  const messagesContainerRef = useRef(null);
  
  // 🔒 이미 읽음 처리한 채팅방 ID 추적 (무한 루프 방지)
  const markedAsReadRef = useRef(null);

  // ============================================
  // 👀 채팅방 입장 시 읽음 처리 (한 번만 실행)
  // ============================================
  useEffect(() => {
    // 채팅방에 들어오면 해당 채팅방의 메시지를 읽음 처리
    // 단, 같은 채팅방에서 이미 읽음 처리했으면 스킵 (무한 루프 방지)
    if (chat?.id && onMarkAsRead && markedAsReadRef.current !== chat.id) {
      markedAsReadRef.current = chat.id;  // 읽음 처리한 방 ID 기록
      onMarkAsRead(chat.id);
    }
    
    // 🚪 채팅방 나갈 때 (언마운트 또는 다른 채팅방으로 이동)
    return () => {
      if (handleLeaveChatRoom) {
        handleLeaveChatRoom();
      }
    };
  }, [chat?.id]); // onMarkAsRead를 dependency에서 제거!

  // ============================================
  // 🔌 백엔드 연동: 채팅방의 메시지 목록 불러오기
  // ============================================
  useEffect(() => {
    // 채팅방의 메시지 목록 불러오기
    if (!chat) return;
    const numericId = Number(chat.id);
    if (Number.isNaN(numericId)) return;

    if (fetchMessages) {
      fetchMessages(numericId).catch((err) => {
        console.error('메시지 불러오기 실패:', err);
      });
    }
  }, [chat?.id, fetchMessages]);

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

  // 📜 새 메시지 오면 자동으로 맨 아래로 스크롤 (메시지 영역 내부만)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chat.messages]);

  // ============================================
  // 📅 날짜 구분자 생성
  // ============================================
  const formatDateLabel = (date) => {
    if (!date) return '';
    const now = new Date();
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  const parseMessageDate = (message) => {
    // 우선 표준 타임스탬프 필드들 사용
    const ts = message.createdAt || message.sentAt || message.timestamp || message.isoTime;
    if (ts) {
      const d = new Date(ts);
      if (!Number.isNaN(d.getTime())) return d;
    }
    // fallback: 메시지에 이미 Date 객체가 들어있는 경우
    if (message.date instanceof Date) return message.date;
    return null;
  };

  // messagesWithSeparators: 날짜 구분자 항목과 메시지 항목이 섞여있는 배열
  const messagesWithSeparators = useMemo(() => {
    const out = [];
    if (!chat || !Array.isArray(chat.messages)) return out;
    let lastDateKey = null;
    for (let i = 0; i < chat.messages.length; i++) {
      const msg = chat.messages[i];
      const d = parseMessageDate(msg);
      const dateKey = d ? d.toDateString() : null;
      if (dateKey && dateKey !== lastDateKey) {
        out.push({ type: 'separator', id: `sep-${dateKey}-${i}`, date: d, label: formatDateLabel(d) });
        lastDateKey = dateKey;
      }
      out.push({ type: 'message', message: msg });
    }
    return out;
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
    <div className="flex-1 flex flex-col chat-room">
      {/* Header - hideHeader가 true면 숨김 (FloatingDm에서 사용 시) */}
      {!hideHeader && (
        <div className={`chat-room-header ${themeClass}`}>
          <button
            onClick={() => navigate('/messages')}
            className={`chat-room-back-btn ${themeClass}`}
          >
            <ArrowLeftIcon />
          </button>
          
          {/* 👤 상대방 프로필 */}
          <div className="chat-room-avatar">
            {chat.avatar}
            {/* 🔌 백엔드 연동 시: <img src={chat.avatarUrl} /> */}
          </div>
          
          {/* 상대방 이름 */}
          <h2 className={`chat-room-username ${themeClass}`}>{chat.userName}</h2>
          
          {/* 🔌 WebSocket 연결 상태 + 내 ID 표시 */}
          <div className={`chat-room-connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="chat-room-my-id">{myUserId}</span>
            <span>{isConnected ? '🟢' : '🔴'}</span>
          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* 💬 메시지 목록 영역 */}
      {/* ====================================== */}
      <div ref={messagesContainerRef} className={`chat-room-messages ${themeClass}`}>
        {/* 아직 메시지가 없으면 안내 문구 표시 */}
        {chat.isPending && chat.messages.length === 0 ? (
          <div className={`chat-room-empty-state ${themeClass}`}>
            <p>메시지를 보내서 대화를 시작하세요</p>
          </div>
        ) : (
          <div className="chat-room-message-list">
            {/* 🔄 각 메시지를 하나씩 그리기 (날짜 구분자 포함) */}
            {messagesWithSeparators.map((item) => {
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className={`chat-date-separator ${themeClass}`}>
                    <span className="chat-date-separator-label">{item.label}</span>
                  </div>
                );
              }
              const message = item.message;
              return (
                <div
                  key={message.id}
                  className={`chat-message-row ${message.isMine ? 'mine' : 'theirs'}`}
                >
                  {/* 💙 내 메시지: 오른쪽 정렬, 파란 배경 */}
                  {message.isMine ? (
                    <div className="chat-message-wrapper">
                      {/* 읽음 표시 + 시간 */}
                      <div className="chat-message-meta">
                        {/* 👀 읽음 표시: 상대방이 안 읽었으면 "1" 표시 */}
                        {!message.isRead && (
                          <span className="chat-message-unread">1</span>
                        )}
                        <span className={`chat-message-time ${themeClass}`}>
                          {message.time}
                        </span>
                      </div>
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
              );
            })}
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
            onKeyPress={handleKeyPress} // 엔터로 메세지 보내기
            placeholder="메시지를 입력하세요..."
            className={`chat-room-input ${themeClass}`}
          />
          
          {/* 📤 보내기 버튼 */}
          <button
            onClick={handleSend}
            disabled={!messageInput.trim()}  // 빈 메시지면 비활성화
            className={`chat-room-send-btn ${messageInput.trim() ? 'active' : `disabled ${themeClass}`}`}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatRoom);
