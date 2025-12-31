import axiosPrivate from '../../auth/api/axios';
import { getMemberNoFromToken } from '../../../utils/jwt';

export const getLikedFeeds = async (params) => {
  try {
    const response = await axiosPrivate.get('/feeds/liked', { params });
    return response.data;
  } catch (error) {
    console.error('좋아요한 피드 조회 실패:', error);
    throw error;
  }
};

export const getCommentedFeeds = async (params) => {
  try {
    const response = await axiosPrivate.get('/feeds/commented', { params });
    return response.data;
  } catch (error) {
    console.error('댓글 단 피드 조회 실패:', error);
    throw error;
  }
};

export const toggleLike = async (feedNo, memberNo) => {
  try {
    const response = await axiosPrivate.post(`/feeds/${feedNo}/likes`, { memberNo });
    return response.data;
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

export const getAccountHistory = async (params) => {
  const tokenMemberNo = getMemberNoFromToken();
  const memberNo = params?.memberNo || tokenMemberNo || localStorage.getItem('memberNo');
  if (!memberNo) {
    return { list: [] };
  }

  const query = {
    ...params,
    memberNo,
  };

  try {
    const response = await axiosPrivate.get('/member/history', { params: query });
    return response.data || { list: [] };
  } catch (error) {
    console.error('계정 내역 조회 실패:', error);
    throw error;
  }
};
