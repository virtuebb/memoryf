/**
 * Legacy Admin API
 *
 * 현재 백엔드에 존재하는 /admin/select* 형태의 엔드포인트를 래핑합니다.
 * 응답이 ApiResponse 봉투이거나(raw payload) 둘 다 올 수 있어 getApiResponseData로 안전하게 언랩합니다.
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

export const selectUserCount = async () => {
  const response = await baseApi.get('/admin/selectUserCount');
  return getApiResponseData(response.data, 0);
};

export const selectUsers = async () => {
  const response = await baseApi.get('/admin/selectUsers');
  return getApiResponseData(response.data, []);
};

export const deleteUser = async (userId) => {
  const response = await baseApi.post(`/admin/deleteUser/${userId}`);
  return getApiResponseData(response.data);
};
