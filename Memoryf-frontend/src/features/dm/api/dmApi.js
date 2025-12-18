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

export default selectDmRoomList;