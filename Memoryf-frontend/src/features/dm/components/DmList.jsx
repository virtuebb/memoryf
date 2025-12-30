/**
 * 📋 채팅방 목록 컴포넌트
 * 
 * 🎯 이 파일이 하는 일:
 *    - 내 모든 채팅방을 목록으로 보여줌
 *    - 각 채팅방 클릭하면 그 방으로 이동
 *    - + 버튼 누르면 새 채팅 시작
 * 
 * 📦 부모(DmRoutes)에서 받는 데이터:
 *    - chats: 채팅방 목록 배열
 *    - onSelectChat: 채팅방 클릭 시 실행할 함수
 *    - onOpenSearch: + 버튼 클릭 시 실행할 함수
 *    - theme: 현재 테마 (light/dark)
 * 
 * 🔌 백엔드 연동 시 필요한 데이터 형식:
 *    chats = [
 *      {
 *        id: 1,                    // 채팅방 고유 번호
 *        userId: 'jenny.kim',      // 상대방 아이디
 *        userName: 'Jenny Kim',    // 상대방 이름 (화면에 표시)
 *        lastMessage: '안녕!',     // 마지막 메시지 미리보기
 *        time: '오후 4:33',        // 마지막 메시지 시간
 *        unread: 2,                // 안 읽은 메시지 개수 (빨간 숫자)
 *        avatar: '👤',             // 프로필 사진 (이모지 또는 이미지 URL)
 *        isPending: false          // 대기 중 여부 (메시지 안 보낸 방)
 *      },
 *      ...
 *    ]
 */

import { deleteDmRoom } from '../api/dmApi';
import '../css/DmList.css';

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChatList({ chats, onSelectChat, onOpenSearch, onDeleteChat, themeClass = 'light' }) {
  // 🎨 themeClass는 부모에서 직접 전달받음 (전역 ThemeContext 사용)

  return (
    <div className="chat-list">
      {/* ====================================== */}
      {/* 📌 헤더 영역: 제목 + 새 채팅 버튼 */}
      {/* ====================================== */}
      <div className={`chat-list-header ${themeClass}`}>
        <h1 className={`chat-list-title ${themeClass}`}>DM</h1>
        
        {/* ➕ 새로운 채팅 시작 버튼 */}
        <button 
          onClick={onOpenSearch}  // 클릭하면 사용자 검색 모달 열기
          className={`chat-list-add-btn ${themeClass}`}
        >
          <PlusIcon />
        </button>
      </div>

      {/* ====================================== */}
      {/* 📜 채팅방 목록 (스크롤 가능) */}
      {/* ====================================== */}
      <div className="chat-list-scroll">
        {/* 🔄 각 채팅방을 하나씩 그리기 */}
        {chats.map((chat) => (
          <div
            key={chat.id}  // React가 각 항목 구분하는 데 사용
            onClick={() => onSelectChat(chat.id)}  // 클릭하면 이 채팅방으로 이동
            className={`chat-item ${themeClass}`}
          >
            {/* 👤 프로필 사진 */}
            <div className="chat-avatar">
              {chat.avatar}
              ${chat.userId}
              {/* 🔌 백엔드 연동 시 이미지 URL로 변경: */}
              {/* <img src={chat.avatarUrl} alt={chat.userName} /> */}
            </div>

            {/* 📝 채팅 정보 */}
            <div className="chat-info">
              {/* 윗줄: 이름 + 시간 */}
              <div className="chat-info-row">
                <h3 className={`chat-username ${themeClass}`}>{chat.userName}</h3>
                <span className={`chat-time ${themeClass}`}>{chat.time}</span>
              </div>
              
              {/* 아랫줄: 마지막 메시지 + 안 읽은 개수 */}
              <div className="chat-preview-row">
                <p className={`chat-last-message ${themeClass} ${chat.isPending ? 'pending' : ''}`}>
                  {chat.lastMessage}
                </p>
                
                {/* 🔴 안 읽은 메시지가 있으면 빨간 숫자 표시 */}
                {chat.unread > 0 && (
                  <span className="chat-unread-badge">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>

            {/* 🗑️ 채팅방 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // 채팅방 선택 이벤트 방지
                if (window.confirm(`${chat.userName}과의 채팅방을 삭제하시겠습니까?`)) {
                  deleteDmRoom(chat.id);
                }
              }}
              className={`chat-item-delete-btn ${themeClass}`}
              title="채팅방 삭제"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
