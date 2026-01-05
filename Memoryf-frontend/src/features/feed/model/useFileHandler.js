/**
 * useFileHandler - 파일 처리 Hook
 * 
 * 이미지/동영상 선택, 미리보기, 유효성 검사 담당 (SRP)
 */
import { useState, useRef, useCallback } from 'react';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function useFileHandler() {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const fileInputRef = useRef(null);

	// 파일 유효성 검사
	const validateFile = useCallback((file) => {
		const isImage = file.type.startsWith('image/');
		const isVideo = file.type.startsWith('video/');
		
		if (!isImage && !isVideo) {
			return { valid: false, error: '이미지 또는 동영상 파일만 업로드 가능합니다.' };
		}
		
		if (file.size > MAX_FILE_SIZE) {
			return { valid: false, error: '파일 크기는 50MB 이하여야 합니다.' };
		}
		
		return { valid: true };
	}, []);

	// 파일 선택 핸들러
	const handleFileSelect = useCallback((e) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return { success: false };

		// 유효성 검사
		const validFiles = [];
		for (const file of files) {
			const validation = validateFile(file);
			if (!validation.valid) {
				alert(validation.error);
				continue;
			}
			validFiles.push(file);
		}

		if (validFiles.length === 0) {
			return { success: false };
		}

		setSelectedFiles(validFiles);

		// 미리보기 생성
		const previewPromises = validFiles.map(
			(file) =>
				new Promise((resolve) => {
					const reader = new FileReader();
					reader.onload = (evt) => resolve(evt.target.result);
					reader.readAsDataURL(file);
				})
		);

		Promise.all(previewPromises).then((previewUrls) => {
			setPreviews(previewUrls);
			setCurrentIndex(0);
		});

		return { success: true, count: validFiles.length };
	}, [validateFile]);

	// 파일 선택 버튼 클릭
	const handleSelectClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	// 특정 파일 제거
	const handleRemoveFile = useCallback((index) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
		setPreviews((prev) => {
			const newPreviews = prev.filter((_, i) => i !== index);
			
			// currentIndex 조정
			setCurrentIndex((currentIdx) => {
				if (currentIdx >= newPreviews.length) {
					return Math.max(0, newPreviews.length - 1);
				}
				return currentIdx;
			});
			
			return newPreviews;
		});
	}, []);

	// 이전 이미지
	const handlePrevImage = useCallback(() => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : previews.length - 1));
	}, [previews.length]);

	// 다음 이미지
	const handleNextImage = useCallback(() => {
		setCurrentIndex((prev) => (prev < previews.length - 1 ? prev + 1 : 0));
	}, [previews.length]);

	// 초기화
	const resetFiles = useCallback(() => {
		setSelectedFiles([]);
		setPreviews([]);
		setCurrentIndex(0);
		if (fileInputRef.current) fileInputRef.current.value = '';
	}, []);

	// 기존 이미지 URL로 미리보기 설정 (수정 모드용)
	const setExistingPreviews = useCallback((imageUrls) => {
		setPreviews(imageUrls);
		setCurrentIndex(0);
	}, []);

	return {
		// 상태
		selectedFiles,
		previews,
		currentIndex,
		setCurrentIndex,
		fileInputRef,
		hasFiles: selectedFiles.length > 0 || previews.length > 0,
		fileCount: selectedFiles.length || previews.length,

		// 액션
		handleFileSelect,
		handleSelectClick,
		handleRemoveFile,
		handlePrevImage,
		handleNextImage,
		resetFiles,
		setExistingPreviews,
	};
}

export default useFileHandler;
