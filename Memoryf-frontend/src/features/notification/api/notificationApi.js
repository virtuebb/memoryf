/**
 * 🔔 Notification API
 * 
 * 알림 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 알림 목록 조회
 */
export const getNotifications = async (memberNo) => {
  const response = await baseApi.get(`/notifications/${memberNo}`);
  return response.data;
};

/**
 * 읽지 않은 알림 개수 조회
 */
export const getUnreadCount = async (memberNo) => {
  const response = await baseApi.get(`/notifications/${memberNo}/count`);
  return response.data;
};

/**
 * 알림 읽음 처리
 */
export const markAsRead = async (notificationNo) => {
  const response = await baseApi.put(`/notifications/${notificationNo}/read`);
  return response.data;
};

/**
 * 알림 삭제
 */
export const deleteNotification = async (notificationNo) => {
  const response = await baseApi.delete(`/notifications/${notificationNo}`);
  return response.data;
};

/**
 * 팔로우 요청 수락
 */
export const acceptFollowRequest = async (requesterNo, memberNo) => {
  const response = await baseApi.post(`/follow/accept/${requesterNo}`, { memberNo });
  return response.data;
};

/**
 * 팔로우 요청 거절
 */
export const rejectFollowRequest = async (requesterNo, memberNo) => {
  const response = await baseApi.post(`/follow/reject/${requesterNo}`, { memberNo });
  return response.data;
};
