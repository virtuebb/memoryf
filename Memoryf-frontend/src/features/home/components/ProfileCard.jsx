import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeByMemberNo, uploadProfileImage } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import "../css/ProfileCard.css";

function ProfileCard() {
  const navigate = useNavigate();

  /* =========================
     기본 상태
  ========================= */
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const currentMemberNo = getMemberNoFromToken();
  const fileInputRef = useRef(null);

  /* =========================
     🔒 임시 안전장치 (팔로우 기능 비활성)
     👉 에러 방지용
  ========================= */
  const memberNo = currentMemberNo;
  const isOwner = true;

  const [isFollowModalOpen] = useState(false);
  const [followModalType] = useState(null);
  const [followKeyword] = useState("");

  /* =========================
     홈 정보 조회
  ========================= */
  useEffect(() => {
    if (!currentMemberNo) {
      navigate("/login");
      return;
    }

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setHome(homeData);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        setHome(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [currentMemberNo, navigate]);

  /* =========================
     핸들러
  ========================= */
  const handleEditProfile = () => {
    navigate("/settings/edit");
  };

  const handleMessage = () => {
    navigate("/dm");
  };

  const handleProfileImageClick = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setUploading(true);
      const result = await uploadProfileImage(currentMemberNo, file);

      if (result?.success) {
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setHome(homeData);
        setImageTimestamp(Date.now());
        alert("프로필 이미지가 변경되었습니다.");
      }
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* =========================
     로딩 / 예외 처리
  ========================= */
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

  /* =========================
     렌더링
  ========================= */
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
            style={{ display: "none" }}
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

          <div className="actions owner">
            <button className="btn primary" onClick={handleEditProfile}>
              프로필 편집
            </button>
            <button className="btn secondary message-btn" onClick={handleMessage}>
              메시지 보내기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
