/**
 * adminApi.js - 관리자 API 통신 모듈
 * 
 * 관리자 페이지에서 사용하는 모든 API 호출을 담당하는 모듈이에요!
 * 
 * 사용 방법:
 * 1. Axios 인스턴스 생성 (인증 토큰 포함)
 * 2. 각 기능별 API 함수 정의
 * 3. React Query와 함께 사용
 * 
 * TODO: 실제 백엔드 API 엔드포인트에 맞게 수정 필요
 */

// import axios from 'axios';

// Axios 인스턴스 생성 (인증 토큰 자동 포함)
// const adminApiClient = axios.create({
//   baseURL: '/api/admin',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 요청 인터셉터: 모든 요청에 인증 토큰 추가
// adminApiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 응답 인터셉터: 에러 처리
// adminApiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       // 인증 실패 시 로그인 페이지로 이동
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

/**
 * 회원 관리 API
 */
export const userApi = {
  // 회원 목록 조회
  // GET /api/admin/users?page=1&size=10
  getUsers: async (page = 1, size = 10) => {
    // return adminApiClient.get('/users', { params: { page, size } });
    // 더미 응답
    return {
      data: [],
      totalPages: 10,
      currentPage: page,
      totalCount: 100
    };
  },

  // 회원 상세 조회
  // GET /api/admin/users/:userId
  getUserDetail: async (userId) => {
    // return adminApiClient.get(`/users/${userId}`);
    return {
      id: userId,
      nickname: 'user001',
      email: 'user001@example.com',
      joinDate: '2024-01-15',
      status: '정상',
      postCount: 45,
      reportCount: 0
    };
  },

  // 회원 탈퇴
  // DELETE /api/admin/users/:userId
  deleteUser: async (userId) => {
    // return adminApiClient.delete(`/users/${userId}`);
    return { success: true };
  }
};

/**
 * 신고 관리 API
 */
export const reportApi = {
  // 신고된 피드 목록 조회
  // GET /api/admin/reports/feeds?page=1&size=10
  getReportedFeeds: async (page = 1, size = 10) => {
    // return adminApiClient.get('/reports/feeds', { params: { page, size } });
    return {
      data: [],
      totalPages: 5,
      currentPage: page
    };
  },

  // 신고된 댓글 목록 조회
  // GET /api/admin/reports/comments?page=1&size=10
  getReportedComments: async (page = 1, size = 10) => {
    // return adminApiClient.get('/reports/comments', { params: { page, size } });
    return {
      data: [],
      totalPages: 5,
      currentPage: page
    };
  },

  // 신고된 회원 목록 조회
  // GET /api/admin/reports/users?page=1&size=10
  getReportedUsers: async (page = 1, size = 10) => {
    // return adminApiClient.get('/reports/users', { params: { page, size } });
    return {
      data: [],
      totalPages: 5,
      currentPage: page
    };
  },

  // 신고된 피드 삭제
  // DELETE /api/admin/reports/feeds/:feedId
  deleteReportedFeed: async (feedId) => {
    // return adminApiClient.delete(`/reports/feeds/${feedId}`);
    return { success: true };
  },

  // 신고된 댓글 삭제
  // DELETE /api/admin/reports/comments/:commentId
  deleteReportedComment: async (commentId) => {
    // return adminApiClient.delete(`/reports/comments/${commentId}`);
    return { success: true };
  },

  // 회원 정지
  // POST /api/admin/reports/users/:userId/suspend
  suspendUser: async (userId, period) => {
    // return adminApiClient.post(`/reports/users/${userId}/suspend`, { period });
    return { success: true };
  }
};

/**
 * 결제 관리 API
 */
export const paymentApi = {
  // 결제 목록 조회
  // GET /api/admin/payments?page=1&size=10
  getPayments: async (page = 1, size = 10) => {
    // return adminApiClient.get('/payments', { params: { page, size } });
    return {
      data: [],
      totalPages: 10,
      currentPage: page
    };
  },

  // 결제 상세 조회
  // GET /api/admin/payments/:paymentId
  getPaymentDetail: async (paymentId) => {
    // return adminApiClient.get(`/payments/${paymentId}`);
    return {
      id: paymentId,
      userId: 101,
      productName: 'BGM 패키지 A',
      amount: 9900,
      method: '카드',
      paymentDate: '2024-03-01 14:30:00',
      status: '완료',
      refundStatus: '없음'
    };
  }
};

/**
 * BGM 관리 API
 */
export const bgmApi = {
  // BGM 목록 조회
  // GET /api/admin/bgm?page=1&size=10
  getBgmList: async (page = 1, size = 10) => {
    // return adminApiClient.get('/bgm', { params: { page, size } });
    return {
      data: [],
      totalPages: 5,
      currentPage: page
    };
  },

  // BGM 추가
  // POST /api/admin/bgm
  // body: FormData (title, price, audioFile)
  addBgm: async (formData) => {
    // return adminApiClient.post('/bgm', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });
    return { success: true, id: 1 };
  },

  // BGM 수정
  // PUT /api/admin/bgm/:bgmId
  updateBgm: async (bgmId, data) => {
    // return adminApiClient.put(`/bgm/${bgmId}`, data);
    return { success: true };
  },

  // BGM 삭제
  // DELETE /api/admin/bgm/:bgmId
  deleteBgm: async (bgmId) => {
    // return adminApiClient.delete(`/bgm/${bgmId}`);
    return { success: true };
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

