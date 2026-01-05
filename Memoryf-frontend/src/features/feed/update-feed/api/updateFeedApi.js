/**
 * 피드 수정 기능 API
 */
import { baseApi } from '../../../../shared/api';

/**
 * 피드 수정 (PUT /feeds/:id)
 * @param {number} feedNo
 * @param {{content?: string, tag?: string, latitude?: string, longitude?: string}} payload
 */
export const updateFeed = async (feedNo, payload) => {
  const response = await baseApi.put(`/feeds/${feedNo}`, payload);
  return response.data;
};
