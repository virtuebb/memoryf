import { useState, useRef, useEffect } from 'react';
import { createFeed, updateFeed } from '../api/feedApi';
import { getHomeByMemberNo } from '../../home/api/homeApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import defaultProfileImg from '../../../assets/images/profiles/default-profile.svg';

// 지도
import KakaoLocationPicker from "../../map/components/KakaoLocationPicker";

import './FeedUploadModal.css';

function FeedUploadModal({ isOpen, onClose, onSuccess, mode = 'create', initialFeed = null }) {
  const isEditMode = mode === 'edit';
  const [step, setStep] = useState(isEditMode ? 2 : 1); // 수정 모드면 바로 2단계로
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // 지도
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationName, setLocationName] = useState('');
  


  const [isUploading, setIsUploading] = useState(false);
  const [userProfile, setUserProfile] = useState({ memberNick: '사용자', profileChangeName: null });
  const fileInputRef = useRef(null);
  const currentMemberNo = getMemberNoFromToken();

  // 사용자 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentMemberNo) return;
      try {
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        if (homeData) {
          setUserProfile({
            memberNick: homeData.memberNick || '사용자',
            profileChangeName: homeData.profileChangeName
          });
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen, currentMemberNo]);

  // 수정 모드일 때 기존 피드 데이터 불러오기
  useEffect(() => {
    if (isOpen && isEditMode && initialFeed) {
      setContent(initialFeed.content || '');
      setTag(initialFeed.tag || '');
      setLatitude(initialFeed.latitude || '');
      setLongitude(initialFeed.longitude || '');
      
      // 기존 이미지들을 미리보기로 설정
      if (initialFeed.feedFiles && initialFeed.feedFiles.length > 0) {
        const imageUrls = initialFeed.feedFiles.map(file => {
          if (file.filePath?.startsWith('http://') || file.filePath?.startsWith('https://')) {
            return file.filePath;
          }
          return `http://localhost:8006/memoryf${file.filePath}`;
        });
        setPreviews(imageUrls);
        setStep(2); // 수정 모드면 바로 2단계
      }
    } else if (isOpen && !isEditMode) {
      // 새로 작성 모드일 때 초기화
      setContent('');
      setTag('');
      setLatitude('');
      setLongitude('');
      setPreviews([]);
      setSelectedFiles([]);
      setStep(1);
    }
  }, [isOpen, isEditMode, initialFeed]);

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 이미지 및 동영상 파일 허용
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length === 0) {
      alert('이미지 또는 동영상 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedFiles(validFiles);
    
    // 미리보기 생성
    const previewPromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(previewUrls => {
      setPreviews(previewUrls);
      setCurrentImageIndex(0); // 첫 번째 이미지로 초기화
      setStep(2); // 다음 단계로 이동
    });
  };

  // 파일 선택 버튼 클릭
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 제거
  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    // 현재 인덱스 조정
    if (currentImageIndex >= newPreviews.length) {
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1));
    }
    
    if (newFiles.length === 0) {
      setStep(1);
      setCurrentImageIndex(0);
    }
  };

  // 캐러셀 이전 이미지
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : previews.length - 1));
  };

  // 캐러셀 다음 이미지
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < previews.length - 1 ? prev + 1 : 0));
  };

  // 해시태그 추출
  // - 본문(content)이나 태그 입력(tag)에 있는 #태그를 모두 추출
  // - [#맛집](#맛집), [#맛집] (#맛집)처럼 괄호/대괄호 안에 있어도 #문자열이면 인식
  // - 중복 제거, '#' 제거 후 '맛집,영화관' 형태로 저장
  const extractTags = (text) => {
    if (!text) return '';
    const matches = String(text).match(/#[\p{L}\p{N}_]+/gu) || [];
    const normalized = matches
      .map((m) => m.slice(1).trim())
      .filter(Boolean);
    const unique = Array.from(new Set(normalized));
    return unique.join(',');
  };

  const buildTagsForSave = () => {
    // 본문(content) + 별도 태그 입력(tag) 모두에서 추출
    const merged = `${content || ''} ${tag || ''}`;
    return extractTags(merged);
  };

  // 피드 업로드/수정
  const handleSubmit = async () => {
    // 수정 모드가 아닐 때만 이미지 파일 체크
    if (!isEditMode && selectedFiles.length === 0) {
      alert('최소 1개 이상의 이미지를 선택해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      if (isEditMode) {
        // 수정 모드: 내용/태그만 업데이트
        const response = await updateFeed(initialFeed.feedNo, {
          content: content || '',
          tag: buildTagsForSave(),
          latitude: latitude || '',
          longitude: longitude || '',
          locationName: locationName || '',
        });
        
        if (response && response.success) {
          alert('피드가 성공적으로 수정되었습니다.');
          // 피드 목록 새로고침
          window.dispatchEvent(new Event('feedChanged'));
          handleClose();
          if (onSuccess) onSuccess();
        } else {
          const errorMessage = response?.message || '피드 수정에 실패했습니다.';
          alert(errorMessage);
          console.error('피드 수정 실패:', response);
        }
      } else {
        // 생성 모드: FormData로 파일 포함 업로드
        const formData = new FormData();
        
        // 🔐 JWT에서 현재 로그인한 회원 번호 가져오기
        const memberNo = getMemberNoFromToken();
        if (!memberNo) {
          alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
          return;
        }

        // 피드 정보 추가
        formData.append('content', content || '');
        formData.append('tag', buildTagsForSave());
        if (latitude) formData.append('latitude', latitude);
        if (longitude) formData.append('longitude', longitude);
        // 지도
        if (locationName) formData.append('locationName', locationName);
        formData.append('memberNo', memberNo);
        
        // 이미지 파일 추가
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });

        const response = await createFeed(formData);
        
        if (response && response.success) {
          alert('피드가 성공적으로 업로드되었습니다.');
          handleClose();
          if (onSuccess) onSuccess();
        } else {
          const errorMessage = response?.message || '피드 업로드에 실패했습니다.';
          alert(errorMessage);
          console.error('피드 업로드 실패:', response);
        }
      }
    } catch (error) {
      console.error(isEditMode ? '피드 수정 오류:' : '피드 업로드 오류:', error);
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error 
        || error?.message 
        || (isEditMode ? '피드 수정 중 오류가 발생했습니다.' : '피드 업로드 중 오류가 발생했습니다.');
      alert(`피드 ${isEditMode ? '수정' : '업로드'} 실패: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    setStep(isEditMode ? 2 : 1);
    setSelectedFiles([]);
    if (!isEditMode) {
      setPreviews([]);
    }
    setCurrentImageIndex(0);
    setContent('');
    setTag('');
    setLatitude('');
    setLongitude('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="feed-upload-modal-overlay" onClick={handleClose}>
      <div className="feed-upload-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="modal-header">
          {step === 1 ? (
            <h2>{isEditMode ? '피드 수정' : '새 게시물 만들기'}</h2>
          ) : (
            <>
              {!isEditMode && (
                <button className="modal-back-btn" onClick={() => setStep(1)}>
                  ←
                </button>
              )}
              <h2>{isEditMode ? '피드 수정' : '새 게시물 만들기'}</h2>
              <button className="modal-share-btn" onClick={handleSubmit} disabled={isUploading}>
                {isUploading ? (isEditMode ? '수정 중...' : '공유 중...') : (isEditMode ? '수정하기' : '공유하기')}
              </button>
            </>
          )}
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* 본문 */}
        <div className="modal-body">
          {step === 1 && !isEditMode ? (
            // 1단계: 사진 선택 (수정 모드에서는 건너뛰기)
            <div className="upload-step-1">
              <div className="upload-icon">📷</div>
              <h3>사진과 동영상을 여기에 끌어다 놓으세요</h3>
              <button className="select-photos-btn" onClick={handleSelectClick}>
                컴퓨터에서 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">최소 1개 이상의 파일을 선택해주세요</p>
            </div>
          ) : (
            // 2단계: 글 작성
            <div className="upload-step-2">
              <div className="upload-preview-section">
                <div className="image-carousel-container">
                  {/* 이전 버튼 */}
                  {previews.length > 1 && (
                    <button
                      className="carousel-btn carousel-btn-prev"
                      onClick={handlePrevImage}
                      aria-label="이전 이미지"
                    >
                      ‹
                    </button>
                  )}
                  
                  {/* 현재 이미지/동영상 */}
                  <div className="carousel-image-wrapper">
                    {(previews[currentImageIndex]?.startsWith('data:video') || 
                      ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(previews[currentImageIndex]?.split('.').pop().toLowerCase())) ? (
                      <video
                        src={previews[currentImageIndex]}
                        className="carousel-image"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img 
                        src={previews[currentImageIndex]} 
                        alt={`미리보기 ${currentImageIndex + 1}`} 
                        className="carousel-image"
                      />
                    )}
                    {/* 수정 모드에서는 이미지 삭제 불가 */}
                    {previews.length > 1 && !isEditMode && (
                      <button
                        className="remove-image-btn"
                        onClick={() => handleRemoveFile(currentImageIndex)}
                        aria-label="이미지 삭제"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  {/* 다음 버튼 */}
                  {previews.length > 1 && (
                    <button
                      className="carousel-btn carousel-btn-next"
                      onClick={handleNextImage}
                      aria-label="다음 이미지"
                    >
                      ›
                    </button>
                  )}
                  
                  {/* 이미지 인디케이터 */}
                  {previews.length > 1 && (
                    <div className="carousel-indicators">
                      {previews.map((_, index) => (
                        <button
                          key={index}
                          className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`이미지 ${index + 1}로 이동`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="upload-form-section">
                {/* 프로필과 내용 입력을 하나의 영역으로 통합 */}
                <div className="content-wrapper">
                  <div className="profile-header">
                    <img 
                      className="profile-avatar" 
                      src={userProfile.profileChangeName 
                        ? `http://localhost:8006/memoryf/profile_images/${userProfile.profileChangeName}` 
                        : defaultProfileImg}
                      alt="프로필"
                      onError={(e) => { e.target.src = defaultProfileImg; }}
                    />
                    <span className="profile-name">{userProfile.memberNick}</span>
                  </div>
                  <textarea
                    className="content-input"
                    placeholder="문구를 입력하세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={2200}
                  />
                  <div className="content-footer">
                    <span className="emoji-btn">😊</span>
                    <span className="char-count">{content.length}/2200</span>
                  </div>
                </div>
                
                {/* 위치 추가 옵션 */}
                <div
                  className="option-item"
                  onClick={() => setIsLocationOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="option-label">
                    📍 {locationName || "위치 추가"}
                  </span>
                  <span className="option-icon">📍</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ✅ 지도 위치 선택 모달 */}
        {isLocationOpen && (
          <KakaoLocationPicker
            onSelect={(loc) => {
              // loc: { latitude, longitude, placeName, kakaoPlaceId, addressName, roadAddress }
              setLatitude(loc.latitude);
              setLongitude(loc.longitude);
              setLocationName(loc.placeName || loc.addressName); // ✅ 이 줄 추가
              setIsLocationOpen(false);
            }}
            onClose={() => setIsLocationOpen(false)}
          />
        )}

        

      </div>
    </div>
  );
}

export default FeedUploadModal;

