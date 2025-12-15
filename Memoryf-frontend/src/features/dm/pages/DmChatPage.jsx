import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { themes } from '../themes';
import { getAppStyles, getMobileFrameStyle } from '../styles/appStyles';

/**
 * DmChatPage - 채팅방 페이지
 * 
 * 이 페이지는 특정 채팅방의 대화 내용을 보여주는 페이지예요!
 * ChatWindow 컴포넌트를 사용해서 채팅 내용을 표시해요.
 */
function DmChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // URL에서 채팅방 ID를 가져와요
  const { chatId } = useParams();
  // 현재 사용 중인 테마 색상을 저장하는 변수 (기본값: 핑크)
  const [currentTheme, setCurrentTheme] = useState(themes.pink);
  
  // URL state에서 채팅방 이름을 가져오거나 기본값 사용
  // (실제로는 서버에서 채팅방 정보를 가져와야 해요)
  const chatName = location.state?.chatName || `채팅방 ${chatId}`;

  // 채팅방에서 목록으로 돌아갈 때 실행되는 함수
  const handleBackToList = () => {
    navigate('/messages');
  };

  // 채팅방 정보 객체 (실제로는 서버에서 가져와야 해요)
  const chat = {
    id: chatId,
    name: chatName,
  };

  return (
    <div style={getAppStyles(currentTheme)}>
      <div style={getMobileFrameStyle()}>
        <ChatWindow
          chat={chat}
          onBack={handleBackToList}
          currentTheme={currentTheme}
        />
      </div>
    </div>
  );
}

export default DmChatPage;

