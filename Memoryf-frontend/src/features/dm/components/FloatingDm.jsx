/**
 * 🎈 플로팅 DM 컴포넌트 (PIP 스타일)
 * 
 * 🎯 이 파일이 하는 일:
 *    - 화면 하단 모서리에 떠있는 DM 버튼
 *    - 클릭하면 채팅창이 열림
 *    - 모든 페이지에서 사용 가능
 *    - 드래그로 위치 이동 가능
 *    - DmContext를 통해 DmRoutes와 데이터 동기화
 * 
 * 📦 사용법:
 *    App.jsx에서 DmProvider, ThemeProvider 내부에 추가
 *    <FloatingDm />
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../../shared/components/ThemeContext';
import { useDm } from '../context/DmContext';
import ChatList from './DmList.jsx';
import ChatRoom from './DmRoom.jsx';
import UserSearchModal from './UserSearchModal.jsx';
import ThemeSelector from './ThemeSelector.jsx';
import '../css/FloatingDm.css';

// ============================================
// 🎨 아이콘 컴포넌트들
// ============================================

function MessageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FloatingDm() {
  // 🎨 전역 테마 사용
  const { theme } = useTheme();
  const isDark = theme?.name === 'Night';
  const themeClass = isDark ? 'dark' : 'light';

  // 💬 DmContext에서 상태와 함수 가져오기 (DmRoutes와 동기화!)
  const {
    allChats,
    totalUnread,
    isSearchModalOpen,
    handleMarkAsRead,
    handleAddUser,
    handleSendMessage,
    openSearchModal,
    closeSearchModal,
  } = useDm();

  // 📦 플로팅창 UI 상태 (로컬)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // 🖱️ 드래그 관련 상태
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // ============================================
  // 🖱️ 드래그 기능
  // ============================================
  const handleMouseDown = (e) => {
    if (e.target.closest('.floating-dm-header-btn')) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX + position.x,
      y: e.clientY + position.y
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = dragStartPos.current.x - e.clientX;
    const newY = dragStartPos.current.y - e.clientY;
    
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    
    setPosition({
      x: Math.max(20, Math.min(maxX, newX)),
      y: Math.max(20, Math.min(maxY, newY))
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  /**
   * 👤 새로운 사용자와 채팅 시작 (플로팅 DM 전용)
   */
  const onAddUser = async (user) => {
    try {
      const newChat = await handleAddUser(user);
      closeSearchModal();
      setSelectedChatId(newChat.id);
    } catch (error) {
      console.error('새 채팅 생성 실패:', error);
      closeSearchModal();
    }
  };

  /**
   * 📤 메시지 보내기 (플로팅 DM 전용)
   */
  const onSendMessage = (chatId, messageText) => {
    const activatedChat = handleSendMessage(chatId, messageText);
    if (activatedChat) {
      setSelectedChatId(activatedChat.id);
    }
  };

  // 🔍 현재 선택된 채팅방 찾기
  const selectedChat = allChats.find((chat) => String(chat.id) === String(selectedChatId));

  // ============================================
  // 🎨 화면 그리기
  // ============================================
  return (
    <>
      {/* 🎈 플로팅 버튼 (채팅창이 닫혀있을 때) */}
      {!isOpen && (
        <button
          ref={dragRef}
          className={`floating-dm-btn ${themeClass}`}
          style={{ right: position.x, bottom: position.y }}
          onClick={() => setIsOpen(true)}
          onMouseDown={handleMouseDown}
        >
          <MessageIcon />
          {totalUnread > 0 && (
            <span className="floating-dm-badge">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </button>
      )}

      {/* 💬 플로팅 채팅창 */}
      {isOpen && (
        <div
          className={`floating-dm-window ${themeClass}`}
          style={{ right: position.x, bottom: position.y }}
        >
          {/* 📌 헤더 (드래그 핸들) */}
          <div 
            className={`floating-dm-header ${themeClass}`}
            onMouseDown={handleMouseDown}
          >
            {selectedChatId ? (
              <>
                <button
                  onClick={() => setSelectedChatId(null)}
                  className={`floating-dm-header-btn ${themeClass}`}
                >
                  <ArrowLeftIcon />
                </button>
                <span className="floating-dm-header-title">
                  {selectedChat?.userName || 'DM'}
                </span>
              </>
            ) : (
              <span className="floating-dm-header-title">메시지</span>
            )}
            
            <div className="floating-dm-header-actions">
              <button
                onClick={() => setIsOpen(false)}
                className={`floating-dm-header-btn ${themeClass}`}
              >
                <MinimizeIcon />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedChatId(null);
                }}
                className={`floating-dm-header-btn ${themeClass}`}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* 📋 내용 영역 */}
          <div className="floating-dm-content">
            {selectedChatId && selectedChat ? (
              <ChatRoom
                chat={selectedChat}
                onBack={() => setSelectedChatId(null)}
                onSendMessage={onSendMessage}
                onMarkAsRead={handleMarkAsRead}
                themeClass={themeClass}
                hideHeader={true}
              />
            ) : (
              <div className="floating-dm-list-wrapper">
                <ChatList
                  chats={allChats}
                  onSelectChat={(chatId) => setSelectedChatId(chatId)}
                  onOpenSearch={openSearchModal}
                  themeClass={themeClass}
                />
                <ThemeSelector />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔍 사용자 검색 모달 */}
      {isSearchModalOpen && (
        <UserSearchModal
          onClose={closeSearchModal}
          onAddUser={onAddUser}
          existingUserIds={allChats.map((chat) => chat.userId)}
        />
      )}
    </>
  );
}
