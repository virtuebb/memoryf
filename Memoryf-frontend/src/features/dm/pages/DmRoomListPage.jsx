import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatList from '../components/ChatList';
import { themes } from '../themes';
import { getAppStyles, getMobileFrameStyle } from '../styles/appStyles';

// 초기 채팅방 목록 데이터 (나중에 서버에서 가져올 거예요)
const INITIAL_CHATS = [
  { id: 1, name: 'Jenny Kim', message: '다음주에 콜라보 관련해서 이야기해요!', time: '오후 4:33', unread: 2, profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: true },
  { id: 2, name: '@cool_guy.99', message: '생일 축하해!🥳', time: '어제', unread: 0, profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: true },
  { id: 3, name: 'minji_luv', message: '카페는 다음주에 가요!', time: '1일 전', unread: 1, profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: true },
  { id: 4, name: 'travel.ha', message: '이탈리아 사진 너무 예뻐요.', time: '3일 전', unread: 0, profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: true },
];

// localStorage에서 채팅방 목록을 불러오는 함수
// 브라우저를 닫아도 새로 만든 채팅방이 유지돼요
const loadChatsFromStorage = () => {
  try {
    const savedChats = localStorage.getItem('dm_chats');
    if (savedChats) {
      return JSON.parse(savedChats);
    }
  } catch (error) {
    console.warn('채팅방 목록을 불러오는 중 오류 발생:', error);
  }
  return INITIAL_CHATS;
};

// localStorage에 채팅방 목록을 저장하는 함수
const saveChatsToStorage = (chats) => {
  try {
    localStorage.setItem('dm_chats', JSON.stringify(chats));
  } catch (error) {
    console.warn('채팅방 목록을 저장하는 중 오류 발생:', error);
  }
};

/**
 * DmRoomListPage - 채팅방 목록 페이지
 * 
 * 이 페이지는 모든 채팅방 목록을 보여주는 페이지예요!
 * ChatList 컴포넌트를 사용해서 채팅방 목록을 표시해요.
 * 
 * 핵심 기능:
 * 1. 채팅방 목록을 상태로 관리해요
 * 2. 새 채팅방을 만들면 목록에 추가해요
 * 3. 뒤로가기로 돌아와도 새로 만든 채팅방이 목록에 보여요
 */
function DmRoomListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 현재 사용 중인 테마 색상을 저장하는 변수 (기본값: 핑크)
  const [currentTheme, setCurrentTheme] = useState(themes.pink);
  // 채팅방 목록을 저장하는 변수 (새 채팅방이 추가되면 여기에 저장돼요)
  // localStorage에서 불러온 목록을 초기값으로 사용해요
  const [chats, setChats] = useState(() => loadChatsFromStorage());

  // 채팅방 목록이 변경될 때마다 localStorage에 저장해요
  // 이렇게 하면 브라우저를 닫아도 새로 만든 채팅방이 유지돼요
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  // 페이지가 마운트되거나 location이 변경될 때 실행되는 함수
  // 뒤로가기로 돌아왔을 때 새로 만든 채팅방을 목록에 추가해요
  useEffect(() => {
    // location.state에서 새로 만든 채팅방 정보를 확인해요
    if (location.state?.newChat) {
      const newChat = location.state.newChat;
      
      // 이미 목록에 있는 채팅방인지 확인하고, 없으면 추가해요
      setChats(prevChats => {
        const existingChat = prevChats.find(chat => chat.id === newChat.id);
        
        if (!existingChat) {
          // 목록에 없는 새 채팅방이면 목록 맨 위에 추가해요
          const newChatWithRoom = {
            ...newChat,
            hasChatRoom: true,
            message: '', // 새 채팅방이므로 메시지가 없어요
            time: '방금',
            unread: 0,
          };
          
          // localStorage에도 저장하기 위해 반환해요 (위의 useEffect가 자동으로 저장해줘요)
          return [newChatWithRoom, ...prevChats];
        }
        
        return prevChats;
      });
      
      // state를 정리해서 중복 추가를 방지해요
      window.history.replaceState({ ...location.state, newChat: null }, '');
    }
  }, [location.state]);

  // 기존 채팅방을 선택했을 때 실행되는 함수
  // 채팅방 페이지로 이동해요
  const handleSelectChat = (chatId, chatName) => {
    navigate(`/messages/${chatId}`, { state: { chatName } });
  };

  // 새 채팅방을 시작할 때 실행되는 함수
  // 새 채팅방 페이지로 이동하고, 목록에도 추가해요
  const handleStartNewChat = (chat) => {
    // 새 채팅방 정보를 만들어요
    const newChat = {
      id: chat.id,
      name: chat.name,
      profileUrl: chat.profileUrl || '/src/assets/images/profiles/bono.jpg',
    };
    
    // 이미 목록에 있는 채팅방인지 확인해요
    const existingChat = chats.find(c => c.id === chat.id);
    
    if (!existingChat) {
      // 목록에 없는 새 채팅방이면 목록에 추가해요
      const newChatWithRoom = {
        ...newChat,
        hasChatRoom: true,
        message: '', // 새 채팅방이므로 메시지가 없어요
        time: '방금',
        unread: 0,
      };
      
      setChats(prevChats => [newChatWithRoom, ...prevChats]);
    }
    
    // 새 채팅방 페이지로 이동해요
    // state에 newChat 정보를 담아서 뒤로가기 시에도 인식할 수 있게 해요
    navigate(`/messages/${chat.id}`, { 
      state: { 
        chatName: chat.name, 
        isNew: true,
        newChat: newChat // 뒤로가기 시 목록에 추가하기 위한 정보
      } 
    });
  };

  // 테마 색상을 바꿀 때 실행되는 함수
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <div style={getAppStyles(currentTheme)}>
      <div style={getMobileFrameStyle()}>
        {/* ChatList 컴포넌트에 채팅방 목록을 전달해요 */}
        <ChatList
          chats={chats} // 채팅방 목록을 props로 전달
          onSelectChat={handleSelectChat}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onStartNewChat={handleStartNewChat}
        />
      </div>
    </div>
  );
}

export default DmRoomListPage;
