/**
 * 👤 Member Info API
 *
 * SecuritySection 등에서 사용하는 회원 정보 조회 API.
 * 백엔드 응답이 ApiResponse 봉투이거나(raw payload) 둘 다 올 수 있어
 * getApiResponseData로 안전하게 언랩합니다.
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

export const getMemberInfo = async (memberNo) => {
  const response = await baseApi.get(`/member/info?memberNo=${memberNo}`);
  return getApiResponseData(response.data, {});
};
