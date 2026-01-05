import { useEffect, useState } from "react";

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

	// 초기 데이터 로드
	useEffect(() => {
		loadMelonChart();
		loadThumbCache();

		if (!memberNo) {
			console.warn("회원 정보를 찾을 수 없어 결제/구매 데이터를 불러오지 않습니다.");
			return;
		}

		loadPoints();
		loadPurchasedList();
	}, [loadMelonChart, loadPoints, loadPurchasedList, loadThumbCache, memberNo]);

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
