/**
 * 💬 DM (Direct Message) API
 * 
 * V3 스키마 기준 (MEMBER_NO 사용, 레거시 호환성 유지)
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';
import { getUserIdFromToken, getMemberNoFromToken } from '../../../shared/lib';

/**
 * 채팅방 목록 조회
 * V3: /messages/rooms/member/{memberNo}
 * 레거시: /messages/rooms/{userId}
 */
const selectDmRoomList = async () => {
  const memberNo = getMemberNoFromToken?.();
  const userId = getUserIdFromToken();
  
  try {
    // V3 API 시도
    if (memberNo) {
      const response = await baseApi.get(`/messages/rooms/member/${memberNo}`);
      return response.data;
    }
  } catch {
    // V3 실패 시 레거시로 폴백
  }
  
  // 레거시 API
  const response = await baseApi.get(`/messages/rooms/${userId}`);
  return response.data;
};

/**
 * 채팅방 생성 또는 기존 방 반환
 * V3: POST /messages/rooms { memberNo, targetMemberNo }
 * 레거시: POST /messages/insertRoom { userId, targetUserId }
 */
export const createDmRoom = async (targetUserId, targetMemberNo = null) => {
  const memberNo = getMemberNoFromToken?.();
  const userId = getUserIdFromToken();
  
  console.log("DM 방 생성 요청:", { userId, targetUserId, memberNo, targetMemberNo });
  
  try {
    // V3 API 시도 (memberNo 기반)
    if (memberNo && targetMemberNo) {
      const response = await baseApi.post('/messages/rooms', {
        memberNo,
        targetMemberNo
      });
      return response.data;
    }
  } catch {
    // V3 실패 시 레거시로 폴백
  }
  
  // 레거시 API (userId 기반)
  const response = await baseApi.post('/messages/insertRoom', {
    userId,
    targetUserId
  });
  return response.data;
};

/**
 * 메시지 목록 조회
 * V3: GET /messages/{roomNo}/messages/{senderNo}
 * 레거시: POST /messages/{roomNo}/select { roomNo, senderId }
 */
const selectDmMessages = async (roomNo) => {
  const memberNo = getMemberNoFromToken?.();
  const userId = getUserIdFromToken();
  
  try {
    // V3 API 시도
    if (memberNo) {
      const response = await baseApi.get(`/messages/${roomNo}/messages/${memberNo}`);
      return response.data;
    }
  } catch {
    // V3 실패 시 레거시로 폴백
  }
  
  // 레거시 API
  const response = await baseApi.post(`/messages/${roomNo}/select`, {
    roomNo: Number(roomNo),
    senderId: userId
  });
  return response.data;
};

/**
 * 메시지 저장
 * V3: POST /messages/{roomNo}/messages { senderNo, content, messageType }
 * 레거시: POST /messages/{roomNo}/insert { roomNo, senderId, content }
 */
const insertDmMessage = async (roomNo, senderId, content, messageType = 'TEXT') => {
  const memberNo = getMemberNoFromToken?.();
  
  try {
    // V3 API 시도
    if (memberNo) {
      const response = await baseApi.post(`/messages/${roomNo}/messages`, {
        senderNo: memberNo,
        content,
        messageType
      });
      return response.data;
    }
  } catch {
    // V3 실패 시 레거시로 폴백
  }
  
  // 레거시 API
  const response = await baseApi.post(`/messages/${roomNo}/insert`, {
    roomNo: Number(roomNo),
    senderId,
    content
  });
  return response.data;
};

/**
 * 읽음 처리
 * V3: PUT /messages/{roomNo}/read/{memberNo}
 * 레거시: POST /messages/{roomNo}/markAsRead { roomNo, senderId }
 */
const markMessageAsRead = async (roomNo, senderId) => {
  const memberNo = getMemberNoFromToken?.();
  
  try {
    // V3 API 시도
    if (memberNo) {
      const response = await baseApi.put(`/messages/${roomNo}/read/${memberNo}`);
      return response.data;
    }
  } catch {
    // V3 실패 시 레거시로 폴백
  }
  
  // 레거시 API
  const response = await baseApi.post(`/messages/${roomNo}/markAsRead`, {
    roomNo: Number(roomNo),
    senderId
  });
  return response.data;
};

/**
 * 미읽은 메시지 개수 조회
 * V3: GET /messages/{roomNo}/unread/{memberNo}
 * 레거시: GET /messages/{roomNo}/unreadCount/{readerId}
 */
const getUnreadCount = async (roomNo, senderId) => {
  const memberNo = getMemberNoFromToken?.();
  
  try {
    // V3 API 시도
    if (memberNo) {
      const response = await baseApi.get(`/messages/${roomNo}/unread/${memberNo}`);
      return response.data;
    }
  } catch {
    // V3 실패 시 레거시로 폴백
  }
  
  // 레거시 API
  const response = await baseApi.get(`/messages/${roomNo}/unreadCount/${senderId}`);
  return response.data;
};

/**
 * 메시지 삭제
 * V3: DELETE /messages/messages/{messageNo}
 * 레거시: POST /messages/delete/{messageId}
 */
const deleteMessage = async (messageId) => {
  try {
    // V3 API 시도
    try {
      const response = await baseApi.delete(`/messages/messages/${messageId}`);
      return response.data;
    } catch {
      // V3 실패 시 레거시로 폴백
    }
    
    // 레거시 API
    const response = await baseApi.post(`/messages/delete/${messageId}`, { messageId });
    return response.data;
  } catch {
    console.log("메시지 삭제 실패");
    return null;
  }
};

/**
 * 채팅방 나가기
 * V3: PUT /messages/rooms/{roomNo}/leave/{memberNo}
 */
const leaveRoom = async (roomNo) => {
  const memberNo = getMemberNoFromToken?.();
  
  if (memberNo) {
    const response = await baseApi.put(`/messages/rooms/${roomNo}/leave/${memberNo}`);
    return response.data;
  }
  
  throw new Error('회원 번호를 확인할 수 없습니다.');
};

/**
 * 채팅방 삭제
 * V3: DELETE /messages/rooms/{roomNo}
 * 레거시: POST /messages/deleteDmRoom/{roomNo}
 */
const deleteDmRoom = async (roomNo) => {
  try {
    // V3 API 시도
    try {
      const response = await baseApi.delete(`/messages/rooms/${roomNo}`);
      return response.data;
    } catch {
      // V3 실패 시 레거시로 폴백
    }
    
    // 레거시 API
    const response = await baseApi.post(`/messages/deleteDmRoom/${roomNo}`, { roomNo });
    return response.data;
  } catch {
    console.log("채팅방 삭제 실패");
    return null;
  }
};

export { 
  selectDmRoomList, 
  insertDmMessage, 
  selectDmMessages, 
  markMessageAsRead, 
  getUnreadCount, 
  deleteMessage, 
  deleteDmRoom,
  leaveRoom
};
