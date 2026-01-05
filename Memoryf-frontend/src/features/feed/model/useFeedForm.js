/**
 * useFeedForm - 피드 폼 데이터 관리 Hook
 * 
 * 텍스트, 태그, 위치 등 폼 데이터만 담당 (SRP)
 */
import { useState, useCallback } from 'react';

const extractTags = (text) => {
	if (!text) return '';
	const matches = String(text).match(/#[\p{L}\p{N}_]+/gu) || [];
	const normalized = matches.map((m) => m.slice(1).trim()).filter(Boolean);
	const unique = Array.from(new Set(normalized));
	return unique.join(',');
};

export function useFeedForm(initialData = {}) {
	const [content, setContent] = useState(initialData.content || '');
	const [tag, setTag] = useState(initialData.tag || '');
	const [latitude, setLatitude] = useState(initialData.latitude || '');
	const [longitude, setLongitude] = useState(initialData.longitude || '');
	const [locationName, setLocationName] = useState(initialData.locationName || '');
	const [isLocationOpen, setIsLocationOpen] = useState(false);

	// 위치 선택 핸들러
	const handleSelectLocation = useCallback((loc) => {
		setLatitude(loc.latitude);
		setLongitude(loc.longitude);
		setLocationName(loc.placeName || loc.addressName);
		setIsLocationOpen(false);
	}, []);

	// 위치 초기화
	const clearLocation = useCallback(() => {
		setLatitude('');
		setLongitude('');
		setLocationName('');
	}, []);

	// 폼 초기화
	const resetForm = useCallback(() => {
		setContent('');
		setTag('');
		setLatitude('');
		setLongitude('');
		setLocationName('');
		setIsLocationOpen(false);
	}, []);

	// 폼 데이터 설정 (수정 모드용)
	const setFormData = useCallback((data) => {
		setContent(data.content || '');
		setTag(data.tag || '');
		setLatitude(data.latitude || '');
		setLongitude(data.longitude || '');
		setLocationName(data.locationName || '');
	}, []);

	// 저장용 태그 빌드 (content + tag에서 해시태그 추출)
	const buildTagsForSave = useCallback(() => {
		const merged = `${content || ''} ${tag || ''}`;
		return extractTags(merged);
	}, [content, tag]);

	// 폼 데이터 객체 반환
	const getFormData = useCallback(() => ({
		content,
		tag: buildTagsForSave(),
		latitude,
		longitude,
		locationName,
	}), [content, buildTagsForSave, latitude, longitude, locationName]);

	return {
		// 상태
		content,
		setContent,
		tag,
		setTag,
		latitude,
		longitude,
		locationName,
		isLocationOpen,
		setIsLocationOpen,

		// 액션
		handleSelectLocation,
		clearLocation,
		resetForm,
		setFormData,
		buildTagsForSave,
		getFormData,
	};
}

export default useFeedForm;
