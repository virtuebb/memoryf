import { useState, useEffect } from 'react';
import { fetchMemberPoint } from '../api/paymentApi';
import { fetchMelonChart } from '../api/bgmApi';
import { searchYouTubeMusic } from '../../../utils/youtubeApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import './BgmStorePage.css';

const BgmStorePage = () => {
  const [allBgmList, setAllBgmList] = useState([]); // 멜론 TOP 100을 전체 BGM으로 사용
  const [purchasedBgmList, setPurchasedBgmList] = useState([]); // 내 플레이리스트 (구매 완료)
  const [currentPoint, setCurrentPoint] = useState(0);
  const [activeTab, setActiveTab] = useState('store'); // 'store' or 'mylist'
  const [isLoading, setIsLoading] = useState(false);
  const [thumbCache, setThumbCache] = useState({});
  const navigate = useNavigate();

  // 로그인 정보와 일관된 회원 번호 사용 (결제 내역 병합 시 키 불일치 방지)
  const tokenMemberNo = getMemberNoFromToken();
  const memberNo = tokenMemberNo || localStorage.getItem('memberNo');

  const getThumbCache = () => {
    try {
      return JSON.parse(localStorage.getItem('melonThumbCache') || '{}');
    } catch (e) {
      console.error('썸네일 캐시 파싱 실패', e);
      return {};
    }
  };

  const saveThumbCache = (cache) => {
    localStorage.setItem('melonThumbCache', JSON.stringify(cache));
  };

  const resolveVideoInfo = async (bgm) => {
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
        thumbnail: bgm.thumbnail || res.thumbnail, // 멜론 썸네일 우선 유지
      };
      cache = { ...cache, [key]: payload };
      saveThumbCache(cache);
      setThumbCache(cache);
      return payload;
    }

    return null;
  };

  useEffect(() => {
    loadMelonChart();
    loadThumbCache();
    if (!memberNo) {
      console.warn('회원 정보를 찾을 수 없어 결제/구매 데이터를 불러오지 않습니다.');
      return;
    }

    loadPoints();
    loadPurchasedFromStorage();
  }, [memberNo]);

  // 포인트 조회
  const loadPoints = async () => {
    if (!memberNo) return;
    try {
      const pointResponse = await fetchMemberPoint(memberNo);
      if (pointResponse.success) {
        setCurrentPoint(pointResponse.point);
      }
    } catch (error) {
      console.error('포인트 조회 실패:', error);
    }
  };

  // 멜론 차트 로드 (TOP 100을 전체 BGM으로 사용)
  const loadMelonChart = async () => {
    setIsLoading(true);
    try {
      const response = await fetchMelonChart();
      if (response.success && Array.isArray(response.data)) {
        const chart = response.data
          .slice(0, 100)
          .map((item) => ({
            // 멜론 차트는 고유 ID가 없으므로 artist-title 조합으로 키를 만든다
            key: `${item.artist}-${item.title}`,
            bgmNo: item.rank, // 표시용
            bgmTitle: item.title,
            artist: item.artist,
            price: 500, // 기본 가격 정책
            rank: item.rank,
            thumbnail: item.thumbnail || null,
            videoId: null,
          }));
        setAllBgmList(chart);
        enrichThumbnails(chart);
      }
    } catch (error) {
      console.error('멜론 차트 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 썸네일 캐시 로드
  const loadThumbCache = () => {
    const cached = getThumbCache();
    setThumbCache(cached);
  };

  // 썸네일/비디오ID 채우기 (YouTube 검색)
  const enrichThumbnails = async (list) => {
    let cache = { ...getThumbCache(), ...thumbCache };

    // 이미 캐시된 것 반영
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

    // 캐시에 없는 것만 순차 검색 (과도한 쿼리 방지)
    let quotaExceeded = false;

    for (const item of list) {
      if (quotaExceeded) break;

      const key = `${item.artist}-${item.bgmTitle}`;
      // 이미 썸네일이 있거나(멜론 크롤링), 캐시에 있다면 스킵
      if (item.thumbnail || cache[key]) continue;

      try {
        const res = await searchYouTubeMusic(item.artist, item.bgmTitle);
        if (res.success) {
          cache[key] = { thumbnail: item.thumbnail || res.thumbnail, videoId: res.videoId };
          saveThumbCache(cache);
          setThumbCache(cache);
          working = applyCache(working, cache);
          setAllBgmList(working);
        } else {
          // 403 Forbidden (Quota Exceeded) 발생 시 반복 중단
          if (res.error && res.error.response && res.error.response.status === 403) {
            console.warn("YouTube API Quota Exceeded. Stopping background search.");
            quotaExceeded = true;
          }
        }
      } catch (e) {
        console.error('썸네일 로드 실패', e);
      }
    }
  };

  // 로컬 스토리지에서 구매 목록 로드
  const loadPurchasedFromStorage = () => {
    if (!memberNo) return;
    const stored = localStorage.getItem(`purchasedMelonBgm_${memberNo}`);
    if (stored) {
      try {
        setPurchasedBgmList(JSON.parse(stored));
      } catch (e) {
        console.error('구매 목록 파싱 실패', e);
      }
    }
  };

  // BGM 구매
  const handlePurchase = async (bgm) => {
    if (!memberNo) {
      alert('로그인 후 BGM을 구매할 수 있습니다.');
      return;
    }

    if (currentPoint < bgm.price) {
      const goToCharge = window.confirm('포인트가 부족합니다. 충전하시겠습니까?');
      if (goToCharge) {
        navigate('/payment/charge');
      }
      return;
    }

    const confirmPurchase = window.confirm(
      `"${bgm.bgmTitle}"을(를) ${bgm.price.toLocaleString()}P에 구매하시겠습니까?`
    );

    if (!confirmPurchase) return;

    try {
      // YouTube 검색을 통해 videoId와 썸네일 확보
      let videoId = null;
      let thumbnail = bgm.thumbnail;

      // 먼저 캐시 확인 후 필요 시 검색 (검색 실패 시에도 구매는 진행)
      const resolved = await resolveVideoInfo(bgm);
      if (resolved) {
        videoId = resolved.videoId;
        if (!thumbnail) {
          thumbnail = resolved.thumbnail;
        }
      }

      const purchasedItem = {
        ...bgm,
        key: bgm.key || `${bgm.artist}-${bgm.bgmTitle}`,
        videoId: videoId,
        thumbnail: thumbnail,
      };

      const updated = [...purchasedBgmList.filter((item) => (item.key || `${item.artist}-${item.bgmTitle}`) !== purchasedItem.key), purchasedItem];
      setPurchasedBgmList(updated);
      localStorage.setItem(`purchasedMelonBgm_${memberNo}`, JSON.stringify(updated));

      // 포인트 차감 (UI용, 서버 연동 시 purchase API로 대체 가능)
      setCurrentPoint((prev) => prev - bgm.price);

      // 결제 내역 저장 (로컬) - settings 결제내역에서 병합 표시용
      const historyItem = {
        description: `${purchasedItem.bgmTitle} - ${purchasedItem.artist}`,
        amount: purchasedItem.price,
        type: 'USE',
        date: new Date().toISOString(),
      };
      const localHistory = JSON.parse(localStorage.getItem(`localPaymentHistory_${memberNo}`) || '[]');
      localHistory.push(historyItem);
      localStorage.setItem(`localPaymentHistory_${memberNo}`, JSON.stringify(localHistory));

      alert('BGM을 구매했습니다! 내 플레이리스트에서 재생하세요.');
    } catch (error) {
      console.error('BGM 구매 실패:', error);
      alert('BGM 구매 중 오류가 발생했습니다.');
    }
  };

  // 구매 여부 확인 (키 기반)
  const isPurchased = (bgm) => {
    const key = bgm.key || `${bgm.artist}-${bgm.bgmTitle}`;
    return purchasedBgmList.some((item) => (item.key || `${item.artist}-${item.bgmTitle}`) === key);
  };

  // 내 플레이리스트 곡 재생
  const playFromMyList = async (bgm) => {
    let targetBgm = bgm;

    if (!bgm.videoId) {
      const resolved = await resolveVideoInfo(bgm);
      if (!resolved) {
        alert('영상 정보를 찾지 못했습니다. 잠시 후 다시 시도하거나 다른 곡을 선택해주세요.');
        return;
      }

      targetBgm = {
        ...bgm,
        ...resolved,
        thumbnail: bgm.thumbnail || resolved.thumbnail, // 멜론 썸네일 유지
      };

      const updated = purchasedBgmList.map((item) => {
        const key = item.key || `${item.artist}-${item.bgmTitle}`;
        const targetKey = bgm.key || `${bgm.artist}-${bgm.bgmTitle}`;
        return key === targetKey ? targetBgm : item;
      });

      setPurchasedBgmList(updated);
      localStorage.setItem(`purchasedMelonBgm_${memberNo}`, JSON.stringify(updated));
    }

    const bgmData = {
      title: targetBgm.bgmTitle,
      artist: targetBgm.artist,
      videoId: targetBgm.videoId,
      thumbnail: targetBgm.thumbnail,
    };

    localStorage.setItem('currentBgm', JSON.stringify(bgmData));
    window.dispatchEvent(new CustomEvent('bgmChanged', { detail: bgmData }));
  };

  return (
    <div className="bgm-store-page">
      <div className="bgm-store-container">
        {/* 헤더 */}
        <div className="store-header">
          <h1 className="store-title">BGM Store</h1>
          <div className="header-info">
            <div className="point-display">
              <span className="point-label">보유 포인트</span>
              <span className="point-value">{currentPoint.toLocaleString()}P</span>
            </div>
            <button className="charge-link-button" onClick={() => navigate('/payment/charge')}>
              포인트 충전
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="tab-menu">
          <button
            className={`tab-button ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            멜론 차트 TOP 100
          </button>
          <button
            className={`tab-button ${activeTab === 'mylist' ? 'active' : ''}`}
            onClick={() => setActiveTab('mylist')}
          >
            내 플레이리스트 ({purchasedBgmList.length})
          </button>
        </div>

        {/* BGM 목록 */}
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <div className="bgm-list">
            {/* 전체 BGM 탭 */}
            {activeTab === 'store' &&
              allBgmList.map((bgm) => (
                <div key={bgm.bgmNo} className="bgm-card">
                  <div className="bgm-info">
                    <div className="bgm-icon">
                      {bgm.thumbnail ? (
                        <img src={bgm.thumbnail} alt={bgm.bgmTitle} />
                      ) : (
                        '🎵'
                      )}
                    </div>
                    <div className="bgm-details">
                      <h3 className="bgm-title">{bgm.bgmTitle}</h3>
                      <p className="bgm-artist">{bgm.artist}</p>
                    </div>
                  </div>
                  <div className="bgm-actions">
                    <span className="bgm-price">{bgm.price.toLocaleString()}P</span>
                    {isPurchased(bgm) ? (
                      <button className="purchased-button" disabled>
                        구매완료
                      </button>
                    ) : (
                      <button className="purchase-button" onClick={() => handlePurchase(bgm)}>
                        구매하기
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {activeTab === 'mylist' &&
              (purchasedBgmList.length > 0 ? (
                purchasedBgmList.map((bgm) => (
                  <div key={bgm.bgmNo} className="bgm-card purchased">
                    <div className="bgm-info">
                      <div className="bgm-icon">
                        {bgm.thumbnail ? (
                          <img src={bgm.thumbnail} alt={bgm.bgmTitle} />
                        ) : '🎵'}
                      </div>
                      <div className="bgm-details">
                        <h3 className="bgm-title">{bgm.bgmTitle}</h3>
                        <p className="bgm-artist">{bgm.artist}</p>
                      </div>
                    </div>
                    <div className="bgm-actions">
                      <button className="play-button" onClick={() => playFromMyList(bgm)}>
                        재생
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-list">
                  <p>구매한 BGM이 없습니다.</p>
                  <button onClick={() => setActiveTab('store')}>BGM 둘러보기</button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BgmStorePage;
