import api from "../../auth/api/axios.js";

const storyApi = {
  selectStoryList: (memberNo) => api.get(`/story/list/${memberNo}`),
  selectStoryListByMember: (memberNo) => api.get(`/story/member/${memberNo}`),
  selectStoryDetail: (storyNo) => api.get(`/story/${storyNo}`),
  insertStoryVisitor: (memberNo, storyNo) =>
    api.post(`/story/visit`, { memberNo, storyNo }),

  // ✅ 스토리 업로드 (multipart)
  insertStory: (formData) => api.post("/story", formData),


  deleteStory: (storyNo) => api.delete(`/story/${storyNo}`),
};

export default storyApi;
