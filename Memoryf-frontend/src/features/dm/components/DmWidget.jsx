import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ModalOverlay from './ModalOverlay';
import { themes } from '../themes';
import { getAppStyles, getMobileFrameStyle } from '../styles/appStyles';

// DM/PiP 기능을 하나의 컴포넌트로 묶은 위젯
const DmWidget = () => {
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(themes.pink);
  const [pipOpen, setPipOpen] = useState(false);

  const handleStartNewChat = (chat) => {
    setSelectedChat({ id: chat.id, name: chat.name, isTemp: true });
    setCurrentScreen('chat');
  };

  const handleSelectChat = (chatId, chatName) => {
    setSelectedChat({ id: chatId, name: chatName });
    setCurrentScreen('chat');
  };

  const handleBackToList = () => {
    setCurrentScreen('list');
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const renderScreen = () => {
    if (currentScreen === 'list') {
      return (
        <ChatList
          onSelectChat={handleSelectChat}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onStartNewChat={handleStartNewChat}
        />
      );
    }
    if (currentScreen === 'chat' && selectedChat) {
      return (
        <ChatWindow
          chat={selectedChat}
          onBack={handleBackToList}
          currentTheme={currentTheme}
        />
      );
    }
    return null;
  };

  return (
    <div style={getAppStyles(currentTheme)}>
      <div style={getMobileFrameStyle()}>
        {renderScreen()}
      </div>
      {/* Floating toggle for PiP overlay */}
      <button
        onClick={() => setPipOpen(!pipOpen)}
        title={pipOpen ? 'Close PiP' : 'Open PiP'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9998,
          width: '63px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: currentTheme.primary,
          color: '#333333',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          fontWeight: 700,
          justifyContent: 'center',
        }}
      >
        {pipOpen ? '×' : 'DM'}
      </button>

      {pipOpen && (
        <ModalOverlay
          title={selectedChat ? selectedChat.name : 'DM'}
          theme={currentTheme}
          onClose={() => setPipOpen(false)}
        >
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              onBack={() => setSelectedChat(null)}
              currentTheme={currentTheme}
            />
          ) : (
            <ChatList
              onSelectChat={(id, name) => setSelectedChat({ id, name })}
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
              onStartNewChat={handleStartNewChat}
            />
          )}
        </ModalOverlay>
      )}
    </div>
  );
};

export default DmWidget;
