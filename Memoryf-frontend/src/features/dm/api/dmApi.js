/**
 * 💬 DM (Direct Message) API
 * 
 * 채팅 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';
import { getUserIdFromToken } from '../../../shared/lib';

/**
 * 채팅방 목록 조회
 * @returns {Promise} { chatRooms: [], pendingChats: [] }
 */
const selectDmRoomList = async () => {
  const userId = getUserIdFromToken();
  const response = await baseApi.get(`/messages/rooms/${userId}`);
	return response.data;
};

/**
 * 방 생성
 */
export const createDmRoom = async (targetUserId) => {
  console.log("보내는 targetUserId:", targetUserId);
  console.log("타입:", typeof targetUserId);
  
  const userId = getUserIdFromToken();
  console.log("보내는 유저 : " + userId);

  const requestData = { targetUserId, userId };
  console.log("보내는 data:", JSON.stringify(requestData));

  const response = await baseApi.post('/messages/insertRoom', requestData);
	return response.data;
};

/**
 * 채팅방의 메시지 목록 조회
 */
const selectDmMessages = async (roomNo) => {
  const userId = getUserIdFromToken();
  const response = await baseApi.post(`/messages/${roomNo}/select`, {
    roomNo: Number(roomNo),
    senderId: userId
  });
	return response.data;
};

/**
 * 채팅 메시지 저장
 */
const insertDmMessage = async (roomNo, senderId, content) => {
  const response = await baseApi.post(`/messages/${roomNo}/insert`, {
    roomNo: Number(roomNo),
    senderId,
    content
  });
	return response.data;
};

/**
 * 읽음 처리 - 마지막으로 읽은 시간 저장
 */
const markMessageAsRead = async (roomNo, senderId) => {
  const response = await baseApi.post(`/messages/${roomNo}/markAsRead`, {
    roomNo: Number(roomNo),
    senderId
  });
	return response.data;
};

/**
 * 미읽은 메시지 개수 조회
 */
const getUnreadCount = async (roomNo, senderId) => {
  const response = await baseApi.get(`/messages/${roomNo}/unreadCount/${senderId}`);
	return response.data;
};

/**
 * 메시지 삭제
 */
const deleteMessage = async (messageId) => {
  try {
    const response = await baseApi.post(`/messages/delete/${messageId}`, { messageId });
		return response.data;
  } catch {
    console.log("메세지 삭제 실패");
  }
};

/**
 * 채팅방 삭제
 */
const deleteDmRoom = async (roomNo) => {
  try {
    const response = await baseApi.post(`/messages/deleteDmRoom/${roomNo}`, { roomNo });
		return response.data;
  } catch {
    console.log("채팅방 삭제 실패");
  }
};

export { selectDmRoomList, insertDmMessage, selectDmMessages, markMessageAsRead, getUnreadCount, deleteMessage, deleteDmRoom };