import { useEffect, useRef, useState } from "react";

export function useKakaoMiniMap({ lat, lng, enabledByDefault = false } = {}) {
	const [showMap, setShowMap] = useState(Boolean(enabledByDefault));
	const mapElRef = useRef(null);
	const mapRef = useRef(null);
	const markerRef = useRef(null);

	useEffect(() => {
		if (!showMap) return;

		const latitude = Number(lat);
		const longitude = Number(lng);
		if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
		if (!window.kakao || !window.kakao.maps) return;
		if (!mapElRef.current) return;

		const pos = new window.kakao.maps.LatLng(latitude, longitude);

		if (!mapRef.current) {
			mapRef.current = new window.kakao.maps.Map(mapElRef.current, {
				center: pos,
				level: 4,
			});
			markerRef.current = new window.kakao.maps.Marker({ position: pos });
			markerRef.current.setMap(mapRef.current);
		}

		mapRef.current.setCenter(pos);
		markerRef.current.setPosition(pos);

		setTimeout(() => {
			if (!mapRef.current) return;
			mapRef.current.relayout();
			mapRef.current.setCenter(pos);
		}, 0);
	}, [showMap, lat, lng]);

	useEffect(() => {
		if (!showMap) {
			mapRef.current = null;
			markerRef.current = null;
		}
	}, [showMap]);

	return {
		showMap,
		setShowMap,
		mapElRef,
	};
}
