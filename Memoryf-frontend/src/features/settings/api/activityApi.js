import axiosPrivate from '../../auth/api/axios';

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
