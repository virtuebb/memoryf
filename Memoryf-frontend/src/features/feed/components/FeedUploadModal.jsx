import { useState, useRef } from 'react';
import { createFeed } from '../api/feedApi';
import './FeedUploadModal.css';

function FeedUploadModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: 사진 선택, 2: 글 작성
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 캐러셀 현재 이미지 인덱스
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 이미지 파일만 허용
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedFiles(imageFiles);
    
    // 미리보기 생성
    const previewPromises = imageFiles.map(file => {
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

  // 해시태그 추출 (공백으로 구분)
  const extractTags = (text) => {
    const tags = text.split(/\s+/).filter(tag => tag.startsWith('#') && tag.length > 1);
    return tags.join(' ');
  };

  // 피드 업로드
  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert('최소 1개 이상의 이미지를 선택해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // 피드 정보 추가
      formData.append('content', content || '');
      formData.append('tag', extractTags(tag));
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      formData.append('memberNo', 1); // 임시로 1, 추후 세션에서 가져오기
      
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
    } catch (error) {
      console.error('피드 업로드 오류:', error);
      // 서버 응답이 있는 경우 상세 메시지 표시
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error 
        || error?.message 
        || '피드 업로드 중 오류가 발생했습니다.';
      alert(`피드 업로드 실패: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    setStep(1);
    setSelectedFiles([]);
    setPreviews([]);
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
            <h2>새 게시물 만들기</h2>
          ) : (
            <>
              <button className="modal-back-btn" onClick={() => setStep(1)}>
                ←
              </button>
              <h2>새 게시물 만들기</h2>
              <button className="modal-share-btn" onClick={handleSubmit} disabled={isUploading}>
                {isUploading ? '공유 중...' : '공유하기'}
              </button>
            </>
          )}
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* 본문 */}
        <div className="modal-body">
          {step === 1 ? (
            // 1단계: 사진 선택
            <div className="upload-step-1">
              <div className="upload-icon">📷</div>
              <h3>사진을 여기에 끌어다 놓으세요</h3>
              <button className="select-photos-btn" onClick={handleSelectClick}>
                컴퓨터에서 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">최소 1개 이상의 이미지를 선택해주세요</p>
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
                  
                  {/* 현재 이미지 */}
                  <div className="carousel-image-wrapper">
                    <img 
                      src={previews[currentImageIndex]} 
                      alt={`미리보기 ${currentImageIndex + 1}`} 
                      className="carousel-image"
                    />
                    {previews.length > 1 && (
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
                <div className="form-group">
                  <label>프로필</label>
                  <div className="profile-info">
                    <span className="profile-avatar">👤</span>
                    <span className="profile-name">사용자</span>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    className="content-input"
                    placeholder="문구 입력..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="tag-input"
                    placeholder="해시태그 입력 (예: #여행 #일상)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="location-input"
                    placeholder="위치 추가 (선택사항)"
                    onChange={(e) => {
                      // 위치 정보는 나중에 지도 API로 구현 가능
                      // 현재는 텍스트로만 입력
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedUploadModal;

