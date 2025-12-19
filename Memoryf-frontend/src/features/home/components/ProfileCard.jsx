import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeByMemberNo, uploadProfileImage } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import "../css/ProfileCard.css";

function ProfileCard({ memberNo, isOwner }) {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const currentMemberNo = getMemberNoFromToken();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!currentMemberNo) {
        navigate('/login');
        return;
      }

      if (!memberNo) return;

      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(memberNo, currentMemberNo);
        setHome(homeData);
      } catch (error) {
        console.error('홈 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [currentMemberNo, memberNo, navigate]);

  const handleEditProfile = () => {
    navigate('/settings/edit');
  };

  const handleMessage = () => {
    navigate('/dm');
  };

  const handleProfileImageClick = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfileImage(currentMemberNo, file);
      
      if (result.success) {
        // 프로필 이미지 업데이트 성공 - 홈 데이터 다시 조회
        const homeData = await getHomeByMemberNo(memberNo, currentMemberNo);
        setHome(homeData);
        setImageTimestamp(Date.now()); // 캐시 무효화를 위한 타임스탬프 갱신
        alert('프로필 이미지가 변경되었습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <section className="profile-card card">
        <div className="profile-loading">로딩 중...</div>
      </section>
    );
  }

  if (!home) {
    return (
      <section className="profile-card card">
        <div className="profile-error">프로필을 불러올 수 없습니다.</div>
      </section>
    );
  }

  const profileImageUrl = home.profileChangeName 
    ? `http://localhost:8006/memoryf/profile_images/${home.profileChangeName}?t=${imageTimestamp}`
    : defaultProfileImg;

  const handleImageError = (e) => {
    e.target.src = defaultProfileImg;
  };

  return (
    <section className="profile-card card">
      <div className="profile-row">
        
        {/* 왼쪽 : 아바타 */}
        <div className="profile-avatar" onClick={handleProfileImageClick}>
          <img 
            src={profileImageUrl} 
            alt="profile" 
            className={uploading ? 'uploading' : ''}
            onError={handleImageError}
          />
          <span className="online-dot" />
          {isOwner && uploading && <div className="upload-overlay">업로드 중...</div>}
          {isOwner && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          )}
        </div>

        {/* 오른쪽 : 정보 */}
        <div className="profile-content">
          <h2 className="name">{home.memberNick}</h2>
          <span className="username">@{home.memberNick}</span>

          {home.statusMsg && (
            <p className="bio">{home.statusMsg}</p>
          )}

          {/* 통계 */}
          <div className="stats inline">
            <div>
              <strong>{home.feedCount || 0}</strong>
              <span>게시물</span>
            </div>
            <div>
              <strong>{home.followerCount || 0}</strong>
              <span>팔로워</span>
            </div>
            <div>
              <strong>{home.followingCount || 0}</strong>
              <span>팔로잉</span>
            </div>
          </div>

          <div className="actions">
            {isOwner && (
              <button className="btn primary" onClick={handleEditProfile}>
                프로필 편집
              </button>
            )}
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
