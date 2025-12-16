import api from "./axios";

const loginMemberApi = async (memberId, memberPwd) => {
  try {
    const response = await api.post("/login", {
      memberId,
      memberPwd,
    });

    return response.data; // JWT
  } catch (error) {
    console.log("로그인 ajax 통신 실패", error);
    return null;
  }
};

export default loginMemberApi;
