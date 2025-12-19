import api from "./axios";

// newPassword: 사용자가 입력한 새 비밀번호(평문) -> 백엔드에서 암호화
const resetPwdApi = (memberId, newPassword) => {
  return api.post(
    "/find/reset",
    {memberId: memberId, memberPwd: newPassword}
  );
};

export default resetPwdApi;