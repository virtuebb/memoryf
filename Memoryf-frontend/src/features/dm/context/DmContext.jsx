/**
 * 💬 DM Context - 채팅 상태 전역 관리
 * 
 * 🎯 이 파일이 하는 일:
 *    - 플로팅 DM과 DmRoutes 페이지가 같은 데이터를 공유
 *    - 채팅방 목록, 메시지, 읽음 처리 등을 한 곳에서 관리
 * 
 * 📦 사용법:
 *    1. App.jsx에서 DmProvider로 감싸기
 *    2. 컴포넌트에서 useDm() 훅으로 상태와 함수 사용
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { chatRoomsSeed, pendingChatsSeed } from '../data/chats.js';

// Context 생성
const DmContext = createContext(null);

/**
 * DM Provider - 앱 전체에서 채팅 상태 공유
 */
export function DmProvider({ children }) {
  // 💬 채팅방 목록 (실제 대화가 있는 방)
  const [chatRooms, setChatRooms] = useState(chatRoomsSeed);
  
  // ⏳ 대기 중인 채팅 (아직 메시지를 안 보낸 방)
  const [pendingChats, setPendingChats] = useState(pendingChatsSeed);
  
  // 🔍 사용자 검색 모달 열기/닫기
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 📋 모든 채팅방 합치기 (대기 중 + 진행 중)
  const allChats = [...pendingChats, ...chatRooms];

  // 🔢 총 읽지 않은 메시지 수
  const totalUnread = allChats.reduce((sum, chat) => sum + (chat.unread || 0), 0);

  /**
   * 👀 채팅방 읽음 처리
   */
  const handleMarkAsRead = useCallback((chatId) => {
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        String(room.id) === String(chatId)
          ? { ...room, unread: 0 }
          : room
      )
    );
    setPendingChats((prevChats) =>
      prevChats.map((room) =>
        String(room.id) === String(chatId)
          ? { ...room, unread: 0 }
          : room
      )
    );
  }, []);

  /**
   * 👤 새로운 사용자와 채팅 시작하기
   * @returns {Object} 새로 생성된 채팅방 객체
   */
  const handleAddUser = useCallback((user) => {
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
    
    setPendingChats((prev) => [newPendingChat, ...prev]);
    return newPendingChat;
  }, []);

  /**
   * 📤 메시지 보내기
   * @returns {Object|null} 활성화된 채팅방 객체 (대기→활성화 시) 또는 null
   */
  const handleSendMessage = useCallback((chatId, messageText) => {
    const chat = [...pendingChats, ...chatRooms].find((c) => String(c.id) === String(chatId));

    if (chat?.isPending) {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        time: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }),
        isMine: true,
        isRead: false,
      };

      const activatedChat = {
        ...chat,
        id: Date.now(),
        messages: [newMessage],
        lastMessage: messageText,
        time: '방금',
        isPending: false,
      };

      setPendingChats((prev) => prev.filter((c) => String(c.id) !== String(chatId)));
      setChatRooms((prev) => [activatedChat, ...prev]);
      
      return activatedChat; // 새 ID 반환 (라우팅용)
    } else {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        time: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }),
        isMine: true,
        isRead: false,
      };

      setChatRooms((prev) =>
        prev.map((room) =>
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
      
      return null;
    }
  }, [chatRooms, pendingChats]);

  /**
   * 🔍 검색 모달 열기/닫기
   */
  const openSearchModal = useCallback(() => setIsSearchModalOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchModalOpen(false), []);

  // Context value
  const value = {
    // 상태
    chatRooms,
    pendingChats,
    allChats,
    totalUnread,
    isSearchModalOpen,
    
    // 함수
    handleMarkAsRead,
    handleAddUser,
    handleSendMessage,
    openSearchModal,
    closeSearchModal,
  };

  return (
    <DmContext.Provider value={value}>
      {children}
    </DmContext.Provider>
  );
}

/**
 * useDm 훅 - DM 상태와 함수 사용
 */
export function useDm() {
  const context = useContext(DmContext);
  
  if (!context) {
    throw new Error('useDm must be used within a DmProvider');
  }
  
  return context;
}

