// ../api/findPwdApi.js
import api from "./axios";

// 비밀번호 찾기(존재 여부 확인)
const findPwdApi = (memberId, email) => {
  return api.post(
    "/find/pwd",
    {memberId: memberId, email: email}
  );
};

export default findPwdApi;
