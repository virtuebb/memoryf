function AccountSection() {
  return (
    <div className="settings-card">
      <h2>내 회원정보</h2>

      <div className="field">
        <label>이메일</label>
        <input type="text" value="user@email.com" disabled />
      </div>

      <div className="field">
        <label>닉네임</label>
        <input type="text" placeholder="닉네임 수정" />
      </div>

      <button className="primary">정보 수정</button>

      <hr />

      <button className="danger">회원 탈퇴</button>
    </div>
  );
}

export default AccountSection;
