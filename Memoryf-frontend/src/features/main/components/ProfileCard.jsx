import "./ProfileCard.css";

function ProfileCard() {
  return (
    <section className="profile-card card">
      <div className="profile-row">
        
        {/* 왼쪽 : 아바타 */}
        <div className="profile-avatar">
          <img src="/avatar-dummy.png" alt="profile" />
          <span className="online-dot" />
        </div>

        {/* 오른쪽 : 정보 */}
        <div className="profile-content">
          <h2 className="name">김제니</h2>
          <span className="username">@jenny_dreamer</span>

          <p className="bio">
            ✨ 일상의 순간을 기록하는 크리에이터<br />
            📷 서울의 파스텔 같은 풍경을 담아요<br />
            💌 협업은 DM으로 편하게 연락 주세요
          </p>

          {/* 통계 → 메시지 바로 아래 */}
          <div className="stats inline">
            <div>
              <strong>1,240</strong>
              <span>게시물</span>
            </div>
            <div>
              <strong>45.2k</strong>
              <span>팔로워</span>
            </div>
            <div>
              <strong>380</strong>
              <span>팔로잉</span>
            </div>
          </div>

          <div className="meta">
            <span>📍 서울, 대한민국</span>
            <span className="link">jenny.world</span>
          </div>

          <div className="actions">
            <button className="btn primary">팔로우</button>
            <button className="btn">메시지</button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProfileCard;
