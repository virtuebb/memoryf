/**
 * 피드 좋아요 기능 API
 */
import { baseApi } from '../../../../shared/api';

/**
 * 피드 좋아요 (POST /feeds/:id/likes)
 * @param {number} feedNo
 * @param {number} memberNo
 */
export const likeFeed = async (feedNo, memberNo) => {
  const response = await baseApi.post(`/feeds/${feedNo}/likes`, { memberNo });
  return response.data;
};
