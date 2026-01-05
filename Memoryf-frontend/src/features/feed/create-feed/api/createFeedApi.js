/**
 * 피드 생성 기능 API
 */
import { baseApi, API_BASE_URL } from '../../../../shared/api';

/**
 * 피드 생성 (POST /feeds)
 * @param {FormData} formData - 피드 데이터 (multipart/form-data)
 */
export const createFeed = async (formData) => {
  try {
    const response = await baseApi.post('/feeds', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error('네트워크 오류: 백엔드 서버가 실행 중인지 확인하세요.');
      console.error('요청 URL:', `${API_BASE_URL}/feeds`);
    } else if (error.response) {
      console.error('서버 응답 오류:', error.response.status, error.response.data);
    } else {
      console.error('피드 생성 실패:', error.message);
    }
    throw error;
  }
};
