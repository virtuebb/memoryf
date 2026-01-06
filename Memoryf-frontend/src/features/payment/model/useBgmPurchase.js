import { useCallback } from "react";

import { purchaseBgm } from "../api";

/**
 * BGM 구매 및 재생 관련 Hook
 */
export const useBgmPurchase = ({
	memberNo,
	currentPoint,
	setCurrentPoint,
	purchasedBgmList,
	setPurchasedBgmList,
	resolveVideoInfo,
	navigate,
} = {}) => {
	/**
	 * BGM 구매 처리
	 */
	const handlePurchase = useCallback(
		async (bgm) => {
			if (!memberNo) {
				alert("로그인 후 BGM을 구매할 수 있습니다.");
				return;
			}

			if (currentPoint < bgm.price) {
				const goToCharge = window.confirm("포인트가 부족합니다. 충전하시겠습니까?");
				if (goToCharge) {
					navigate?.("/payment/charge");
				}
				return;
			}

			const confirmPurchase = window.confirm(
				`"${bgm.bgmTitle}"을(를) ${bgm.price.toLocaleString()}P에 구매하시겠습니까?`
			);

			if (!confirmPurchase) return;

			try {
				let videoId = null;
				let thumbnail = bgm.thumbnail;

				// YouTube 영상 정보 조회
				if (resolveVideoInfo) {
					const resolved = await resolveVideoInfo(bgm);
					if (resolved) {
						videoId = resolved.videoId;
						if (!thumbnail) {
							thumbnail = resolved.thumbnail;
						}
					}
				}

				const purchaseData = {
					...bgm,
					videoId,
					thumbnail,
				};

				const purchaseResult = await purchaseBgm(memberNo, purchaseData);

				if (!purchaseResult.success) {
					alert(purchaseResult.message || "구매 처리에 실패했습니다.");
					return;
				}

				// 구매 목록 업데이트
				const purchasedItem = {
					...bgm,
					key: bgm.key || `${bgm.artist}-${bgm.bgmTitle}`,
					videoId,
					thumbnail,
				};

				const updated = [
					...purchasedBgmList.filter((item) => (item.key || `${item.artist}-${item.bgmTitle}`) !== purchasedItem.key),
					purchasedItem,
				];
				setPurchasedBgmList(updated);
				localStorage.setItem(`purchasedMelonBgm_${memberNo}`, JSON.stringify(updated));

				// 포인트 업데이트
				if (purchaseResult.currentPoint !== undefined) {
					setCurrentPoint(purchaseResult.currentPoint);
				} else {
					setCurrentPoint((prev) => prev - bgm.price);
				}

				// 구매 내역 로컬 저장
				const historyItem = {
					description: `${purchasedItem.bgmTitle} - ${purchasedItem.artist}`,
					amount: purchasedItem.price,
					type: "USE",
					date: new Date().toISOString(),
				};
				const localHistory = JSON.parse(localStorage.getItem(`localPaymentHistory_${memberNo}`) || "[]");
				localHistory.push(historyItem);
				localStorage.setItem(`localPaymentHistory_${memberNo}`, JSON.stringify(localHistory));

				alert("BGM을 구매했습니다! 내 플레이리스트에서 재생하세요.");
			} catch (error) {
				console.error("BGM 구매 실패:", error);
				const msg = error.response?.data?.message || "BGM 구매 중 오류가 발생했습니다.";
				alert(msg);
			}
		},
		[currentPoint, memberNo, navigate, purchasedBgmList, resolveVideoInfo, setCurrentPoint, setPurchasedBgmList]
	);

	/**
	 * 내 플레이리스트에서 BGM 재생
	 */
	const playFromMyList = useCallback(
		async (bgm) => {
			let targetBgm = bgm;

			if (!bgm.videoId && resolveVideoInfo) {
				const resolved = await resolveVideoInfo(bgm);
				if (!resolved) {
					alert("영상 정보를 찾지 못했습니다. 잠시 후 다시 시도하거나 다른 곡을 선택해주세요.");
					return;
				}

				targetBgm = {
					...bgm,
					...resolved,
					thumbnail: bgm.thumbnail || resolved.thumbnail,
				};

				// 구매 목록에 videoId 업데이트
				const updated = purchasedBgmList.map((item) => {
					const key = item.key || `${item.artist}-${item.bgmTitle}`;
					const targetKey = bgm.key || `${bgm.artist}-${bgm.bgmTitle}`;
					return key === targetKey ? targetBgm : item;
				});

				setPurchasedBgmList(updated);
				localStorage.setItem(`purchasedMelonBgm_${memberNo}`, JSON.stringify(updated));
			}

			// BGM 재생 이벤트 발생
			const bgmData = {
				title: targetBgm.bgmTitle,
				artist: targetBgm.artist,
				videoId: targetBgm.videoId,
				thumbnail: targetBgm.thumbnail,
			};

			localStorage.setItem("currentBgm", JSON.stringify(bgmData));
			window.dispatchEvent(new CustomEvent("bgmChanged", { detail: bgmData }));
		},
		[memberNo, purchasedBgmList, resolveVideoInfo, setPurchasedBgmList]
	);

	return {
		handlePurchase,
		playFromMyList,
	};
};
