import api from '../../auth/api/axios';

export const followMember = async (targetMemberNo, memberNo) => {
  const response = await api.post(`/follow/${targetMemberNo}`, { memberNo });
  return response.data;
};

export const unfollowMember = async (targetMemberNo, memberNo) => {
  const response = await api.delete(`/follow/${targetMemberNo}`, { data: { memberNo } });
  return response.data;
};

export const getFollowersList = async (
  memberNo,
  currentMemberNo = null,
  { page = 0, size = 20, keyword = '' } = {}
) => {
  const params = { page, size };
  if (currentMemberNo) params.currentMemberNo = currentMemberNo;
  if (keyword) params.keyword = keyword;

  const response = await api.get(`/follow/followers/${memberNo}`, { params });
  return response.data;
};

export const getFollowingList = async (
  memberNo,
  currentMemberNo = null,
  { page = 0, size = 20, keyword = '' } = {}
) => {
  const params = { page, size };
  if (currentMemberNo) params.currentMemberNo = currentMemberNo;
  if (keyword) params.keyword = keyword;

  const response = await api.get(`/follow/following/${memberNo}`, { params });
  return response.data;
};
