import { useCallback, useRef, useState } from "react";

import { searchYouTubeMusic } from "../../../shared/lib";

/**
 * BGM 썸네일 캐시 관리 Hook
 * - localStorage 기반 썸네일/videoId 캐싱
 * - YouTube API 호출 최소화
 */
export const useBgmCache = () => {
	const [thumbCache, setThumbCache] = useState({});
	
	// useRef로 캐시 참조 유지 (함수 재생성 방지)
	const thumbCacheRef = useRef(thumbCache);
	thumbCacheRef.current = thumbCache;

	const getThumbCache = useCallback(() => {
		try {
			return JSON.parse(localStorage.getItem("melonThumbCache") || "{}");
		} catch (e) {
			console.error("썸네일 캐시 파싱 실패", e);
			return {};
		}
	}, []);

	const saveThumbCache = useCallback((cache) => {
		localStorage.setItem("melonThumbCache", JSON.stringify(cache));
	}, []);

	const loadThumbCache = useCallback(() => {
		const cached = getThumbCache();
		setThumbCache(cached);
	}, [getThumbCache]);

	/**
	 * BGM의 videoId와 thumbnail 정보를 캐시에서 조회하거나 YouTube API로 가져옴
	 */
	const resolveVideoInfo = useCallback(
		async (bgm) => {
			const key = `${bgm.artist}-${bgm.bgmTitle}`;
			let cache = getThumbCache();
			const cached = cache[key];

			if (cached?.videoId) {
				return {
					videoId: cached.videoId,
					thumbnail: bgm.thumbnail || cached.thumbnail,
				};
			}

			const res = await searchYouTubeMusic(bgm.artist, bgm.bgmTitle);
			if (res.success) {
				const payload = {
					videoId: res.videoId,
					thumbnail: bgm.thumbnail || res.thumbnail,
				};
				cache = { ...cache, [key]: payload };
				saveThumbCache(cache);
				setThumbCache(cache);
				return payload;
			}

			return null;
		},
		[getThumbCache, saveThumbCache]
	);

	/**
	 * BGM 리스트에 썸네일 정보를 enrichment
	 * - useRef를 사용하여 함수 재생성 방지
	 */
	const enrichThumbnails = useCallback(
		async (list, setAllBgmList) => {
			// useRef를 통해 최신 캐시 접근 (의존성 배열에 포함하지 않음)
			let cache = { ...getThumbCache(), ...thumbCacheRef.current };

			const applyCache = (items, cacheMap) =>
				items.map((item) => {
					const key = `${item.artist}-${item.bgmTitle}`;
					if (cacheMap[key]) {
						return {
							...item,
							thumbnail: item.thumbnail || cacheMap[key].thumbnail,
							videoId: cacheMap[key].videoId,
						};
					}
					return item;
				});

			let working = applyCache(list, cache);
			setAllBgmList(working);

			let quotaExceeded = false;

			for (const item of list) {
				if (quotaExceeded) break;

				const key = `${item.artist}-${item.bgmTitle}`;
				if (item.thumbnail || cache[key]) continue;

				try {
					const res = await searchYouTubeMusic(item.artist, item.bgmTitle);
					if (res.success) {
						cache[key] = { thumbnail: item.thumbnail || res.thumbnail, videoId: res.videoId };
						saveThumbCache(cache);
						setThumbCache(cache);
						working = applyCache(working, cache);
						setAllBgmList(working);
					} else if (res.error?.response?.status === 403) {
						quotaExceeded = true;
					}
				} catch (e) {
					console.error("썸네일 로드 실패", e);
				}
			}
		},
		[getThumbCache, saveThumbCache] // thumbCache 제거 - useRef 사용
	);

	return {
		thumbCache,
		loadThumbCache,
		resolveVideoInfo,
		enrichThumbnails,
	};
};
