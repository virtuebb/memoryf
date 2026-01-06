import { useEffect, useRef, useState } from "react";

import { useBgmCache } from "./useBgmCache";
import { useBgmList } from "./useBgmList";
import { useBgmPurchase } from "./useBgmPurchase";

/**
 * BGM Store 통합 Hook
 * - 캐시, 리스트, 구매 로직을 조합하여 제공
 * 
 * @param {Object} options
 * @param {Function} options.navigate - react-router navigate 함수
 */
export const useBgmStore = ({ navigate } = {}) => {
	const [activeTab, setActiveTab] = useState("store");
	
	// 초기 로드 완료 여부 (무한 루프 방지)
	const isInitializedRef = useRef(false);

	// 캐시 관련 Hook
	const { loadThumbCache, resolveVideoInfo, enrichThumbnails } = useBgmCache();

	// 리스트 관련 Hook
	const {
		memberNo,
		allBgmList,
		purchasedBgmList,
		setPurchasedBgmList,
		currentPoint,
		setCurrentPoint,
		isLoading,
		loadMelonChart,
		loadPoints,
		loadPurchasedList,
		isPurchased,
	} = useBgmList({ enrichThumbnails });

	// 구매 관련 Hook
	const { handlePurchase, playFromMyList } = useBgmPurchase({
		memberNo,
		currentPoint,
		setCurrentPoint,
		purchasedBgmList,
		setPurchasedBgmList,
		resolveVideoInfo,
		navigate,
	});

	// 초기 데이터 로드 (한 번만 실행)
	useEffect(() => {
		// 이미 초기화되었으면 재실행하지 않음
		if (isInitializedRef.current) return;
		isInitializedRef.current = true;

		loadMelonChart();
		loadThumbCache();

		if (!memberNo) {
			console.warn("회원 정보를 찾을 수 없어 결제/구매 데이터를 불러오지 않습니다.");
			return;
		}

		loadPoints();
		loadPurchasedList();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 빈 배열로 초기 로드 한 번만 실행

	// memberNo가 나중에 로드되면 추가 데이터 로드
	useEffect(() => {
		if (memberNo && isInitializedRef.current) {
			loadPoints();
			loadPurchasedList();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memberNo]);

	return {
		memberNo,
		allBgmList,
		purchasedBgmList,
		currentPoint,
		activeTab,
		setActiveTab,
		isLoading,
		handlePurchase,
		isPurchased,
		playFromMyList,
	};
};
