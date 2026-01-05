import { useEffect, useRef, useState } from "react";
import "./KakaoLocationPicker.css";

const KakaoLocationPicker = ({ onSelect, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const placesRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    const init = () => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;

      const container = document.getElementById("kakao-map");
      if (!container) return;

      const center = new window.kakao.maps.LatLng(37.5665, 126.9780);

      mapRef.current = new window.kakao.maps.Map(container, {
        center: center,
        level: 3,
      });

      markerRef.current = new window.kakao.maps.Marker({
        position: center,
      });
      markerRef.current.setMap(mapRef.current);

      placesRef.current = new window.kakao.maps.services.Places();
    };

    const wait = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) init();
      else setTimeout(wait, 50);
    };

    wait();
  }, []);

  const handleSearch = () => {
    if (!placesRef.current) return;

    const q = (keyword || "").trim();
    if (q.length === 0) {
      setResultList([]);
      return;
    }

    placesRef.current.keywordSearch(q, (data, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        setResultList([]);
        return;
      }
      setResultList(data);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handlePickPlace = (p) => {
    if (!mapRef.current || !markerRef.current) return;

    const lng = Number(p.x);
    const lat = Number(p.y);
    const pos = new window.kakao.maps.LatLng(lat, lng);

    mapRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);

    if (onSelect) {
      onSelect({
        latitude: lat,
        longitude: lng,
        placeName: p.place_name || "",
        kakaoPlaceId: p.id || "",
        addressName: p.address_name || "",
        roadAddress: p.road_address_name || "",
      });
    }
  };

  return (
    <div className="kakao-loc-overlay" onClick={onClose}>
      <div className="kakao-loc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kakao-loc-header">
          <div className="kakao-loc-title">위치 선택</div>
          <button type="button" className="kakao-loc-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="kakao-loc-search">
          <input
            className="kakao-loc-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="장소 검색 (예: 강남역 스타벅스)"
          />
          <button type="button" className="kakao-loc-btn" onClick={handleSearch}>
            검색
          </button>
        </div>

        <div className="kakao-loc-body">
          <div id="kakao-map" className="kakao-loc-map" />

          <div className="kakao-loc-results">
            {resultList.length === 0 ? (
              keyword.trim().length === 0 ? (
                <div className="kakao-loc-empty">장소를 검색해보세요.</div>
              ) : (
                <div className="kakao-loc-empty">검색 결과가 없습니다.</div>
              )
            ) : (
              resultList.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className="kakao-loc-item"
                  onClick={() => handlePickPlace(p)}
                >
                  <div className="kakao-loc-name">{p.place_name}</div>
                  <div className="kakao-loc-addr">
                    {p.road_address_name ? p.road_address_name : p.address_name}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="kakao-loc-footer">
          <button type="button" className="kakao-loc-cancel" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default KakaoLocationPicker;
