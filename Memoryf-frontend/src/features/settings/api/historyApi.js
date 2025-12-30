import axiosPrivate from '../../auth/api/axios';

export const getAccountHistory = async (params) => {
  try {
    const response = await axiosPrivate.get('/member/history', { params });
    return response.data;
  } catch (error) {
    console.error('계정 내역 조회 실패:', error);
    throw error;
  }
};
