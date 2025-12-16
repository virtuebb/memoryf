/**
 * 📱 DM(다이렉트 메시지) 메인 페이지
 * 
 * 🎯 이 파일이 하는 일:
 *    - 채팅방 목록 보여주기
 *    - 새로운 채팅 시작하기
 *    - 메시지 보내기
 * 
 * 🔌 백엔드 연동 시 필요한 API:
 *    1. GET /api/dm/rooms - 내 채팅방 목록 가져오기
 *    2. POST /api/dm/rooms - 새 채팅방 만들기
 *    3. POST /api/dm/rooms/{roomId}/messages - 메시지 보내기
 *    4. GET /api/dm/rooms/{roomId}/messages - 메시지 목록 가져오기
 */

import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import ChatList from '../components/ChatList.jsx';
import ChatRoom from '../components/ChatRoom.jsx';
import UserSearchModal from '../components/UserSearchModal.jsx';
import ThemeSelector from '../components/ThemeSelector.jsx';
import { chatRoomsSeed, pendingChatsSeed } from '../data/chats.js';
import './DmRoutes.css';

// ============================================
// 🔌 백엔드 연동할 때 이 부분을 수정하세요!
// ============================================
// const API_BASE_URL = 'http://localhost:8080/api/dm';

export default function DmRoutes() {
  // 📍 페이지 이동할 때 사용하는 도구
  const navigate = useNavigate();
  // 📍 현재 URL 정보 가져오기 (라우팅 변경 감지용)
  const location = useLocation();
  
  // 🎨 테마 설정 (밝은/어두운 모드)
  const [theme, setTheme] = useState('light');
  
  // 💬 채팅방 목록 (실제 대화가 있는 방)
  // 🔌 백엔드 연동: chatRoomsSeed 대신 API에서 가져온 데이터 사용
  const [chatRooms, setChatRooms] = useState(chatRoomsSeed);
  
  // ⏳ 대기 중인 채팅 (아직 메시지를 안 보낸 방)
  const [pendingChats, setPendingChats] = useState(pendingChatsSeed);
  
  // 🔍 사용자 검색 모달 열기/닫기
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 📋 모든 채팅방 합치기 (대기 중 + 진행 중)
  const allChats = [...pendingChats, ...chatRooms];

  /**
   * 👀 채팅방 읽음 처리 (useCallback으로 메모이제이션하여 무한 루프 방지)
   * 
   * @param {string|number} chatId - 읽음 처리할 채팅방 ID
   * 
   * 🔌 백엔드 연동 시:
   *    PUT /api/dm/rooms/{chatId}/read
   *    → 해당 채팅방의 모든 메시지를 읽음 처리
   */
  const handleMarkAsRead = useCallback((chatId) => {
    // 🔌 백엔드 연동 시 아래 코드로 교체:
    // try {
    //   await fetch(`${API_BASE_URL}/rooms/${chatId}/read`, {
    //     method: 'PUT',
    //     headers: {
    //       'Authorization': `Bearer ${로그인토큰}`
    //     }
    //   });
    // } catch (error) {
    //   console.error('읽음 처리 실패:', error);
    // }

    // 📌 현재는 더미 데이터로 작동 (백엔드 없이)
    // 활성화된 채팅방의 unread 카운트를 0으로 만들기
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        String(room.id) === String(chatId)
          ? { ...room, unread: 0 }
          : room
      )
    );
    
    // 대기 중인 채팅방도 처리
    setPendingChats((prevChats) =>
      prevChats.map((room) =>
        String(room.id) === String(chatId)
          ? { ...room, unread: 0 }
          : room
      )
    );
  }, []); // 빈 의존성 배열 - 함수가 한 번만 생성됨

  // ============================================
  // 🔌 백엔드 연동: 페이지 로드 시 채팅방 목록 가져오기
  // ============================================
  // useEffect(() => {
  //   const fetchChatRooms = async () => {
  //     try {
  //       // 📡 서버에 "내 채팅방 목록 줘!" 요청
  //       const response = await fetch(`${API_BASE_URL}/rooms`, {
  //         headers: {
  //           'Authorization': `Bearer ${로그인토큰}`
  //         }
  //       });
  //       const data = await response.json();
  //       
  //       // ✅ 서버에서 받은 데이터로 채팅방 목록 업데이트
  //       setChatRooms(data.chatRooms);
  //       setPendingChats(data.pendingChats);
  //     } catch (error) {
  //       console.error('채팅방 목록 가져오기 실패:', error);
  //     }
  //   };
  //   
  //   fetchChatRooms();
  // }, []);

  /**
   * 👤 새로운 사용자와 채팅 시작하기
   * 
   * @param {Object} user - 채팅할 사용자 정보
   *   - userId: 사용자 아이디
   *   - userName: 사용자 이름
   * 
   * 🔌 백엔드 연동 시:
   *    POST /api/dm/rooms
   *    Body: { targetUserId: user.userId }
   *    Response: { roomId: 123, ... }
   */
  const handleAddUser = async (user) => {
    // 🔌 백엔드 연동 시 아래 코드로 교체:
    // try {
    //   // 📡 서버에 "이 사람과 채팅방 만들어줘!" 요청
    //   const response = await fetch(`${API_BASE_URL}/rooms`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${로그인토큰}`
    //     },
    //     body: JSON.stringify({ targetUserId: user.userId })
    //   });
    //   
    //   const newRoom = await response.json();
    //   
    //   // ✅ 새 채팅방을 목록에 추가
    //   setChatRooms([newRoom, ...chatRooms]);
    //   setIsSearchModalOpen(false);
    //   navigate(`/messages/${newRoom.id}`);
    // } catch (error) {
    //   console.error('채팅방 생성 실패:', error);
    // }

    // 📌 현재는 더미 데이터로 작동 (백엔드 없이)
    const newPendingChat = {
      id: `pending-${Date.now()}`,  // 임시 ID (서버에서 진짜 ID 받아옴)
      userId: user.userId,
      userName: user.userName,
      lastMessage: '대기 중',
      time: '대기',
      unread: 0,
      avatar: '👤',
      messages: [],
      isPending: true,  // 아직 메시지 안 보냄 표시
    };
    
    setPendingChats([newPendingChat, ...pendingChats]);
    setIsSearchModalOpen(false);
    navigate(`/messages/${newPendingChat.id}`);
  };

  /**
   * 📤 메시지 보내기
   * 
   * @param {string|number} chatId - 채팅방 번호
   * @param {string} messageText - 보낼 메시지 내용
   * 
   * 🔌 백엔드 연동 시:
   *    POST /api/dm/rooms/{chatId}/messages
   *    Body: { content: messageText }
   *    Response: { messageId: 456, createdAt: "2024-01-15T10:30:00", ... }
   */
  const handleSendMessage = async (chatId, messageText) => {
    // 🔌 백엔드 연동 시 아래 코드로 교체:
    // try {
    //   // 📡 서버에 "이 메시지 보내줘!" 요청
    //   const response = await fetch(`${API_BASE_URL}/rooms/${chatId}/messages`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${로그인토큰}`
    //     },
    //     body: JSON.stringify({ content: messageText })
    //   });
    //   
    //   const sentMessage = await response.json();
    //   
    //   // ✅ 보낸 메시지를 화면에 추가
    //   // (실시간 채팅은 WebSocket으로 구현하면 더 좋아요!)
    // } catch (error) {
    //   console.error('메시지 전송 실패:', error);
    // }

    // 📌 현재는 더미 데이터로 작동 (백엔드 없이)
    const chat = allChats.find((c) => String(c.id) === String(chatId));

    // ⏳ 대기 중인 채팅방이면 → 활성화된 채팅방으로 변경
    if (chat?.isPending) {
      const newMessage = {
        id: Date.now(),  // 임시 ID (서버에서 진짜 ID 받아옴)
        text: messageText,
        time: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }),
        isMine: true,  // 내가 보낸 메시지
        isRead: false, // 👀 아직 상대방이 안 읽음
      };

      const activatedChat = {
        ...chat,
        id: Date.now(),  // 새로운 ID 부여
        messages: [newMessage],
        lastMessage: messageText,
        time: '방금',
        isPending: false,  // 이제 활성화됨!
      };

      // 대기 목록에서 제거하고 활성 목록에 추가
      setPendingChats(pendingChats.filter((c) => String(c.id) !== String(chatId)));
      setChatRooms([activatedChat, ...chatRooms]);
      navigate(`/messages/${activatedChat.id}`);
    } 
    // 💬 이미 활성화된 채팅방이면 → 메시지만 추가
    else {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        time: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }),
        isMine: true,
        isRead: false, // 👀 아직 상대방이 안 읽음
      };

      // 해당 채팅방에 새 메시지 추가
      setChatRooms(
        chatRooms.map((room) =>
          String(room.id) === String(chatId)
            ? {
                ...room,
                messages: [...room.messages, newMessage],
                lastMessage: messageText,
                time: '방금',
              }
            : room
        )
      );
    }
  };

  // ============================================
  // 🎨 화면 그리기
  // ============================================
  return (
    <div className={`dm-container ${theme}`}>
      {/* 📦 카드 형태의 DM 컨테이너 */}
      <div className={`dm-card ${theme}`}>
        <Routes location={location} key={location.pathname}>
          {/* 📋 채팅방 목록 페이지 */}
          <Route
            index
            element={
              <DmRoomListPage
                allChats={allChats}
                theme={theme}
                setTheme={setTheme}
                openSearch={() => setIsSearchModalOpen(true)}
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
                onSendMessage={handleSendMessage}
                onMarkAsRead={handleMarkAsRead}
                theme={theme}
              />
            }
          />
        </Routes>
      </div>

      {/* 🔍 사용자 검색 모달 */}
      {isSearchModalOpen && (
        <UserSearchModal
          onClose={() => setIsSearchModalOpen(false)}
          onAddUser={handleAddUser}
          existingUserIds={allChats.map((chat) => chat.userId)}
        />
      )}
    </div>
  );
}

/**
 * 📋 채팅방 목록 페이지 컴포넌트
 */
function DmRoomListPage({ allChats, theme, setTheme, openSearch, navigateToChat }) {
  return (
    <div className="dm-room-list-page">
      {/* 채팅방 목록 */}
      <ChatList
        chats={allChats}
        onSelectChat={navigateToChat}
        onOpenSearch={openSearch}
        theme={theme}
      />
      {/* 테마 선택 버튼들 */}
      <ThemeSelector theme={theme} onThemeChange={setTheme} />
    </div>
  );
}

/**
 * 💬 개별 채팅방 페이지 컴포넌트
 * 
 * 🔌 백엔드 연동 시:
 *    GET /api/dm/rooms/{chatId}/messages
 *    → 이 채팅방의 메시지 목록 가져오기
 */
function DmChatPage({ allChats, onBack, onSendMessage, onMarkAsRead, theme }) {
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
      theme={theme} 
    />
  );
}
