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
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getUserIdFromToken, getAccessToken } from '../../../utils/jwt.js';
import { selectDmRoomList,  createDmRoom, selectDmMessages, insertDmMessage, markMessageAsRead, deleteDmRoom } from '../api/dmApi.js';
import { searchMembers } from '../../search/api/searchApi.js';

// 🌐 WebSocket 서버 URL (동적 설정)
// - localhost 접속 시: http://localhost:8006/memoryf/ws
// - 네트워크 IP 접속 시: http://192.168.x.x:8006/memoryf/ws
const getWsUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:8006/memoryf/ws`;
};
const WS_URL = import.meta.env.VITE_WS_URL || getWsUrl();

/**
 * 🔐 JWT 토큰에서 사용자 ID 가져오기
 * 
 * JWT 토큰의 payload에서 사용자 ID(sub 또는 memberId)를 추출합니다.
 * 토큰이 없거나 유효하지 않으면 'guest'를 반환합니다.
 */
const getCurrentUserId = () => {
  // 1. JWT 토큰에서 사용자 ID 추출
  const userId = getUserIdFromToken();
  
  if (userId) {
    console.log('🔐 JWT 토큰에서 사용자 ID 추출:', userId);
    return userId;
  }
  
  // 2. 토큰이 없으면 guest
  console.warn('⚠️ JWT 토큰이 없거나 유효하지 않습니다. guest로 접속합니다.');
  return 'guest';
};

// Context 생성
const DmContext = createContext(null);

/**
 * DM Provider - 앱 전체에서 채팅 상태 공유 + WebSocket 관리
 */
export function DmProvider({ children }) {
  // 💬 채팅방 목록 (실제 대화가 있는 방)
  const [chatRooms, setChatRooms] = useState([]);
  
  // 🔍 사용자 검색 모달 열기/닫기
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 🔌 WebSocket 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);

  // 👤 현재 사용자 ID (URL 파라미터 또는 localStorage에서 가져옴)
  const [myUserId] = useState(() => getCurrentUserId());
  
  // 👁️ 현재 보고 있는 채팅방의 상대방 ID (읽음 처리용)
  const currentViewingUserIdRef = useRef(null);
  
  // 📌 최신 state를 언제든지 접근할 수 있도록 ref 유지
  const chatRoomsRef = useRef(chatRooms);
  
  // ref 업데이트 (state 변경될 때마다)
  useEffect(() => {
    chatRoomsRef.current = chatRooms;
  }, [chatRooms]);

  // 📋 모든 채팅방
  const allChats = chatRooms;

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

    // 🔐 토큰 없으면 연결하지 않음
    const token = getAccessToken();
    if (!token || myUserId === 'guest') {
      console.warn('⚠️ 로그인 후 WebSocket 연결이 가능합니다.');
      return;
    }

    console.log(`📡 WebSocket 연결 시도: ${WS_URL} (사용자: ${myUserId})`);

    try {
      const stompClient = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        
        // 🔐 STOMP 연결 시 JWT 토큰과 로그인 식별 헤더를 포함
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          'user-id': myUserId,  // 기존 헤더
          login: myUserId,       // StompHandler에서 읽는 native header
        },
        
        debug: (str) => {
          // 디버그 로그 (필요시 활성화)
          // console.log('STOMP:', str);
        },
        reconnectDelay: 5000,
        // 5초마다 재연결 시도
        
        onConnect: () => {
          console.log(`✅ [${myUserId}] WebSocket 연결 성공 (JWT 인증)`);
          setIsConnected(true);
          stompClientRef.current = stompClient;

          // 내게 오는 메시지 구독
          stompClient.subscribe(`/sub/private/${myUserId}`, (msg) => {
            const data = JSON.parse(msg.body);
            console.log('📩 /sub 메시지 수신:', data);
            // 받은 메시지를 해당 채팅방에 추가
            handleReceiveMessage(data);
          });
          // Spring의 user destination으로 발송된 메시지도 받기 위해 별도 구독
          stompClient.subscribe('/user/queue/private', (msg) => {
            const data = JSON.parse(msg.body);
            console.log('📩 /user/queue 메시지 수신:', data);
            handleReceiveMessage(data);
          });
        },
        
        onStompError: (frame) => {
          console.error('❌ STOMP 에러:', frame.headers['message']);
          // 인증 실패 시 처리
          if (frame.headers['message']?.includes('Unauthorized')) {
            console.error('❌ JWT 토큰 인증 실패. 다시 로그인해주세요.');
          }
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
   * - type: 'delete' → 메시지 삭제 이벤트
   */
  const handleReceiveMessage = useCallback(async (data) => {
    // data = { type, roomId, sender, content, roomNo, recipientId, messageId }
    const { type, sender, content, roomNo, recipientId, messageId } = data;
    
    console.log('📩 handleReceiveMessage 진입:', {
      type, sender, roomNo, contentLen: content?.length || 0, messageId
    });
    
    // 🗑️ 메시지 삭제 이벤트 처리
    if (type === 'delete') {
      console.log(`🗑️ 메시지 삭제 이벤트 수신: roomNo=${roomNo}, messageId=${messageId}`);
      
      setChatRooms((prevRooms) => {
        return prevRooms.map(room => {
          if (String(room.id) === String(roomNo)) {
            return {
              ...room,
              messages: room.messages.filter(msg => String(msg.id) !== String(messageId))
            };
          }
          return room;
        });
      });
      return;  // 삭제 이벤트는 여기서 끝!
    }
    
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

    // 🛑 내가 보낸 메시지는 무시 (handleSendMessage에서 이미 처리함)
    // 이를 통해 불필요한 중복 처리 및 loadData() 호출로 인한 목록 깜빡임/사라짐 방지
    if (String(sender) === String(myUserId)) {
      return;
    }
    
    // 👁️ 현재 이 사람과의 채팅방을 보고 있으면 즉시 읽음 이벤트 전송!
    // viewing 비교: 기존에는 sender(상대ID)로 했지만, room 기반으로 보고 있음을 지원
    const isCurrentlyViewing = currentViewingUserIdRef.current === sender || currentViewingUserIdRef.current === recipientId;
    
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

    const roomIndex = chatRoomsRef.current.findIndex(room => 
        (roomNo != null && String(room.id) === String(roomNo)) || room.userId === sender
      );
    
    if (roomIndex !== -1) {
      // 기존 채팅방에 메시지 추가
      setChatRooms((prevRooms) => {
        const index = prevRooms.findIndex(room => (roomNo != null && String(room.id) === String(roomNo)) || room.userId === sender);
        if (index === -1) return prevRooms;

        const roomToUpdate = prevRooms[index];
        const otherRooms = prevRooms.filter((_, i) => i !== index);

        const updatedRoom = {
          ...roomToUpdate,
          messages: [...roomToUpdate.messages, newMessage],
          lastMessage: content,
          time: newMessage.time,
          unread: isCurrentlyViewing ? 0 : (roomToUpdate.unread || 0) + 1,
        };

        // 최신 메시지를 받은 채팅방을 목록의 맨 위로 올림
        return [updatedRoom, ...otherRooms];
      });
    } else {
      // 새로운 채팅방 생성 (처음 메시지 받는 경우)
      // 채팅방 목록을 다시 로드하여 새 채팅방을 포함시킵니다.
      console.log('🔄 새로운 채팅방에 대한 메시지 수신. 채팅방 목록을 새로고침합니다.');
      loadData();
    }
  }, [myUserId]);

  const loadData = useCallback(async () => {
    try {
      console.log('📡 채팅방 목록 로드 중... (사용자: ' + myUserId + ')');
      const response = await selectDmRoomList();
      
      console.log('📥 selectDmRoomList 응답:', {
        타입: typeof response,
        배열인가: Array.isArray(response),
        keys: typeof response === 'object' ? Object.keys(response) : 'N/A',
        길이: Array.isArray(response) ? response.length : (response?.chatRooms?.length || response?.data?.length || 0),
        응답본체_첫번째: Array.isArray(response) ? response[0] : (response?.chatRooms?.[0] || response?.data?.[0] || '없음')
      });
      
      // 응답이 배열이면 chatRooms으로, 객체면 해당 필드 사용
      let roomList = [];
      if (Array.isArray(response)) {
        roomList = response;
        console.log('✅ 배열 형식 응답 (길이: ' + roomList.length + ')');
      } else if (response && typeof response === 'object') {
        if (response.chatRooms && Array.isArray(response.chatRooms)) {
          roomList = response.chatRooms;
          console.log('✅ 객체형식.chatRooms 사용 (길이: ' + roomList.length + ')');
        } else if (response.data && Array.isArray(response.data)) {
          roomList = response.data;
          console.log('✅ 객체형식.data 사용 (길이: ' + roomList.length + ')');
        } else {
          console.warn('⚠️ 응답 구조 불명확:', Object.keys(response));
          roomList = [];
        }
      } else {
        console.warn('⚠️ 예상치 못한 응답 형식:', response);
        roomList = [];
      }
      
      // 모든 방에서 isPending을 false로 강제 설정
      const mapped = roomList.map((room, idx) => {
        console.log(`🔍 방${idx} 원본 데이터:`, {
          roomNo: room.roomNo,
          lastMessage: room.lastMessage,
          lastSendDate: room.lastSendDate,
          unreadCount: room.unreadCount,
          targetUserId: room.targetUserId,
          roomName: room.roomName
        });

        const time = room.lastSendDate
            ? (() => {
                try {
                  // ⚠️ 문제: new Date('2025-12-23')는 UTC 자정(00:00)으로 파싱됨
                  // 해결책: 한국 시간으로 파싱하기
                  let dateStr = room.lastSendDate;
                  
                  // 만약 'YYYY-MM-DD HH24:MI:SS' 형식이면 그대로 파싱
                  // 만약 'YYYY-MM-DD' 형식이면 'YYYY-MM-DD 00:00:00'로 취급
                  if (!dateStr.includes(':')) {
                    dateStr = dateStr + ' 00:00:00';
                  }
                  
                  // 한국 시간대로 파싱 (UTC 시간이 아님)
                  const [datePart, timePart] = dateStr.split(' ');
                  const [year, month, day] = datePart.split('-');
                  const [hours = 0, minutes = 0, seconds = 0] = (timePart || '00:00:00').split(':');
                  
                  const date = new Date(year, parseInt(month) - 1, day, hours, minutes, seconds);
                  const timeStr = date.toLocaleTimeString('ko-KR', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  });
                  console.log(`  ⏰ lastSendDate: ${room.lastSendDate} → ${timeStr}`);
                  return timeStr;
                } catch (e) {
                  console.warn(`  ⚠️ 시간 파싱 실패: ${room.lastSendDate}`, e);
                  return String(room.lastSendDate || '');
                }
              })()
            : room.time || '대기';

          // 백엔드에서 상대방 식별자가 여러 필드명으로 올 수 있으므로 안전하게 추출
          const opponentId = room.targetUserId || room.target_user_id || room.targetUser || room.roomName || room.room_name || room.roomNm || room.room_nm || room.room; 

          const finalChat = {
            id: room.roomNo,
            userId: opponentId || String(room.roomNo),
            userName: room.targetUserName || opponentId || room.roomName || String(room.roomNo),
            lastMessage: room.lastMessage || '대화 없음',
            time,
            unread: room.unreadCount || 0,
            avatar: room.avatar || '👤',
            messages: room.messages || [],
            isPending: false,  // ⚠️ 모든 방을 isPending false로 강제
          };

          console.log(`  ✅ 매핑됨:`, {
            id: finalChat.id,
            userId: finalChat.userId,
            lastMessage: finalChat.lastMessage,
            unread: finalChat.unread,
            time: finalChat.time
          });

          return finalChat;
        });

        console.log('✅ 채팅방 매핑 완료 (총 ' + mapped.length + '개):', 
          mapped.map(m => ({ id: m.id, userId: m.userId, unread: m.unread, lastMessage: m.lastMessage }))
        );
        setChatRooms(mapped);
    } catch (error) {
      console.error('❌ 채팅방 로드 실패:', error.message);
      console.error('❌ 상세 에러:', error);
      // 에러 시 더미 데이터 유지
    }
  }, [myUserId]);

  // 🚀 컴포넌트 마운트 시에만 1회 실행 (무한 루프 방지)
  useEffect(() => {
    loadData();         // 📡 백엔드에서 채팅방 목록 조회
    connectWebSocket(); // 🔌 WebSocket 연결
    
    // 언마운트 시 연결 해제
    return () => {
      disconnectWebSocket();
    };
  }, []);  // ✅ 의존성 배열 비워서 마운트 시에만 실행



  /**
   * 👀 채팅방 읽음 처리 + WebSocket으로 상대방에게 알림
   */
  const handleMarkAsRead = useCallback((chatId) => {
    console.log(`🔍 handleMarkAsRead 호출: chatId=${chatId}`);
    console.log(`🔍 현재 chatRooms:`, chatRoomsRef.current.map(c => ({ id: c.id, userId: c.userId })));
    
    // STEP 0: 찾기 (ref를 써서 최신값 가져오기)
    const numericChatId = Number(chatId);
    const chat = chatRoomsRef.current.find((c) => {
      const cId = Number(c.id);
      return cId === numericChatId;
    });
    
    console.log(`🔍 찾은 채팅방:`, chat ? { id: chat.id, userId: chat.userId, unread: chat.unread } : 'NOT FOUND');
    if (!chat) {
      console.error(`❌ 채팅방을 찾지 못함: ${chatId} (type: ${typeof chatId})`);
      console.error(`❌ 저장된 chatRooms:`, chatRoomsRef.current);
      return;
    }
    
    // 👁️ 현재 보고 있는 채팅방의 상대방 ID 저장 (새 메시지 즉시 읽음 처리용)
    currentViewingUserIdRef.current = chat.userId;
    console.log(`✅ 현재 보는 채팅방: ${chat.userId}`);
    
    // STEP 1: 📝 UI 먼저 업데이트 (unread 카운트 0으로) - 즉시 반영
    setChatRooms((prevRooms) => {
      const updated = prevRooms.map((room) => {
        const rid = Number(room.id);
        const cid = Number(chatId);
        return rid === cid
          ? { ...room, unread: 0 }
          : room;
      });
      console.log(`✅ UI 업데이트: ${chatId} 배지 제거됨`);
      return updated;
    });
    
    // STEP 2: 💾 REST API로 DB에 읽음 기록 저장 (기다리지 않음)
    if (chat.id) {
      markMessageAsRead(chat.id, myUserId)
        .then(response => {
          console.log(`✅ 읽음 처리 DB 저장 성공:`, response);
        })
        .catch(error => {
          console.error('❌ DB 저장 실패:', error);
        });
    }
    
    // STEP 3: 🔌 WebSocket으로 읽음 이벤트 전송 (상대방에게 "내가 읽었어!" 알림)
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

      console.log(`✅ 읽음 이벤트 WebSocket 전송: ${myUserId} → ${targetUserId}`);
    }
  }, [stompClientRef, isConnected, myUserId]);
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
  const handleAddUser = useCallback(async (user) => {

    // 선택한 유저 정보 출력
    console.log('🆕 새 채팅 시작:', user);

    // 서버에 새 채팅방 생성 요청
    try {
      const targetUserId = user.userId;
      const created = await createDmRoom(targetUserId);

      console.log('🔍 백엔드 createDmRoom 응답:', {
        전체: created,
        roomNo: created?.roomNo,
        roomName: created?.roomName,
        targetUserId: created?.targetUserId,
        messages: created?.messages?.length || 0
      });

      // 우선 서버에서 반환한 roomNo를 사용
      let roomNo = created?.roomNo || created?.roomNoString || null;

      // 만약 서버가 roomNo를 반환하지 않으면, 채팅방 목록을 재조회하여 해당 상대방의 방을 찾아 roomNo를 확보
      if (!roomNo) {
        try {
          const listResp = await selectDmRoomList();
          const list = Array.isArray(listResp) ? listResp : (listResp?.chatRooms || []);
          const found = list.find(r => (
            String(r.roomName) === String(targetUserId) ||
            String(r.targetUserId) === String(targetUserId) ||
            String(r.target_user_id) === String(targetUserId)
          ));
          if (found) roomNo = found.roomNo || found.ROOM_NO || found.room_no;
        } catch (e) {
          console.warn('방 생성 후 목록 재조회 실패:', e);
        }
      }

      if (!roomNo) {
        // roomNo를 확보하지 못하면 에러를 던집니다. 호출자에서 처리하게 합니다.
        throw new Error('생성된 채팅방의 roomNo를 확인할 수 없습니다.');
      }

      const newChat = {
        id: roomNo,
        userId: user.userId,
        userName: user.userName,
        lastMessage: created.lastMessage || '대화 없음',
        time: created.lastSendDate || '방금',
        unread: created.unreadCount || 0,
        avatar: user.profileImg || created.avatar,
        messages: created.messages || [],
        isPending: false,
      };

      console.log('✅ newChat 객체 생성됨:', {
        id: newChat.id,
        userId: newChat.userId,
        userName: newChat.userName,
        isPending: newChat.isPending
      });
      
      setChatRooms((prev) => {
        const updated = [newChat, ...prev];
        console.log('✅ setChatRooms 호출 - 새 방 추가 (총 개수: ' + updated.length + ')');
        return updated;
      });
      return newChat;
    } catch (error) {
      console.error('❌ 서버에 방 생성 실패:', error);
      // 임시 로컬 채팅 생성 로직을 제거했습니다. 호출자에게 에러를 던져 처리하도록 함.
      throw error;
    }
  }, []);

  /**
   * 📤 메시지 보내기 (WebSocket + UI 업데이트)
   * @returns {Object|null} 활성화된 채팅방 객체 (대기→활성화 시) 또는 null
   */
  const handleSendMessage = useCallback((chatId, messageText) => {
    const chat = chatRoomsRef.current.find((c) => String(c.id) === String(chatId));

    if (!chat) {
      console.error('❌ 채팅방을 찾을 수 없습니다:', chatId);
      return null;
    }

    // 🔌 WebSocket으로 메시지 전송
    if (stompClientRef.current && isConnected) {
      const targetUserId = chat.userId;  // 상대방 ID
      const roomNo = chat.id; // numeric roomNo

      // 발행 메시지에 숫자 roomNo와 recipientId(상대 사용자 ID)를 포함
      stompClientRef.current.publish({
        destination: '/pub/chat/private',
        body: JSON.stringify({
          type: 'message',       // 📌 메시지 타입
          roomNo: roomNo,        // DB의 숫자 채팅방 ID
          roomId: targetUserId,  // 레거시 필드(받는 사람 ID)
          recipientId: targetUserId,
          sender: myUserId,      // 보내는 사람 ID (나)
          content: messageText
        })
      });

      console.log(`📤 메시지 전송: ${myUserId} → ${targetUserId} (roomNo:${roomNo}): ${messageText}`);
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
      // pending 로직 제거 - 새로운 방은 모두 서버에서 생성되어 chatRooms에 추가됨
      console.error('❌ Pending chat 발견 - 이 로직은 제거되었습니다');
      return null;
    } else {
      // 기존 채팅방에 메시지 추가
      setChatRooms((prevRooms) => {
        const index = prevRooms.findIndex(room => String(room.id) === String(chatId));
        if (index === -1) return prevRooms;

        const roomToUpdate = prevRooms[index];
        const otherRooms = prevRooms.filter((_, i) => i !== index);

        const updatedRoom = {
          ...roomToUpdate,
          messages: [...roomToUpdate.messages, newMessage],
          lastMessage: messageText,
          time: newMessage.time,
        };

        return [updatedRoom, ...otherRooms];
      });
      
      // 메시지 저장은 서버가 WebSocket 수신 시 처리합니다.

      return null;
    }
  }, [isConnected, myUserId]);

  /**
   * 특정 채팅방의 메시지 목록을 서버에서 불러와 해당 방에 세팅합니다.
   */
  const fetchMessages = useCallback(async (roomId) => {
    try {
      const msgs = await selectDmMessages(roomId);
      if (!Array.isArray(msgs)) return msgs;

      const mapped = msgs.map((m) => {
        // 🛠️ 수정: sendDate 등 시간 정보가 포함된 필드를 우선적으로 찾음
        const rawTime = m.sendDate || m.SEND_DATE || m.createDate || m.CREATE_DATE || m.create_date || m.createAt || '';
        let timeStr = '';
        try {
          if (!rawTime) {
            timeStr = '';
          } else {
            const str = String(rawTime);
            let dateObj = null;
            
            // 1. 타임스탬프 (숫자이거나 숫자만 있는 문자열)
            if (!isNaN(Number(str)) && !str.includes('-') && !str.includes(':')) {
              dateObj = new Date(Number(str));
            }
            // 2. ISO 포맷 (T 포함)
            else if (str.includes('T')) {
              dateObj = new Date(str);
            }
            // 3. 날짜와 시간이 공백으로 구분된 경우 ('YYYY-MM-DD HH:mm:ss')
            else if (str.includes(' ')) {
              let [d, t] = str.split(' ');
              const [yyyy, mm, dd] = d.split('-').map(Number);
              const [hh, min, ss] = t.split(':').map(Number);
              dateObj = new Date(yyyy, mm - 1, dd, hh || 0, min || 0, ss || 0);
            }
            // 4. 그 외 (날짜만 있는 경우 등) - 억지로 00:00:00을 붙이지 않음
            else {
               dateObj = new Date(str);
            }

            // 🛠️ 9시간 더하기 (UTC -> KST 보정)
            if (dateObj && !isNaN(dateObj.getTime())) {
              timeStr = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
          }
        } catch (e) {
          timeStr = String(rawTime || '');
        }

        const sender = m.senderId || m.senderNo || m.SENDER_NO || m.sender || m.SENDER_ID || m.senderIdString;

        return {
          id: m.messageNo || m.MESSAGE_NO || m.id || Date.now(),
          text: m.content || m.CONTENT || m.text || '',
          time: timeStr,
          isMine: String(sender) === String(myUserId),
          // 🛠️ 수정: 무조건 false가 아니라, DB의 읽음 상태(readCheck가 0이면 읽음)를 반영
          isRead: (m.readCheck === 0 || m.readCount === 0 || m.isRead === true),
        };
      });

      setChatRooms((prev) => prev.map(room => String(room.id) === String(roomId) ? { ...room, messages: mapped } : room));
      // pendingChats 제거됨

      return mapped;
    } catch (err) {
      console.error('메시지 로드 실패:', err);
      throw err;
    }
  }, [myUserId]);

  /**
   * 🔍 검색 모달 열기/닫기
   */
  const openSearchModal = useCallback(() => setIsSearchModalOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchModalOpen(false), []);

  /**
  * �️ 채팅방 삭제
  */
  const handleDeleteChat = useCallback(async (chatId) => {
    try {
      await deleteDmRoom(chatId);
      // 삭제 성공 시 채팅 목록에서 제거
      setChatRooms((prevRooms) => prevRooms.filter(room => String(room.id) !== String(chatId)));
      console.log('채팅방 삭제 성공:', chatId);
    } catch (error) {
      console.error('채팅방 삭제 실패:', error);
      throw error;
    }
  }, []);

  // Context value
  const value = {
    // 상태
    chatRooms,
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
    handleDeleteChat,
    fetchMessages,
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
