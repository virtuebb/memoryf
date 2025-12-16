function PreferenceSection() {
  return (
    <div className="settings-card">
      <h2>환경 설정</h2>

      <div className="toggle">
        <span>비공개 계정</span>
        <input type="checkbox" />
      </div>

      <div className="desc">
        계정을 비공개로 전환하면 팔로워만 콘텐츠를 볼 수 있습니다.
      </div>

      <hr />

      <p>테마 설정은 좌측 사이드바에서 변경할 수 있습니다.</p>
    </div>
  );
}
export default PreferenceSection;