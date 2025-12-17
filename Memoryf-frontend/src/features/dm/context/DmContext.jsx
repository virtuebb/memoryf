/**
 * 💬 DM Context - 채팅 상태 전역 관리 + WebSocket 실시간 통신
 * 
 * 🎯 이 파일이 하는 일:
 *    - 플로팅 DM과 DmRoutes 페이지가 같은 데이터를 공유
 *    - 채팅방 목록, 메시지, 읽음 처리 등을 한 곳에서 관리
 *    - WebSocket을 통한 실시간 메시지 송수신
 * 
 * 📦 사용법:
 *    1. App.jsx에서 DmProvider로 감싸기
 *    2. 컴포넌트에서 useDm() 훅으로 상태와 함수 사용
 * 
 * 🔌 WebSocket 연결:
 *    - 엔드포인트: http://localhost:8006/memoryf/ws
 *    - 구독: /sub/private/{myUserId}
 *    - 발행: /pub/chat/private
 */

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { chatRoomsSeed, pendingChatsSeed } from '../data/chats.js';
import * as SockJSModule from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// CommonJS/ESM 호환성 처리
const SockJS = SockJSModule.default || SockJSModule;

// 🌐 WebSocket 서버 URL
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8006/memoryf/ws';

/**
 * 🧪 테스트용 사용자 ID 가져오기
 * 
 * 사용 방법:
 *   탭 1: http://localhost:5173/messages?userId=user1
 *   탭 2: http://localhost:5173/messages?userId=user2
 * 
 * URL에 userId가 없으면 localStorage 확인, 그것도 없으면 'user1' 기본값 사용
 */
const getCurrentUserId = () => {
  // 1. URL 파라미터에서 userId 확인
  const urlParams = new URLSearchParams(window.location.search);
  const urlUserId = localStorage.getItem("memberId")
  // url에서 userId를 가져옴. 예: http://localhost:5173/messages?userId=user1
  // 나중에는 세션에 담긴 사용자 아이디를 가져 오면 될듯
  
  if (urlUserId) {
    // URL에서 가져온 ID를 localStorage에도 저장 (새로고침 대비)
    localStorage.setItem('testUserId', urlUserId);
    return urlUserId;
  }
  
  // 2. localStorage에서 확인
  const storedUserId = localStorage.getItem('testUserId');
  if (storedUserId) {
    return storedUserId;
  }
  
  // 3. 기본값
  return 'user1';
};

// Context 생성
const DmContext = createContext(null);

/**
 * DM Provider - 앱 전체에서 채팅 상태 공유 + WebSocket 관리
 */
