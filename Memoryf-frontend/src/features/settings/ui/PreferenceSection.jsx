import { useState, useEffect } from 'react';
import "../../../shared/css/SettingsEditCommon.css";
import { updatePrivacy, getHomeInfo } from '../api';
import { decodeToken } from '../../../shared/lib';

function PreferenceSection() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [memberNo, setMemberNo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.memberNo) {
        setMemberNo(decoded.memberNo);
        fetchPrivacySetting(decoded.memberNo);
      }
    }
  }, []);

  const fetchPrivacySetting = async (mNo) => {
    try {
      const response = await getHomeInfo(mNo);
      if (response.success) {
        setIsPrivate(response.data.isPrivateProfile === 'Y');
      }
    } catch (error) {
      console.error("Failed to fetch privacy setting:", error);
    }
  };

  const handleToggle = async () => {
    const newState = !isPrivate;
    setIsPrivate(newState);

    if (memberNo) {
      try {
        const response = await updatePrivacy(memberNo, newState);
        if (!response.success) {
          setIsPrivate(!newState); // Revert on failure
          alert("설정 변경에 실패했습니다.");
        }
      } catch (error) {
        console.error("Failed to update privacy:", error);
        setIsPrivate(!newState); // Revert on error
        alert("설정 변경 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="settings-edit-container">
      <h1 className="settings-edit-title">계정 공개 범위</h1>

      <div className="preference-card">
        <div className="preference-item">
          <span className="preference-label">비공개 계정</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isPrivate} 
              onChange={handleToggle} 
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <p className="preference-desc">
        계정이 공개 상태인 경우 Memoryf 계정이 없는 사람을 포함해서 Memoryf 안팎의 모든 사람이 프로필과 게시물을 볼 수 있습니다.
      </p>
      <p className="preference-desc">
        계정이 비공개 상태인 경우 회원님이 승인한 팔로워만 회원님이 공유하는 콘텐츠(해시태그 및 위치 페이지의 사진 또는 동영상 포함)와 회원님의 팔로워 및 팔로잉 리스트를 볼 수 있습니다. 프로필 사진, 사용자 이름 등 프로필의 특정 정보는 Memoryf 내외의 모든 사람에게 공개됩니다.
      </p>
    </div>
  );
}
export default PreferenceSection;