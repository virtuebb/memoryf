/**
 * 피드 댓글 기능 API
 */
import { baseApi, toApiResponse } from '../../../../shared/api';

/**
 * 댓글 생성 (POST /feeds/:id/comments)
 */
export const createComment = async (feedNo, content, writer) => {
  const response = await baseApi.post(`/feeds/${feedNo}/comments`, {
    content,
    writer,
  });
	return toApiResponse(response.data);
};

/**
 * 댓글 삭제 (DELETE /feeds/:feedNo/comments/:commentNo)
 */
export const deleteComment = async (feedNo, commentNo) => {
  const response = await baseApi.delete(`/feeds/${feedNo}/comments/${commentNo}`);
  return toApiResponse(response.data);
};

/**
 * 댓글 좋아요 토글 (POST /feeds/:feedNo/comments/:commentNo/likes)
 */
export const toggleCommentLike = async (feedNo, commentNo, memberNo) => {
  const response = await baseApi.post(`/feeds/${feedNo}/comments/${commentNo}/likes`, {
    memberNo,
  });
	return toApiResponse(response.data);
};
