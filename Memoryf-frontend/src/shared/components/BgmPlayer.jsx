import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import YouTube from "react-youtube";
import "../css/BgmPlayer.css";

function BgmPlayer() {
  const [playing, setPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bgmList, setBgmList] = useState([]);
  const [currentBgm, setCurrentBgm] = useState({ 
    title: "Select Music", 
    artist: "Click to play",
    videoId: null,
    thumbnail: null,
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  const handleLpClick = () => {
    setShowModal(true);
  };

  const loadBgmList = () => {
    // 현재 로그인한 사용자의 BGM 목록을 로드 (임시로 memberNo=1 사용하거나 localStorage 키 확인 필요)
    // BgmStorePage에서 저장할 때 'purchasedMelonBgm_${memberNo}' 형식을 사용하므로 여기서도 맞춰야 함.
    // 하지만 BgmPlayer는 전역 컴포넌트라 memberNo를 알기 어려울 수 있음.
    // 일단 간단하게 모든 키를 검색하거나, 가장 최근에 저장된 키를 사용하는 방식이 필요할 수 있음.
    // 여기서는 BgmStorePage와 동일하게 memberNo=1을 가정하거나, 토큰에서 가져오는 로직이 필요함.
    
    // 임시: localStorage의 모든 purchasedMelonBgm_* 키를 찾아서 합치거나, 
    // 현재 로그인된 사용자의 것만 가져와야 함.
    // 여기서는 간단히 'purchasedMelonBgm_1'을 시도하고 없으면 기존 'purchasedMelonBgm'을 시도.
    
    const memberNo = localStorage.getItem('memberNo') || 1;
    let stored = localStorage.getItem(`purchasedMelonBgm_${memberNo}`);
    
    if (!stored) {
        stored = localStorage.getItem('purchasedMelonBgm');
    }

    const applyCache = (list) => {
      let cache = {};
      try {
        cache = JSON.parse(localStorage.getItem('melonThumbCache') || '{}');
      } catch (e) {
        console.error('썸네일 캐시 파싱 실패', e);
      }

      return list.map((item) => {
        const key = `${item.artist}-${item.bgmTitle}`;
        if (!item.videoId && cache[key]?.videoId) {
          return {
            ...item,
            videoId: cache[key].videoId,
            thumbnail: item.thumbnail || cache[key].thumbnail, // 멜론 썸네일이 이미 있으면 유지
          };
        }
        return item;
      });
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBgmList(applyCache(parsed));
      } catch (e) {
        console.error("Failed to parse purchased BGM", e);
        setBgmList([]);
      }
    } else {
      setBgmList([]);
    }
  };

  useEffect(() => {
    if (showModal) {
      loadBgmList();
    }
  }, [showModal]);

  // body 스크롤 잠금으로 배경 흔들림/깜빡임 방지
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const originalOverflow = document.body.style.overflow;
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showModal]);

  useEffect(() => {
    const stored = localStorage.getItem('currentBgm');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentBgm(parsed);
      } catch (e) {
        console.error('Failed to parse currentBgm', e);
      }
    }
  }, []);

  // localStorage에서 bgm 변경 이벤트 감지
  useEffect(() => {
    const handleBgmChange = (event) => {
      const bgmData = event.detail;
      setCurrentBgm({
        title: bgmData.title,
        artist: bgmData.artist,
        videoId: bgmData.videoId,
        thumbnail: bgmData.thumbnail,
      });
      localStorage.setItem('currentBgm', JSON.stringify(bgmData));
      setPlaying(true);
      setCurrentTime(0);
    };

    window.addEventListener('bgmChanged', handleBgmChange);

    return () => {
      window.removeEventListener('bgmChanged', handleBgmChange);
    };
  }, []);

  const selectBgm = (bgm) => {
    // bgm 객체에 videoId가 있는 경우 사용 (없으면 캐시에서 시도)
    let target = bgm;

    if (!bgm.videoId) {
      try {
        const cache = JSON.parse(localStorage.getItem('melonThumbCache') || '{}');
        const key = `${bgm.artist}-${bgm.bgmTitle}`;
        if (cache[key]?.videoId) {
          target = {
            ...bgm,
            videoId: cache[key].videoId,
            thumbnail: bgm.thumbnail || cache[key].thumbnail,
          };
        }
      } catch (e) {
        console.error('썸네일 캐시 파싱 실패', e);
      }
    }

    if (!target.videoId) {
      alert("이 BGM은 아직 YouTube와 연결되지 않았습니다.");
      return;
    }

    const next = { 
      title: target.bgmTitle, 
      artist: target.artist,
      videoId: target.videoId,
      thumbnail: target.thumbnail,
    };
    setCurrentBgm(next);
    localStorage.setItem('currentBgm', JSON.stringify(next));
    setPlaying(true);
    setShowModal(false);
    setCurrentTime(0);
  };

  const getPlaylistFromStorage = () => {
    const memberNo = localStorage.getItem('memberNo') || 1;
    const stored = localStorage.getItem(`purchasedMelonBgm_${memberNo}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse purchased BGM', e);
      }
    }
    return [];
  };

  const hydrateWithCache = (bgm) => {
    try {
      const cache = JSON.parse(localStorage.getItem('melonThumbCache') || '{}');
      const key = `${bgm.artist}-${bgm.bgmTitle}`;
      if (cache[key]?.videoId && !bgm.videoId) {
        return {
          ...bgm,
          videoId: cache[key].videoId,
          thumbnail: bgm.thumbnail || cache[key].thumbnail,
        };
      }
    } catch (e) {
      console.error('썸네일 캐시 파싱 실패', e);
    }
    return bgm;
  };

  const playNext = () => {
    const list = getPlaylistFromStorage();
    if (!list.length) {
      alert('내 플레이리스트에 곡이 없습니다.');
      return;
    }

    const currentKey = `${currentBgm.artist}-${currentBgm.title}`;
    const idx = list.findIndex((item) => (item.key || `${item.artist}-${item.bgmTitle}`) === currentKey);
    const nextIdx = idx === -1 ? 0 : (idx + 1) % list.length;
    const candidate = hydrateWithCache(list[nextIdx]);

    if (!candidate.videoId) {
      alert('다음 곡에 영상 정보가 없습니다. 다른 곡을 선택하세요.');
      return;
    }

    selectBgm(candidate);
  };

  // YouTube 플레이어 이벤트 핸들러
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    const dur = event.target.getDuration();
    if (dur && !Number.isNaN(dur)) {
      setDuration(dur);
    }
    if (playing) {
      event.target.playVideo();
    }
  };

  const onPlayerStateChange = (event) => {
    // YouTube 플레이어 상태: 1 = 재생 중, 2 = 일시정지
    if (event.data === 1) {
      setPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setPlaying(false);
    }
  };

  // 재생 중 진행률 갱신
  useEffect(() => {
    let timer = null;
    if (playing && playerRef.current && currentBgm.videoId) {
      timer = setInterval(() => {
        const ct = playerRef.current.getCurrentTime?.() || 0;
        const dur = playerRef.current.getDuration?.() || duration;
        setCurrentTime(ct);
        if (dur && !Number.isNaN(dur)) {
          setDuration(dur);
        }
      }, 500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing, currentBgm.videoId, duration]);

  useEffect(() => {
    // 트랙 변경 시 진행도 초기화
    setCurrentTime(0);
  }, [currentBgm.videoId]);

  const progressPercent = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!currentBgm.videoId) {
      setShowModal(true);
      return;
    }

    if (playerRef.current) {
      if (playing) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
    setPlaying(!playing);
  };

  // YouTube 플레이어 옵션
  const youtubeOpts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
    },
  };

  return (
    <>
      {/* YouTube Player (숨김) */}
      {currentBgm.videoId && (
        <div style={{ display: 'none' }}>
          <YouTube
            videoId={currentBgm.videoId}
            opts={youtubeOpts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
          />
        </div>
      )}

      <div className="bgm-player">
        <div className="disc-wrapper">
          <div
            className={`lp ${playing ? "playing" : ""}`}
            style={{ ['--progress']: `${progressPercent}%` }}
            onClick={handleLpClick}
          >
            <div className="lp-disc with-thumb">
              {currentBgm.thumbnail && (
                <img src={currentBgm.thumbnail} alt={currentBgm.title} className="album-thumb" />
              )}
              <div className="lp-center" />
            </div>
            <svg className="progress-ring" viewBox="0 0 120 120">
              <circle className="progress-track" cx="60" cy="60" r="54" />
              <circle
                className="progress-value"
                cx="60"
                cy="60"
                r="54"
                style={{ strokeDashoffset: 339.292 - (339.292 * progressPercent) / 100 }}
              />
            </svg>
            <div className="time-overlay">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="bgm-info" onClick={handleLpClick} style={{ cursor: 'pointer' }}>
          <div className="status">{playing ? "Now Playing" : "Paused"}</div>
          <div className="title">{currentBgm.title}</div>
          <div className="artist">{currentBgm.artist}</div>
        </div>

        <div className="controls-row">
          <button className="control-btn" onClick={togglePlay}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button className="control-btn" onClick={playNext}>Next</button>
          <button className="control-btn" onClick={handleLpClick}>Playlist</button>
        </div>
      </div>

      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="bgm-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="bgm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>My Playlist</h3>
            <div className="bgm-list-modal">
              {bgmList.length === 0 ? (
                <p className="empty-msg">구매한 BGM이 없습니다.</p>
              ) : (
                bgmList.map((bgm) => (
                  <div key={bgm.bgmNo} className="bgm-item-modal" onClick={() => selectBgm(bgm)}>
                    <span className="bgm-title">{bgm.bgmTitle}</span>
                    <span className="bgm-artist">{bgm.artist}</span>
                  </div>
                ))
              )}
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default BgmPlayer;
