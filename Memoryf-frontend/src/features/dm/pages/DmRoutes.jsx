import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import ChatList from '../components/ChatList.jsx';
import ChatRoom from '../components/ChatRoom.jsx';
import UserSearchModal from '../components/UserSearchModal.jsx';
import ThemeSelector from '../components/ThemeSelector.jsx';
import { chatRoomsSeed, pendingChatsSeed } from '../data/chats.js';
import './DmRoutes.css';

export default function DmRoutes() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [chatRooms, setChatRooms] = useState(chatRoomsSeed);
  const [pendingChats, setPendingChats] = useState(pendingChatsSeed);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const allChats = [...pendingChats, ...chatRooms];

  const handleAddUser = (user) => {
    const newPendingChat = {
      id: `pending-${Date.now()}`,
      userId: user.userId,
      userName: user.userName,
      lastMessage: '대기 중',
      time: '대기',
      unread: 0,
      avatar: '👤',
      messages: [],
      isPending: true,
    };
    setPendingChats([newPendingChat, ...pendingChats]);
    setIsSearchModalOpen(false);
    navigate(`/messages/${newPendingChat.id}`);
  };

  const handleSendMessage = (chatId, messageText) => {
    const chat = allChats.find((c) => String(c.id) === String(chatId));

    if (chat?.isPending) {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isMine: true,
      };

      const activatedChat = {
        ...chat,
        id: Date.now(),
        messages: [newMessage],
        lastMessage: messageText,
        time: '방금',
        isPending: false,
      };

      setPendingChats(pendingChats.filter((c) => String(c.id) !== String(chatId)));
      setChatRooms([activatedChat, ...chatRooms]);
      navigate(`/messages/${activatedChat.id}`);
    } else {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isMine: true,
      };

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

  return (
    <div className={`dm-container ${theme}`}>
      {/* 카드 형태의 DM 컨테이너 */}
      <div className={`dm-card ${theme}`}>
        <Routes>
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
          <Route
            path=":chatId"
            element={
              <DmChatPage
                allChats={allChats}
                onBack={() => navigate('/messages')}
                onSendMessage={handleSendMessage}
                theme={theme}
              />
            }
          />
        </Routes>
      </div>

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

function DmRoomListPage({ allChats, theme, setTheme, openSearch, navigateToChat }) {
  return (
    <div className="dm-room-list-page">
      <ChatList
        chats={allChats}
        onSelectChat={navigateToChat}
        onOpenSearch={openSearch}
        theme={theme}
      />
      <ThemeSelector theme={theme} onThemeChange={setTheme} />
    </div>
  );
}

function DmChatPage({ allChats, onBack, onSendMessage, theme }) {
  const { chatId } = useParams();
  const selectedChat = allChats.find((chat) => String(chat.id) === String(chatId));

  if (!selectedChat) {
    return (
      <div className="dm-not-found">
        채팅을 찾을 수 없습니다.
      </div>
    );
  }

  return <ChatRoom chat={selectedChat} onBack={onBack} onSendMessage={onSendMessage} theme={theme} />;
}
