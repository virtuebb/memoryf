/**
 * 신고 API
 * - 피드 신고, 댓글 신고 기능
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 피드 신고
 * @param {number} feedNo - 피드 번호
 * @param {number} memberNo - 신고자 회원번호
 * @param {string} reportReason - 신고 사유
 */
export const reportFeed = async (feedNo, memberNo, reportReason) => {
  const response = await baseApi.post('/reports/feeds', {
    feedNo,
    memberNo,
    reportReason,
  });
  return getApiResponseData(response.data, response.data);
};

/**
 * 댓글 신고
 * @param {number} commentNo - 댓글 번호
 * @param {number} memberNo - 신고자 회원번호
 * @param {string} reportReason - 신고 사유
 */
export const reportComment = async (commentNo, memberNo, reportReason) => {
  const response = await baseApi.post('/reports/comments', {
    commentNo,
    memberNo,
    reportReason,
  });
  return getApiResponseData(response.data, response.data);
};

/**
 * 피드 신고 목록 조회 (관리자용)
 */
export const getFeedReportList = async () => {
  const response = await baseApi.get('/reports/feeds');
  const data = getApiResponseData(response.data, []);
  return Array.isArray(data) ? data : [];
};

/**
 * 댓글 신고 목록 조회 (관리자용)
 */
export const getCommentReportList = async () => {
  const response = await baseApi.get('/reports/comments');
  const data = getApiResponseData(response.data, []);
  return Array.isArray(data) ? data : [];
};

/**
 * 피드 신고 처리 (관리자용)
 * @param {number} reportId - 신고 ID
 * @param {string} action - 처리 액션 ('APPROVE' | 'REJECT')
 */
export const processFeedReport = async (reportId, action) => {
  const response = await baseApi.put(`/reports/feeds/${reportId}/process`, { action });
  return getApiResponseData(response.data, response.data);
};

/**
 * 댓글 신고 처리 (관리자용)
 * @param {number} reportId - 신고 ID
 * @param {string} action - 처리 액션 ('APPROVE' | 'REJECT')
 */
export const processCommentReport = async (reportId, action) => {
  const response = await baseApi.put(`/reports/comments/${reportId}/process`, { action });
  return getApiResponseData(response.data, response.data);
};

/**
 * 신고 통계 조회 (관리자용)
 */
export const getReportStats = async () => {
  const response = await baseApi.get('/reports/stats');
  return getApiResponseData(response.data, {});
};

export default {
  reportFeed,
  reportComment,
  getFeedReportList,
  getCommentReportList,
  processFeedReport,
  processCommentReport,
  getReportStats,
};