export function DmProvider({ children }) {
  // 💬 채팅방 목록 (실제 대화가 있는 방)
  const [chatRooms, setChatRooms] = useState(chatRoomsSeed);
  
  // ⏳ 대기 중인 채팅 (아직 메시지를 안 보낸 방)
  const [pendingChats, setPendingChats] = useState(pendingChatsSeed);
  
  // 🔍 사용자 검색 모달 열기/닫기
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 🔌 WebSocket 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);

  // 👤 현재 사용자 ID (URL 파라미터 또는 localStorage에서 가져옴)
  const [myUserId] = useState(() => getCurrentUserId());
  
  // 👁️ 현재 보고 있는 채팅방의 상대방 ID (읽음 처리용)
  const currentViewingUserIdRef = useRef(null);

  // 📋 모든 채팅방 합치기 (대기 중 + 진행 중)
  const allChats = [...pendingChats, ...chatRooms];

  // 🔢 총 읽지 않은 메시지 수
  const totalUnread = allChats.reduce((sum, chat) => sum + (chat.unread || 0), 0);

  // ============================================
  // 🔌 WebSocket 연결 관리
  // ============================================
  
  /**
   * 📡 WebSocket 서버에 연결
   */
  const connectWebSocket = useCallback(() => {
    if (stompClientRef.current || isConnected) {
      console.log('⚠️ 이미 WebSocket에 연결되어 있습니다.');
      return;
    }

    console.log(`📡 WebSocket 연결 시도: ${WS_URL} (사용자: ${myUserId})`);

    try {
      const stompClient = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        debug: (str) => {
          // 디버그 로그 (필요시 활성화)
          // console.log('STOMP:', str);
        },
        reconnectDelay: 5000,
        
        onConnect: () => {
          console.log(`✅ [${myUserId}] WebSocket 연결 성공`);
          setIsConnected(true);
          stompClientRef.current = stompClient;

          // 내게 오는 메시지 구독
          stompClient.subscribe(`/sub/private/${myUserId}`, (msg) => {
            const data = JSON.parse(msg.body);
            console.log('📩 메시지 수신:', data);
            
            // 받은 메시지를 해당 채팅방에 추가
            handleReceiveMessage(data);
          });
        },
        
        onStompError: (frame) => {
          console.error('❌ STOMP 에러:', frame.headers['message']);
        },
        
        onWebSocketError: (event) => {
          console.error('❌ WebSocket 에러:', event);
        },
        
        onDisconnect: () => {
          console.log('🔌 WebSocket 연결 해제됨');
          setIsConnected(false);
        }
      });

      stompClient.activate();
      
    } catch (error) {
      console.error('❌ WebSocket 연결 오류:', error);
    }
  }, [myUserId, isConnected]);

  /**
   * 🔌 WebSocket 연결 해제
   */
  const disconnectWebSocket = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
      console.log('🔌 WebSocket 연결 해제');
    }
  }, []);

  /**
   * 📩 WebSocket으로 받은 데이터 처리
   * - type: 'message' → 일반 메시지
   * - type: 'read' → 읽음 이벤트
   */
  const handleReceiveMessage = useCallback((data) => {
    // data = { type, roomId, sender, content }
    const { type, sender, content } = data;
    
    // 👀 읽음 이벤트 처리 (type이 'read'이거나, content가 빈 문자열인 경우)
    if (type === 'read' || (content === '' && type !== 'message')) {
      console.log(`👀 [${sender}]가 내 메시지를 읽음`);
      
      // 상대방(sender)과의 채팅방에서 내가 보낸 메시지들을 읽음 처리
      setChatRooms((prevRooms) => {
        return prevRooms.map(room => {
          if (room.userId === sender) {
            return {
              ...room,
              messages: room.messages.map(msg => 
                msg.isMine ? { ...msg, isRead: true } : msg
              )
            };
          }
          return room;
        });
      });
      return;  // 읽음 이벤트는 여기서 끝!
    }
    
    // 💬 일반 메시지 처리 (content가 있는 경우만)
    if (!content || content.trim() === '') {
      console.log('⚠️ 빈 메시지 무시');
      return;  // 빈 메시지는 무시
    }
    
    // 👁️ 현재 이 사람과의 채팅방을 보고 있으면 즉시 읽음 이벤트 전송!
    const isCurrentlyViewing = currentViewingUserIdRef.current === sender;
    
    if (isCurrentlyViewing && stompClientRef.current) {
      // 상대방에게 "나 지금 이 채팅방 보고 있어! 바로 읽었어!" 알림
      stompClientRef.current.publish({
        destination: '/pub/chat/private',
        body: JSON.stringify({
          type: 'read',
          roomId: sender,      // 상대방에게 전송
          sender: myUserId,    // 내가 읽었다!
          content: ''
        })
      });
      console.log(`👀 즉시 읽음 이벤트 전송: ${myUserId} → ${sender} (채팅방 보는 중)`);
    }
    
    const newMessage = {
      id: Date.now(),
      text: content,
      time: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      isMine: false,  // 받은 메시지
      isRead: false,
    };

    // 해당 채팅방 찾기 (sender의 userId로)
    setChatRooms((prevRooms) => {
      const roomIndex = prevRooms.findIndex(room => room.userId === sender);
      
      if (roomIndex !== -1) {
        // 기존 채팅방에 메시지 추가
        const updatedRooms = [...prevRooms];
        updatedRooms[roomIndex] = {
          ...updatedRooms[roomIndex],
          messages: [...updatedRooms[roomIndex].messages, newMessage],
          lastMessage: content,
          time: '방금',
          // 현재 보고 있으면 unread 증가 안 함
          unread: isCurrentlyViewing ? 0 : updatedRooms[roomIndex].unread + 1,
        };
        return updatedRooms;
      } else {
        // 새로운 채팅방 생성 (처음 메시지 받는 경우)
        const newRoom = {
          id: Date.now(),
          userId: sender,
          userName: sender,  // 실제로는 서버에서 이름 가져와야 함
          lastMessage: content,
          time: '방금',
          unread: isCurrentlyViewing ? 0 : 1,
          avatar: '👤',
          messages: [newMessage],
          isPending: false,
        };
        return [newRoom, ...prevRooms];
      }
    });
  }, [myUserId]);

  // 🚀 컴포넌트 마운트 시 WebSocket 자동 연결
  useEffect(() => {
    connectWebSocket();
    
    // 언마운트 시 연결 해제
    return () => {
      disconnectWebSocket();
    };
  }, []);

  /**
   * 👀 채팅방 읽음 처리 + WebSocket으로 상대방에게 알림
   */
  const handleMarkAsRead = useCallback((chatId) => {
    // 해당 채팅방 찾기
    const chat = [...pendingChats, ...chatRooms].find(
      (c) => String(c.id) === String(chatId)
    );
    
    if (!chat) return;
    
    // 👁️ 현재 보고 있는 채팅방의 상대방 ID 저장 (새 메시지 즉시 읽음 처리용)
    currentViewingUserIdRef.current = chat.userId;
    console.log(`👁️ 현재 보는 채팅방 설정: ${chat.userId}`);
    
    // 🔌 WebSocket으로 읽음 이벤트 전송 (상대방에게 "내가 읽었어!" 알림)
    if (stompClientRef.current && isConnected) {
      const targetUserId = chat.userId;  // 상대방 ID
      
      stompClientRef.current.publish({
        destination: '/pub/chat/private',
        body: JSON.stringify({
          type: 'read',           // 📌 읽음 이벤트 타입
          roomId: targetUserId,   // 상대방에게 전송
          sender: myUserId,       // 내가 읽었다!
          content: ''             // 읽음 이벤트는 내용 없음
        })
      });
      
      console.log(`👀 읽음 이벤트 전송: ${myUserId} → ${targetUserId}`);
    }
    
    // 📝 내 UI 업데이트 (unread 카운트 0으로)
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
  }, [chatRooms, pendingChats, isConnected, myUserId]);

  /**
   * 👁️ 채팅방 나가기 (현재 보는 채팅방 초기화)
   */
  const handleLeaveChatRoom = useCallback(() => {
    console.log(`👁️ 채팅방 나감: ${currentViewingUserIdRef.current} → null`);
    currentViewingUserIdRef.current = null;
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
   * 📤 메시지 보내기 (WebSocket + UI 업데이트)
   * @returns {Object|null} 활성화된 채팅방 객체 (대기→활성화 시) 또는 null
   */
  const handleSendMessage = useCallback((chatId, messageText) => {
    const chat = [...pendingChats, ...chatRooms].find((c) => String(c.id) === String(chatId));

    if (!chat) {
      console.error('❌ 채팅방을 찾을 수 없습니다:', chatId);
      return null;
    }

    // 🔌 WebSocket으로 메시지 전송
    if (stompClientRef.current && isConnected) {
      const targetUserId = chat.userId;  // 상대방 ID
      
      stompClientRef.current.publish({
        destination: '/pub/chat/private',
        body: JSON.stringify({
          type: 'message',       // 📌 메시지 타입
          roomId: targetUserId,  // 받는 사람 ID (상대방이 구독하는 채널)
          sender: myUserId,      // 보내는 사람 ID (나)
          content: messageText
        })
      });
      
      console.log(`📤 메시지 전송: ${myUserId} → ${targetUserId}: ${messageText}`);
    } else {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다. 로컬에서만 메시지가 추가됩니다.');
    }

    // 📝 UI 업데이트 (내가 보낸 메시지 표시)
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

    if (chat?.isPending) {
      // 대기 중인 채팅 → 활성화
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
      // 기존 채팅방에 메시지 추가
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
  }, [chatRooms, pendingChats, isConnected, myUserId]);

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
    
    // 🔌 WebSocket 상태
    isConnected,
    myUserId,
    
    // 함수
    handleMarkAsRead,
    handleLeaveChatRoom,
    handleAddUser,
    handleSendMessage,
    openSearchModal,
    closeSearchModal,
    
    // 🔌 WebSocket 함수
    connectWebSocket,
    disconnectWebSocket,
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

