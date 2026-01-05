import { baseApi } from '../../../shared/api';

/**
 * 멜론 차트 TOP 50 조회
 */
export const fetchMelonChart = async () => {
  try {
    const response = await baseApi.get('/bgm/melon/chart');
    return response.data;
  } catch (error) {
    console.error('멜론 차트 조회 실패:', error);
    throw error;
  }
};

/**
 * 멜론 차트 특정 순위 조회
 */
export const fetchMelonChartByRank = async (rank) => {
  try {
    const response = await baseApi.get(`/bgm/melon/chart/${rank}`);
    return response.data;
  } catch (error) {
    console.error('멜론 차트 조회 실패:', error);
    throw error;
  }
};
