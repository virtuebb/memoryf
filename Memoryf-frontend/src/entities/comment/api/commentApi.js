/**
 * 댓글 조회 API (읽기 전용)
 * 
 * 댓글 조회 기능만 담당
 * 댓글 생성/수정/삭제는 features에서 담당
 */
import { baseApi, toApiResponse } from '../../../shared/api';

/**
 * 피드의 댓글 목록 조회
 * @param {number} feedNo - 피드 번호
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise} 페이징된 댓글 목록
 */
export const fetchComments = async (feedNo, page = 0, size = 20) => {
  const response = await baseApi.get(`/feeds/${feedNo}/comments`, { 
    params: { page, size } 
  });
  return response.data;
};

/**
 * 댓글 상세 조회
 * @param {number} commentNo - 댓글 번호
 * @returns {Promise} 댓글 정보
 */
export const fetchCommentDetail = async (commentNo) => {
  const response = await baseApi.get(`/comments/${commentNo}`);
  return response.data;
};

/**
 * 회원별 댓글 목록 조회
 * @param {number} memberNo - 회원 번호
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise} 페이징된 댓글 목록
 */
export const fetchUserComments = async (memberNo, page = 0, size = 20) => {
  const response = await baseApi.get(`/members/${memberNo}/comments`, { 
    params: { page, size } 
  });
  return response.data;
};

/**
 * 댓글 삭제 (DELETE /feeds/:feedNo/comments/:commentNo)
 *
 * settings 등 상위 조합 레이어에서 "댓글 삭제" 기능을 쓸 수 있도록 entity에서 노출합니다.
 */
export const deleteComment = async (feedNo, commentNo) => {
  const response = await baseApi.delete(`/feeds/${feedNo}/comments/${commentNo}`);
  return toApiResponse(response.data);
};

export default {
  fetchComments,
  fetchCommentDetail,
  fetchUserComments,
  deleteComment,
};
