/**
 * 피드 삭제 기능 API
 */
import { baseApi } from '../../../../shared/api';

/**
 * 피드 삭제 (DELETE /feeds/:id)
 */
export const deleteFeed = async (feedNo) => {
  const response = await baseApi.delete(`/feeds/${feedNo}`);
  return response.data;
};
