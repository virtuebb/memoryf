import axios from 'axios';
import { getUserIdFromToken, getAccessToken } from '../../../utils/jwt.js';

// 백엔드 API 기본 URL (서버의 컨텍스트 경로를 포함)
// 백엔드의 application.properties에 server.servlet.context-path=/memoryf 로 설정되어 있으므로
// API 호출 시 컨텍스트 경로를 포함해야 합니다.
const API_BASE = 'http://localhost:8006/memoryf';

/**
 * 채팅방 목록 조회
 * @returns {Promise} { chatRooms: [], pendingChats: [] }
 */
const selectDmRoomList = async () => {
    try {
        const token = getAccessToken();
        const userId = getUserIdFromToken();
        const url = `${API_BASE}/messages/rooms/${userId}`;

        const response = await axios({
            url: url,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ 채팅방 목록 조회 성공:', response.data);
        return response.data;  // { chatRooms: [...], pendingChats: [...] }
    } catch (error) {
        console.error('❌ 채팅방 목록 조회 실패:', error);
        throw error;
    }
};

// 방 생성 
export const createDmRoom = async (targetUserId) => {
    console.log("보내는 targetUserId:", targetUserId);
    console.log("타입:", typeof targetUserId);
    
    const token = getAccessToken();
    const url = `${API_BASE}/messages/insertRoom`;
    const userId = getUserIdFromToken();

    console.log("보내는 유저 : " + userId);

    const requestData = { targetUserId: targetUserId, userId: userId };
    console.log("보내는 data:", JSON.stringify(requestData));

    const response = await axios({
        url,
        method: 'POST',
        data: requestData,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    console.log('응답:', response.data);

    // alert(response.data);

    return response.data;
};

/**
 * 채팅방의 메시지 목록 조회
 * GET /messages/rooms/{roomId}/messages
 */
const selectDmMessages = async (roomNo) => {
    try {
        const token = getAccessToken();
        const url = `${API_BASE}/messages/${roomNo}/select`;
        const userId = getUserIdFromToken();


        // 서버 컨트롤러는 request body에서 'roomId' 키를 기대합니다.
        const response = await axios({
            url,
            method: 'POST',
            data: { roomNo: Number(roomNo), senderId: userId },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ 메시지 목록 조회 성공:', response.data);
        return response.data; // 메시지 배열
    } catch (error) {
        console.error('❌ 메시지 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 채팅 메시지 저장
 * POST /messages/rooms/{roomId}/messages
 */
const insertDmMessage = async (roomNo, senderId, content) => {
    try {
        const token = getAccessToken();
        const url = `${API_BASE}/messages/${roomNo}/insert`;

        const response = await axios({
            url,
            method: 'POST',
            data: { roomNo: Number(roomNo), senderId: senderId, content },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ 메시지 저장 성공:', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ 메시지 저장 실패:', error);
        throw error;
    }
};

/**
 * 읽음 처리 - 마지막으로 읽은 시간 저장
 * POST /messages/{roomNo}/markAsRead
 */
const markMessageAsRead = async (roomNo, senderId) => {
    try {
        const token = getAccessToken();
        const url = `${API_BASE}/messages/${roomNo}/markAsRead`;

        const response = await axios({
            url,
            method: 'POST',
            data: { roomNo: Number(roomNo), senderId: senderId },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ 읽음 처리 성공:', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ 읽음 처리 실패:', error);
        throw error;
    }
};

/**
 * 미읽은 메시지 개수 조회
 * GET /messages/{roomNo}/unreadCount/{senderId}
 */
const getUnreadCount = async (roomNo, senderId) => {
    try {
        const token = getAccessToken();
        const url = `${API_BASE}/messages/${roomNo}/unreadCount/${senderId}`;

        const response = await axios({
            url,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ 미읽은 메시지 조회 성공:', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ 미읽은 메시지 조회 실패:', error);
        throw error;
    }
};

export { selectDmRoomList, insertDmMessage, selectDmMessages, markMessageAsRead, getUnreadCount };