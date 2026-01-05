/**
 * adminApi.js - 관리자 API 통신 모듈
 * 
 * 관리자 페이지에서 사용하는 모든 API 호출을 담당하는 모듈이에요!
 * 
 * 사용 방법:
 * 1. shared/api의 baseApi 사용 (인증 토큰 자동 포함)
 * 2. 각 기능별 API 함수 정의
 * 3. React Query와 함께 사용
 */

import { baseApi } from '../../../shared/api';

/**
 * 회원 관리 API
 */
export const userApi = {
  // 회원 목록 조회
  // GET /admin/users?page=1&size=10
  getUsers: async (page = 1, size = 10) => {
    const response = await baseApi.get('/admin/users', { params: { page, size } });
    return response.data;
  },

  // 회원 상세 조회
  // GET /admin/users/:userId
  getUserDetail: async (userId) => {
    const response = await baseApi.get(`/admin/users/${userId}`);
    return response.data;
  },

  // 회원 탈퇴
  // DELETE /admin/users/:userId
  deleteUser: async (userId) => {
    const response = await baseApi.delete(`/admin/users/${userId}`);
    return response.data;
  }
};

/**
 * 신고 관리 API
 */
export const reportApi = {
  // 신고된 피드 목록 조회
  // GET /admin/reports/feeds?page=1&size=10
  getReportedFeeds: async (page = 1, size = 10) => {
    const response = await baseApi.get('/admin/reports/feeds', { params: { page, size } });
    return response.data;
  },

  // 신고된 댓글 목록 조회
  // GET /admin/reports/comments?page=1&size=10
  getReportedComments: async (page = 1, size = 10) => {
    const response = await baseApi.get('/admin/reports/comments', { params: { page, size } });
    return response.data;
  },

  // 신고된 회원 목록 조회
  // GET /admin/reports/users?page=1&size=10
  getReportedUsers: async (page = 1, size = 10) => {
    const response = await baseApi.get('/admin/reports/users', { params: { page, size } });
    return response.data;
  },

  // 신고된 피드 삭제
  // DELETE /admin/reports/feeds/:feedId
  deleteReportedFeed: async (feedId) => {
    const response = await baseApi.delete(`/admin/reports/feeds/${feedId}`);
    return response.data;
  },

  // 신고된 댓글 삭제
  // DELETE /admin/reports/comments/:commentId
  deleteReportedComment: async (commentId) => {
    const response = await baseApi.delete(`/admin/reports/comments/${commentId}`);
    return response.data;
  },

  // 회원 정지
  // POST /admin/reports/users/:userId/suspend
  suspendUser: async (userId, period) => {
    const response = await baseApi.post(`/admin/reports/users/${userId}/suspend`, { period });
    return response.data;
  },
};

/**
 * 결제 관리 API
 */
export const paymentApi = {
  // 결제 목록 조회
  // GET /admin/payments?page=1&size=10
  getPayments: async (page = 1, size = 10) => {
    const response = await baseApi.get('/admin/payments', { params: { page, size } });
    return response.data;
  },

  // 결제 상세 조회
  // GET /admin/payments/:paymentId
  getPaymentDetail: async (paymentId) => {
    const response = await baseApi.get(`/admin/payments/${paymentId}`);
    return response.data;
  }
};

/**
 * BGM 관리 API
 */
export const bgmApi = {
  // BGM 목록 조회
  // GET /admin/bgm?page=1&size=10
  getBgmList: async (page = 1, size = 10) => {
    const response = await baseApi.get('/admin/bgm', { params: { page, size } });
    return response.data;
  },

  // BGM 추가
  // POST /admin/bgm
  // body: FormData (title, price, audioFile)
  addBgm: async (formData) => {
    const response = await baseApi.post('/admin/bgm', formData);
    return response.data;
  },

  // BGM 수정
  // PUT /admin/bgm/:bgmId
  updateBgm: async (bgmId, data) => {
    const response = await baseApi.put(`/admin/bgm/${bgmId}`, data);
    return response.data;
  },

  // BGM 삭제
  // DELETE /admin/bgm/:bgmId
  deleteBgm: async (bgmId) => {
    const response = await baseApi.delete(`/admin/bgm/${bgmId}`);
    return response.data;
  }
};

/**
 * REST API 엔드포인트 예시
 * 
 * 회원 관리:
 * - GET    /api/admin/users              - 회원 목록 조회
 * - GET    /api/admin/users/:id          - 회원 상세 조회
 * - DELETE /api/admin/users/:id          - 회원 탈퇴
 * 
 * 신고 관리:
 * - GET    /api/admin/reports/feeds      - 신고된 피드 목록
 * - GET    /api/admin/reports/comments   - 신고된 댓글 목록
 * - GET    /api/admin/reports/users      - 신고된 회원 목록
 * - DELETE /api/admin/reports/feeds/:id  - 피드 삭제
 * - DELETE /api/admin/reports/comments/:id - 댓글 삭제
 * - POST   /api/admin/reports/users/:id/suspend - 회원 정지
 * 
 * 결제 관리:
 * - GET    /api/admin/payments           - 결제 목록 조회
 * - GET    /api/admin/payments/:id       - 결제 상세 조회
 * 
 * BGM 관리:
 * - GET    /api/admin/bgm                - BGM 목록 조회
 * - POST   /api/admin/bgm                - BGM 추가
 * - PUT    /api/admin/bgm/:id            - BGM 수정
 * - DELETE /api/admin/bgm/:id            - BGM 삭제
 */

