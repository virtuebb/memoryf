/**
 * 피드 좋아요 기능 API
 */
import { baseApi, toApiResponse, mergeApiResponseData } from '../../../../shared/api';

/**
 * 피드 좋아요 토글 (POST /feeds/:id/likes)
 * @param {number} feedNo
 * @param {number} memberNo
 */
export const likeFeed = async (feedNo, memberNo) => {
  const response = await baseApi.post(`/feeds/${feedNo}/likes`, { memberNo });
  const apiResponse = toApiResponse(response.data);
  // data 필드를 최상위 레벨로 병합 (result.isLiked, result.likeCount로 접근 가능)
  return mergeApiResponseData(apiResponse);
};
