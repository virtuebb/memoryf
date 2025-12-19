/**
 * 📱 DM(다이렉트 메시지) 메인 페이지
 * 
 * 🎯 이 파일이 하는 일:
 *    - 채팅방 목록 보여주기
 *    - 새로운 채팅 시작하기
 *    - 메시지 보내기
 *    - DmContext를 통해 FloatingDm과 데이터 동기화
 * 
 * 🔌 백엔드 연동 시 필요한 API:
 *    1. GET /api/dm/rooms - 내 채팅방 목록 가져오기
 *    2. POST /api/dm/rooms - 새 채팅방 만들기
 *    3. POST /api/dm/rooms/{roomId}/messages - 메시지 보내기
 *    4. GET /api/dm/rooms/{roomId}/messages - 메시지 목록 가져오기
 */

import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '../../../shared/components/ThemeContext';
import { useDm } from '../context/DmContext';
import ChatList from '../components/DmList.jsx';
import ChatRoom from '../components/DmRoom.jsx';
import UserSearchModal from '../components/UserSearchModal.jsx';
import ThemeSelector from '../components/ThemeSelector.jsx';
import './css/DmRoutes.css';

export default function DmRoutes() {
  // 📍 페이지 이동할 때 사용하는 도구
  const navigate = useNavigate();
  // 📍 현재 URL 정보 가져오기 (라우팅 변경 감지용)
  const location = useLocation();
  
  // 🎨 전역 테마 사용 (ThemeContext에서 가져옴)
  const { theme } = useTheme();
  const isDark = theme?.name === 'Night';
  const themeClass = isDark ? 'dark' : 'light';
  
  // 💬 DmContext에서 상태와 함수 가져오기 (FloatingDm과 동기화!)
  const {
    allChats,
    isSearchModalOpen,
    handleMarkAsRead,
    handleAddUser,
    handleSendMessage,
    openSearchModal,
    closeSearchModal,
  } = useDm();

  /**
   * 👤 새로운 사용자와 채팅 시작하기
   */
  const onAddUser = async (user) => {

    console.log(user);
    try {
      const newChat = await handleAddUser(user);
      closeSearchModal();
      navigate(`/messages/${newChat.id}`);
    } catch (error) {
      console.error('새 채팅 생성 실패:', error);
      // 실패해도 모달 닫기
      closeSearchModal();
    }
  };

  /**
   * 📤 메시지 보내기 (DmRoutes 전용 - navigate 필요)
   */
  const onSendMessage = (chatId, messageText) => {
    const activatedChat = handleSendMessage(chatId, messageText);

    // 성공했을 시
    if (activatedChat) {
      navigate(`/messages/${activatedChat.id}`);
    }
  };

  // ============================================
  // 🎨 화면 그리기
  // ============================================
  return (
    <div className="dm-container">
      {/* 📦 카드 형태의 DM 컨테이너 */}
      <div className="dm-card">
        <Routes location={location} key={location.pathname}>
          {/* 📋 채팅방 목록 페이지 */}
          <Route
            index
            element={
              <DmRoomListPage
                allChats={allChats}
                themeClass={themeClass}
                openSearch={openSearchModal}
                navigateToChat={(chatId) => navigate(`/messages/${chatId}`)}
              />
            }
          />
          {/* 💬 개별 채팅방 페이지 */}
          <Route
            path=":chatId"
            element={
              <DmChatPage
                allChats={allChats}
                onBack={() => navigate('/messages')}
                onSendMessage={onSendMessage}
                onMarkAsRead={handleMarkAsRead}
                themeClass={themeClass}
              />
            }
          />
        </Routes>
      </div>

      {/* 🔍 사용자 검색 모달 */}
      {isSearchModalOpen && (
        <UserSearchModal
          onClose={closeSearchModal}
          onAddUser={onAddUser}
          existingUserIds={allChats.map((chat) => chat.userId)}
        />
      )}
    </div>
  );
}

/**
 * 📋 채팅방 목록 페이지 컴포넌트
 */
function DmRoomListPage({ allChats, themeClass, openSearch, navigateToChat }) {
  return (
    <div className="dm-room-list-page">
      {/* 채팅방 목록 */}
      <ChatList
        chats={allChats}
        onSelectChat={navigateToChat}
        onOpenSearch={openSearch}
        themeClass={themeClass}
      />
      {/* 테마 선택 버튼들 - 전역 ThemeContext 사용 */}
      <ThemeSelector />
    </div>
  );
}

/**
 * 💬 개별 채팅방 페이지 컴포넌트
 * 
 * 🔌 백엔드 연동 시:
 *    GET /dm/rooms/{chatId}/messages
 *    → 이 채팅방의 메시지 목록 가져오기
 */
function DmChatPage({ allChats, onBack, onSendMessage, onMarkAsRead, themeClass }) {
  // 🔗 URL에서 채팅방 ID 가져오기 (예: /messages/123 → chatId = "123")
  const { chatId } = useParams();
  
  // 🔍 해당 ID의 채팅방 찾기
  const selectedChat = allChats.find((chat) => String(chat.id) === String(chatId));

  // ❌ 채팅방을 못 찾으면 에러 메시지 표시
  if (!selectedChat) {
    return (
      <div className="dm-not-found">
        채팅을 찾을 수 없습니다.
      </div>
    );
  }

  // ✅ 채팅방 화면 보여주기
  return (
    <ChatRoom 
      chat={selectedChat} 
      onBack={onBack} 
      onSendMessage={onSendMessage} 
      onMarkAsRead={onMarkAsRead}
      themeClass={themeClass} 
    />
  );
}
