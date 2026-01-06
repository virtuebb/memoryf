import { useCallback, useState } from "react";

import { fetchMelonChart, fetchMemberPoint, fetchPurchasedBgmList } from "../api";
import { getMemberNoFromToken } from "../../../shared/lib";

/**
 * BGM 리스트 관리 Hook
 * - 멜론 차트 조회
 * - 구매 목록 조회
 * - 포인트 조회
 */
export const useBgmList = ({ enrichThumbnails } = {}) => {
	const [allBgmList, setAllBgmList] = useState([]);
	const [purchasedBgmList, setPurchasedBgmList] = useState([]);
	const [currentPoint, setCurrentPoint] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const tokenMemberNo = getMemberNoFromToken();
	const memberNo = tokenMemberNo || localStorage.getItem("memberNo");

	/**
	 * 멜론 차트 TOP 100 로드
	 */
	const loadMelonChart = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetchMelonChart();
			if (response.success && Array.isArray(response.data)) {
				const chart = response.data.slice(0, 100).map((item) => ({
					key: `${item.artist}-${item.title}`,
					bgmNo: item.rank,
					bgmTitle: item.title,
					artist: item.artist,
					price: 500,
					rank: item.rank,
					thumbnail: item.thumbnail || null,
					videoId: null,
				}));
				setAllBgmList(chart);
				
				if (enrichThumbnails) {
					enrichThumbnails(chart, setAllBgmList);
				}
			}
		} catch (error) {
			console.error("멜론 차트 로드 실패:", error);
		} finally {
			setIsLoading(false);
		}
	}, [enrichThumbnails]);

	/**
	 * 회원 포인트 조회
	 */
	const loadPoints = useCallback(async () => {
		if (!memberNo) return;
		try {
			const pointResponse = await fetchMemberPoint(memberNo);
			if (pointResponse.success) {
				setCurrentPoint(pointResponse.point);
			}
		} catch (error) {
			console.error("포인트 조회 실패:", error);
		}
	}, [memberNo]);

	/**
	 * 구매한 BGM 목록 조회 (서버 + localStorage 병합)
	 */
	const loadPurchasedList = useCallback(async () => {
		if (!memberNo) return;

		try {
			const response = await fetchPurchasedBgmList(memberNo);
			if (response.success) {
				const serverList = response.data.map((item) => ({
					...item,
					key: `${item.artist}-${item.bgmTitle}`,
					videoId: item.videoId || null,
					thumbnail: item.thumbnail || null,
				}));

				setPurchasedBgmList(serverList);

				// localStorage와 병합
				const stored = localStorage.getItem(`purchasedMelonBgm_${memberNo}`);
				if (stored) {
					const localList = JSON.parse(stored);
					const merged = serverList.map((serverItem) => {
						const localItem = localList.find(
							(l) => l.key === serverItem.key || (l.artist === serverItem.artist && l.bgmTitle === serverItem.bgmTitle)
						);

						if (localItem) {
							return {
								...serverItem,
								videoId: serverItem.videoId || localItem.videoId,
								thumbnail: serverItem.thumbnail || localItem.thumbnail,
							};
						}
						return serverItem;
					});
					setPurchasedBgmList(merged);
				}
			}
		} catch (e) {
			console.error("구매 목록 조회 실패", e);
			// 서버 실패 시 localStorage fallback
			const stored = localStorage.getItem(`purchasedMelonBgm_${memberNo}`);
			if (stored) {
				setPurchasedBgmList(JSON.parse(stored));
			}
		}
	}, [memberNo]);

	/**
	 * BGM이 이미 구매되었는지 확인
	 */
	const isPurchased = useCallback(
		(bgm) => {
			const key = bgm.key || `${bgm.artist}-${bgm.bgmTitle}`;
			return purchasedBgmList.some((item) => (item.key || `${item.artist}-${item.bgmTitle}`) === key);
		},
		[purchasedBgmList]
	);

	return {
		memberNo,
		allBgmList,
		setAllBgmList,
		purchasedBgmList,
		setPurchasedBgmList,
		currentPoint,
		setCurrentPoint,
		isLoading,
		loadMelonChart,
		loadPoints,
		loadPurchasedList,
		isPurchased,
	};
};
