/**
 * useFeedUploadModal - 피드 업로드 모달 통합 Hook
 * 
 * SRP에 따라 분리된 Hook들을 조합하여 모달 로직 제공
 * - useFeedForm: 폼 데이터 관리
 * - useFileHandler: 파일 처리
 * - useFeedMutation: API 호출
 */
import { useEffect, useMemo, useState } from 'react';

import { useFeedForm } from './useFeedForm';
import { useFileHandler } from './useFileHandler';
import { useFeedMutation } from './useFeedMutation';

import { getHomeByMemberNo } from '../../../entities/home';
import { getMemberNoFromToken } from '../../../shared/lib';
import { getAssetUrl } from '../../../shared/api';

export function useFeedUploadModal({ isOpen, mode = 'create', initialFeed = null, onClose, onSuccess }) {
	const isEditMode = mode === 'edit';

	// Step 관리 (1: 파일 선택, 2: 내용 입력)
	const [step, setStep] = useState(isEditMode ? 2 : 1);
	
	// 사용자 프로필 정보
	const [userProfile, setUserProfile] = useState({ memberNick: '사용자', profileChangeName: null });

	// 현재 회원 번호
	const currentMemberNo = useMemo(() => getMemberNoFromToken(), []);

	// 분리된 Hook들 사용
	const feedForm = useFeedForm();
	const fileHandler = useFileHandler();
	const feedMutation = useFeedMutation({
		onSuccess: () => {
			handleClose();
			onSuccess?.();
		},
	});

	// 사용자 프로필 정보 가져오기
	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!currentMemberNo) return;
			try {
				const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
				if (!homeData) return;
				setUserProfile({
					memberNick: homeData.memberNick || '사용자',
					profileChangeName: homeData.profileChangeName,
				});
			} catch (error) {
				console.error('프로필 조회 실패:', error);
			}
		};

		if (isOpen) fetchUserProfile();
	}, [isOpen, currentMemberNo]);

	// 수정 모드일 때 기존 피드 데이터 불러오기 / 생성 모드 초기화
	useEffect(() => {
		if (!isOpen) return;

		if (isEditMode && initialFeed) {
			feedForm.setFormData({
				content: initialFeed.content,
				tag: initialFeed.tag,
				latitude: initialFeed.latitude,
				longitude: initialFeed.longitude,
				locationName: initialFeed.locationName,
			});

			if (initialFeed.feedFiles && initialFeed.feedFiles.length > 0) {
				const imageUrls = initialFeed.feedFiles.map((file) => getAssetUrl(file.filePath) || file.filePath);
				fileHandler.setExistingPreviews(imageUrls);
				setStep(2);
			}
			return;
		}

		// 새로 작성 모드 - 초기화
		setStep(1);
		feedForm.resetForm();
		fileHandler.resetFiles();
	}, [isOpen, isEditMode, initialFeed]);

	// 파일 선택 시 다음 단계로
	const handleFileSelect = (e) => {
		const result = fileHandler.handleFileSelect(e);
		if (result.success) {
			setStep(2);
		}
	};

	// 모달 닫기
	const handleClose = () => {
		setStep(isEditMode ? 2 : 1);
		feedForm.resetForm();
		if (!isEditMode) fileHandler.resetFiles();
		onClose?.();
	};

	// 제출
	const handleSubmit = async () => {
		const formData = feedForm.getFormData();

		if (isEditMode) {
			const result = await feedMutation.updateFeed({
				feedNo: initialFeed.feedNo,
				formData,
			});
			
			if (result.success) {
				alert('피드가 성공적으로 수정되었습니다.');
			} else {
				alert(result.error?.message || '피드 수정에 실패했습니다.');
			}
		} else {
			if (fileHandler.selectedFiles.length === 0) {
				alert('최소 1개 이상의 이미지를 선택해주세요.');
				return;
			}

			const result = await feedMutation.createFeed({
				files: fileHandler.selectedFiles,
				formData,
			});

			if (result.success) {
				alert('피드가 성공적으로 업로드되었습니다.');
			} else {
				alert(result.error?.message || '피드 업로드에 실패했습니다.');
			}
		}
	};

	return {
		// 모드
		isEditMode,
		
		// Step 관리
		step,
		setStep,

		// 파일 관련 (useFileHandler)
		selectedFiles: fileHandler.selectedFiles,
		previews: fileHandler.previews,
		currentImageIndex: fileHandler.currentIndex,
		setCurrentImageIndex: fileHandler.setCurrentIndex,
		fileInputRef: fileHandler.fileInputRef,
		handleFileSelect,
		handleSelectClick: fileHandler.handleSelectClick,
		handleRemoveFile: fileHandler.handleRemoveFile,
		handlePrevImage: fileHandler.handlePrevImage,
		handleNextImage: fileHandler.handleNextImage,

		// 폼 관련 (useFeedForm)
		content: feedForm.content,
		setContent: feedForm.setContent,
		tag: feedForm.tag,
		setTag: feedForm.setTag,
		latitude: feedForm.latitude,
		longitude: feedForm.longitude,
		locationName: feedForm.locationName,
		isLocationOpen: feedForm.isLocationOpen,
		setIsLocationOpen: feedForm.setIsLocationOpen,
		handleSelectLocation: feedForm.handleSelectLocation,

		// 업로드 상태 (useFeedMutation)
		isUploading: feedMutation.isLoading,
		
		// 사용자 프로필
		userProfile,

		// 액션
		handleClose,
		handleSubmit,
	};
}

export default useFeedUploadModal;
