/**
 * 피드 북마크 기능 API
 */
import { baseApi } from '../../../../shared/api';

/**
 * 피드 북마크 토글 (POST /feeds/:id/bookmarks)
 * @param {number} feedNo
 * @param {number} memberNo
 */
export const toggleFeedBookmark = async (feedNo, memberNo) => {
  const response = await baseApi.post(`/feeds/${feedNo}/bookmarks`, { memberNo });
  return response.data;
};
