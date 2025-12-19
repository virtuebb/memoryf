import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeByMemberNo, uploadProfileImage } from "../api/homeApi";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import "../css/ProfileCard.css";

function ProfileCard({ memberNo }) {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const fileInputRef = useRef(null);

  /* 홈 정보 조회 */
  useEffect(() => {
    if (!memberNo) return;

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(memberNo);
        setHome(homeData);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        setHome(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [memberNo]);

  const handleEditProfile = () => {
    navigate("/settings/edit");
  };

  const handleMessage = () => {
    navigate("/dm");
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setUploading(true);
      await uploadProfileImage(memberNo, file);

      const homeData = await getHomeByMemberNo(memberNo);
      setHome(homeData);
      setImageTimestamp(Date.now());
    } catch (e) {
      console.error("프로필 이미지 업로드 실패", e);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <section className="profile-card card">
        <div className="profile-loading">로딩 중...</div>
      </section>
    );
  }

  if (!home || !home.memberNick) {
    return (
      <section className="profile-card card">
        <div className="profile-empty">아직 프로필 정보가 없어요 🌱</div>
      </section>
    );
  }

  const profileImageUrl = home.profileChangeName
    ? `http://localhost:8006/memoryf/profile_images/${home.profileChangeName}?t=${imageTimestamp}`
    : defaultProfileImg;

  return (
    <section className="profile-card card">
      <div className="profile-row">
        {/* 아바타 */}
        <div className="profile-avatar" onClick={handleProfileImageClick}>
          <img src={profileImageUrl} alt="profile" />
          <span className="online-dot" />
          {uploading && <div className="upload-overlay">업로드 중...</div>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {/* 정보 */}
        <div className="profile-content">
          <h2 className="name">{home.memberNick}</h2>
          <span className="username">@{home.memberNick}</span>

          {home.statusMsg && <p className="bio">{home.statusMsg}</p>}

          <div className="stats inline">
            <div>
              <strong>{home.feedCount ?? 0}</strong>
              <span>게시물</span>
            </div>
            <div>
              <strong>{home.followerCount ?? 0}</strong>
              <span>팔로워</span>
            </div>
            <div>
              <strong>{home.followingCount ?? 0}</strong>
              <span>팔로잉</span>
            </div>
          </div>

          <div className="actions">
            <button className="btn primary" onClick={handleEditProfile}>
              프로필 편집
            </button>
            <button className="btn" onClick={handleMessage}>
              메시지
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
