/**
 * DmWidget.jsx - DM 위젯 메인 컴포넌트
 * 
 * 이 컴포넌트는 DM(다이렉트 메시지) 기능의 전체를 관리하는 큰 상자예요!
 * 
 * 핵심 기능:
 * 1. 채팅방 목록 화면과 채팅방 화면을 전환해요
 * 2. 어떤 채팅방이 선택되었는지 기억해요
 * 3. 테마 색상을 관리해요 (핑크, 블루 등)
 * 4. 화면 오른쪽 아래에 DM 버튼이 있어요
 * 5. DM 버튼을 누르면 작은 창(PiP)으로 채팅을 할 수 있어요
 * 6. 작은 창은 드래그해서 옮기고 크기도 조절할 수 있어요
 */
import React, { useEffect, useRef, useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ModalOverlay from './ModalOverlay';
import { themes } from '../themes';
import { getAppStyles, getMobileFrameStyle } from '../styles/appStyles';

const DmWidget = () => {
  // 지금 어떤 화면을 보여줄지 저장하는 변수 ('list' 또는 'chat')
  const [currentScreen, setCurrentScreen] = useState('list');
  // 선택된 채팅방 정보를 저장하는 변수
  const [selectedChat, setSelectedChat] = useState(null);
  // 현재 사용 중인 테마 색상을 저장하는 변수 (기본값: 핑크)
  const [currentTheme, setCurrentTheme] = useState(themes.pink);
  // 작은 창(PiP)이 열려있는지 확인하는 변수
  const [pipOpen, setPipOpen] = useState(false);
  // 메인 위젯 사이즈 (사용자가 자유롭게 조절할 수 있게)
  const [size, setSize] = useState({ width: 420, height: 720 });
  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 420, height: 720 });
  const minSize = { width: 360, height: 560 }; // 최소 크기 제한

  // 새 채팅방을 시작할 때 실행되는 함수
  const handleStartNewChat = (chat) => {
    setSelectedChat({ id: chat.id, name: chat.name, isTemp: true });
    setCurrentScreen('chat');
  };

  // 기존 채팅방을 선택했을 때 실행되는 함수
  const handleSelectChat = (chatId, chatName) => {
    setSelectedChat({ id: chatId, name: chatName });
    setCurrentScreen('chat'); // 채팅방 화면으로 전환
  };

  // 채팅방에서 목록으로 돌아갈 때 실행되는 함수
  const handleBackToList = () => {
    setCurrentScreen('list'); // 목록 화면으로 전환
  };

  // 테마 색상을 바꿀 때 실행되는 함수
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  // 메인 위젯 리사이즈 시작
  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
    setResizing(true);
  };

  // 마우스 드래그로 사이즈 조절
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizing) return;
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      const nextWidth = Math.max(minSize.width, resizeStart.current.width + deltaX);
      const nextHeight = Math.max(minSize.height, resizeStart.current.height + deltaY);
      setSize({ width: nextWidth, height: nextHeight });
    };
    const onMouseUp = () => setResizing(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizing, size]);

  // 현재 화면에 맞는 컴포넌트를 보여주는 함수
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
      {/* 메인 DM 창을 사용자가 직접 리사이즈할 수 있어요 */}
      <div
        style={{
          ...getMobileFrameStyle(),
          position: 'relative',
          width: size.width,
          height: size.height,
          overflow: 'hidden',
          userSelect: resizing ? 'none' : 'auto',
        }}
      >
        {renderScreen()}
        {/* 오른쪽 아래 리사이즈 핸들 */}
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            right: '2px',
            bottom: '2px',
            cursor: 'nwse-resize',
            background:
              'conic-gradient(from 135deg, transparent 0deg 90deg, rgba(0,0,0,0.3) 90deg 180deg, transparent 180deg 270deg, rgba(0,0,0,0.3) 270deg 360deg)',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.15)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
            zIndex: 8,
            pointerEvents: 'auto',
          }}
          title="크기 조절"
        />
      </div>
      {/* 화면 오른쪽 아래에 떠있는 DM 버튼 (작은 창을 열고 닫을 수 있어요) */}
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
