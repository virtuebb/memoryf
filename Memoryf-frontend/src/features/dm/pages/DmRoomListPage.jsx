import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import { themes } from '../themes';
import { getAppStyles, getMobileFrameStyle } from '../styles/appStyles';

/**
 * DmRoomListPage - 채팅방 목록 페이지
 * 
 * 이 페이지는 모든 채팅방 목록을 보여주는 페이지예요!
 * ChatList 컴포넌트를 사용해서 채팅방 목록을 표시해요.
 */
function DmRoomListPage() {
  const navigate = useNavigate();
  // 현재 사용 중인 테마 색상을 저장하는 변수 (기본값: 핑크)
  const [currentTheme, setCurrentTheme] = useState(themes.pink);

  // 기존 채팅방을 선택했을 때 실행되는 함수
  // 채팅방 페이지로 이동해요
  const handleSelectChat = (chatId, chatName) => {
    navigate(`/messages/${chatId}`, { state: { chatName } });
  };

  // 새 채팅방을 시작할 때 실행되는 함수
  // 새 채팅방 페이지로 이동해요
  const handleStartNewChat = (chat) => {
    navigate(`/messages/${chat.id}`, { state: { chatName: chat.name, isNew: true } });
  };

  // 테마 색상을 바꿀 때 실행되는 함수
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <div style={getAppStyles(currentTheme)}>
      <div style={getMobileFrameStyle()}>
        <ChatList
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
