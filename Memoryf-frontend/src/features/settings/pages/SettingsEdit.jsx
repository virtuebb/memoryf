import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeByMemberNo, updateProfile, uploadProfileImage } from "../../home/api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import "../css/SettingsEdit.css";

function SettingsEdit() {
  const navigate = useNavigate();
  const currentMemberNo = getMemberNoFromToken();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    memberNick: "",
    statusMsg: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentMemberNo) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setProfileData(homeData);
        setFormData({
          memberNick: homeData.memberNick || "",
          statusMsg: homeData.statusMsg || "",
        });
      } catch (error) {
        console.error('프로필 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentMemberNo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfileImage(currentMemberNo, file);
      
      if (result.success) {
        // 프로필 이미지 업데이트 성공 - 데이터 다시 조회
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setProfileData(homeData);
        alert('프로필 사진이 변경되었습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.memberNick.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      const result = await updateProfile(currentMemberNo, formData);
      
      if (result.success) {
        alert('프로필이 저장되었습니다.');
        // 데이터 갱신
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setProfileData(homeData);
      } else {
        alert('프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-edit-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  const profileImageUrl = profileData?.profileChangeName 
    ? `http://localhost:8006/memoryf/profile_images/${profileData.profileChangeName}`
    : defaultProfileImg;

  return (
    <div className="settings-edit-container">
      <h1 className="settings-edit-title">프로필 편집</h1>
      <div className="settings-edit-header">
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <img src={profileImageUrl} alt="프로필 사진" />
          </div>
          <div className="profile-info">
            <div className="profile-nickname">{profileData?.memberNick}</div>
            <div className="profile-id">{profileData?.memberId}</div>
          </div>
        </div>
        <button 
          type="button" 
          className="change-photo-btn"
          onClick={handleProfileImageClick}
          disabled={uploading}
        >
          {uploading ? '업로드 중...' : '사진 변경'}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="memberNick">닉네임</label>
          <div className="input-wrap">
            <input
              type="text"
              id="memberNick"
              name="memberNick"
              value={formData.memberNick}
              onChange={handleChange}
              placeholder="닉네임"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="statusMsg">소개</label>
          <div className="input-wrap">
            <textarea
              id="statusMsg"
              name="statusMsg"
              value={formData.statusMsg}
              onChange={handleChange}
              placeholder="소개"
              rows="3"
            />
            <div className="helper-text">{formData.statusMsg.length} / 150</div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? '저장 중...' : '제출'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsEdit;
