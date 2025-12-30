import axiosPrivate from '../../auth/api/axios';

export const getNotifications = async (memberNo) => {
  try {
    const response = await axiosPrivate.get(`/notifications/${memberNo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadCount = async (memberNo) => {
  try {
    const response = await axiosPrivate.get(`/notifications/${memberNo}/count`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (notificationNo) => {
  try {
    const response = await axiosPrivate.put(`/notifications/${notificationNo}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationNo) => {
  try {
    const response = await axiosPrivate.delete(`/notifications/${notificationNo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptFollowRequest = async (requesterNo, memberNo) => {
  try {
    const response = await axiosPrivate.post(`/follow/accept/${requesterNo}`, { memberNo });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectFollowRequest = async (requesterNo, memberNo) => {
  try {
    const response = await axiosPrivate.post(`/follow/reject/${requesterNo}`, { memberNo });
    return response.data;
  } catch (error) {
    throw error;
  }
};
