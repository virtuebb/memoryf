import axiosPrivate from '../../auth/api/axios';

export const updatePrivacy = async (memberNo, isPrivate) => {
  try {
    const response = await axiosPrivate.put(`/home/${memberNo}/privacy`, { isPrivate });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHomeInfo = async (memberNo) => {
    try {
        const response = await axiosPrivate.get(`/home/${memberNo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
