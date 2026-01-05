import { useEffect } from "react";

const MapTestWidget = () => {
	useEffect(() => {
		const initMap = () => {
			const container = document.getElementById("map");
			if (!container) return;

			const options = {
				center: new window.kakao.maps.LatLng(37.5665, 126.978),
				level: 3,
			};

			new window.kakao.maps.Map(container, options);
		};

		// SDK가 아직 로드 전이면 잠깐 기다렸다가 다시 체크
		const waitForKakao = () => {
			if (window.kakao && window.kakao.maps) {
				initMap();
			} else {
				setTimeout(waitForKakao, 50);
			}
		};

		waitForKakao();
	}, []);

	return <div id="map" style={{ width: "100%", height: "300px" }} />;
};

export default MapTestWidget;
