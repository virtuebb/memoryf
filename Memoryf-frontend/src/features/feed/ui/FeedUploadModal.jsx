import defaultProfileImg from '../../../assets/images/profiles/default-profile.svg';
import { getProfileImageUrl } from '../../../shared/api';

// 지도
import { KakaoLocationPicker } from '../../../shared/ui';

import { useFeedUploadModal } from '../model/useFeedUploadModal';

import './FeedUploadModal.css';

function FeedUploadModal({ isOpen, onClose, onSuccess, mode = 'create', initialFeed = null }) {
	const {
		isEditMode,
		step,
		setStep,
		previews,
		currentImageIndex,
		setCurrentImageIndex,
		content,
		setContent,
		isLocationOpen,
		setIsLocationOpen,
		locationName,
		isUploading,
		userProfile,
		fileInputRef,
		handleFileSelect,
		handleSelectClick,
		handleRemoveFile,
		handlePrevImage,
		handleNextImage,
		handleSelectLocation,
		handleClose,
		handleSubmit,
	} = useFeedUploadModal({ isOpen, mode, initialFeed, onClose, onSuccess });

	if (!isOpen) return null;

	return (
		<div className="feed-upload-modal-overlay" onClick={handleClose}>
			<div className="feed-upload-modal" onClick={(e) => e.stopPropagation()}>
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
								{isUploading ? (isEditMode ? '수정 중...' : '공유 중...') : isEditMode ? '수정하기' : '공유하기'}
							</button>
						</>
					)}
					<button className="modal-close-btn" onClick={handleClose}>
						×
					</button>
				</div>

				<div className="modal-body">
					{step === 1 && !isEditMode ? (
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
						<div className="upload-step-2">
							<div className="upload-preview-section">
								<div className="image-carousel-container">
									{previews.length > 1 && (
										<button
											className="carousel-btn carousel-btn-prev"
											onClick={handlePrevImage}
											aria-label="이전 이미지"
										>
											‹
										</button>
									)}

									<div className="carousel-image-wrapper">
										{previews[currentImageIndex]?.startsWith('data:video') ||
										['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(
											previews[currentImageIndex]?.split('.').pop().toLowerCase()
										) ? (
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

									{previews.length > 1 && (
										<button
											className="carousel-btn carousel-btn-next"
											onClick={handleNextImage}
											aria-label="다음 이미지"
										>
											›
										</button>
									)}

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
								<div className="content-wrapper">
									<div className="profile-header">
										<img
											className="profile-avatar"
											src={
												userProfile.profileChangeName
													? getProfileImageUrl(userProfile.profileChangeName)
													: defaultProfileImg
											}
											alt="프로필"
											onError={(e) => {
												e.target.src = defaultProfileImg;
											}}
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

								<div
									className="option-item"
									onClick={() => setIsLocationOpen(true)}
									style={{ cursor: 'pointer' }}
								>
									<span className="option-label">📍 {locationName || '위치 추가'}</span>
									<span className="option-icon">📍</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{isLocationOpen && (
					<KakaoLocationPicker
						onSelect={handleSelectLocation}
						onClose={() => setIsLocationOpen(false)}
					/>
				)}
			</div>
		</div>
	);
}

export default FeedUploadModal;
