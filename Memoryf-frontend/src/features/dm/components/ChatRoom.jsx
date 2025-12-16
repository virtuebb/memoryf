import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import './ChatRoom.css';

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
    <div className="flex-1 flex flex-col chat-room">
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center gap-3`}>
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} flex items-center justify-center transition-colors`}
        >
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
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
