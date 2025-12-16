function SecuritySection() {
  return (
    <div className="settings-card">
      <h2>비밀번호 변경</h2>

      <div className="field">
        <label>현재 비밀번호</label>
        <input type="password" />
      </div>

      <div className="field">
        <label>새 비밀번호</label>
        <input type="password" />
      </div>

      <div className="field">
        <label>새 비밀번호 확인</label>
        <input type="password" />
      </div>

      <button className="primary">비밀번호 변경</button>
    </div>
  );
}
export default SecuritySection;