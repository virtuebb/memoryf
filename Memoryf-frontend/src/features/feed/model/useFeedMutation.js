/**
 * useFeedMutation - 피드 API 호출 Hook
 * 
 * 피드 생성/수정 API 호출 담당 (SRP)
 */
import { useState, useCallback } from 'react';
import { createFeed } from '../create-feed';
import { updateFeed } from '../update-feed';
import { getMemberNoFromToken } from '../../../shared/lib';

export function useFeedMutation({ onSuccess, onError } = {}) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// 피드 생성
	const createFeedMutation = useCallback(async ({ files, formData }) => {
		const memberNo = getMemberNoFromToken();
		if (!memberNo) {
			const err = new Error('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
			setError(err);
			onError?.(err);
			return { success: false, error: err };
		}

		if (!files || files.length === 0) {
			const err = new Error('최소 1개 이상의 이미지를 선택해주세요.');
			setError(err);
			onError?.(err);
			return { success: false, error: err };
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = new FormData();
			data.append('content', formData.content || '');
			data.append('tag', formData.tag || '');
			if (formData.latitude) data.append('latitude', formData.latitude);
			if (formData.longitude) data.append('longitude', formData.longitude);
			if (formData.locationName) data.append('locationName', formData.locationName);
			data.append('memberNo', memberNo);
			files.forEach((file) => data.append('files', file));

			const response = await createFeed(data);

			if (response?.success) {
				onSuccess?.();
				return { success: true, data: response };
			}

			const err = new Error(response?.message || '피드 업로드에 실패했습니다.');
			setError(err);
			onError?.(err);
			return { success: false, error: err };
		} catch (err) {
			const errorMessage =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				err?.message ||
				'피드 업로드 중 오류가 발생했습니다.';
			const error = new Error(errorMessage);
			setError(error);
			onError?.(error);
			return { success: false, error };
		} finally {
			setIsLoading(false);
		}
	}, [onSuccess, onError]);

	// 피드 수정
	const updateFeedMutation = useCallback(async ({ feedNo, formData }) => {
		if (!feedNo) {
			const err = new Error('피드 번호가 없습니다.');
			setError(err);
			onError?.(err);
			return { success: false, error: err };
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await updateFeed(feedNo, {
				content: formData.content || '',
				tag: formData.tag || '',
				latitude: formData.latitude || '',
				longitude: formData.longitude || '',
				locationName: formData.locationName || '',
			});

			if (response?.success) {
				window.dispatchEvent(new Event('feedChanged'));
				onSuccess?.();
				return { success: true, data: response };
			}

			const err = new Error(response?.message || '피드 수정에 실패했습니다.');
			setError(err);
			onError?.(err);
			return { success: false, error: err };
		} catch (err) {
			const errorMessage =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				err?.message ||
				'피드 수정 중 오류가 발생했습니다.';
			const error = new Error(errorMessage);
			setError(error);
			onError?.(error);
			return { success: false, error };
		} finally {
			setIsLoading(false);
		}
	}, [onSuccess, onError]);

	// 상태 초기화
	const reset = useCallback(() => {
		setIsLoading(false);
		setError(null);
	}, []);

	return {
		isLoading,
		error,
		createFeed: createFeedMutation,
		updateFeed: updateFeedMutation,
		reset,
	};
}

export default useFeedMutation;
