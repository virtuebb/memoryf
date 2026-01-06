/**
 * 👣 Visitor API
 * 
 * 방문자 기록 관련 API 호출 모듈
 */
import { baseApi } from '../../../shared/api';

// =========================
// 방문 기록 생성 (POST)
// =========================
export const visitHome = (homeNo) => {
  return baseApi.post(
    "/visitors",
    null,
    {
      params: { homeNo },
    }
  );
};

// =========================
// 방문자 통계 조회 (GET)
// =========================
export const getVisitorStats = (homeNo) => {
  return baseApi.get(
    "/visitors/stats",
    {
      params: { homeNo },
    }
  );
};
