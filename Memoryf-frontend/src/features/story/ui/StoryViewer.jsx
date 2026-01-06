import { createPortal } from "react-dom";
import "../css/StoryViewer.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { storyApi } from "../api";
import { getAssetUrl, getProfileImageUrl } from "../../../shared/api";

const StoryViewer = ({ isOpen, onClose, selected }) => {
  if (!isOpen || !selected) return null;

  const owner = selected?.story || selected?.owner;
  const items = selected?.items || [];

  const getLoginMemberNo = () => {
    const storageData = localStorage.getItem("loginMember");
    if (!storageData) return null;
    try {
      const loginMember = JSON.parse(storageData);
      return loginMember?.memberNo;
    } catch (e) {
      return null;
    }
  };

  const loginUserNo = getLoginMemberNo();
  const isOwner = owner && Number(owner.memberNo) === Number(loginUserNo);

  const [activeIndex, setActiveIndex] = useState(0);
  const [tick, setTick] = useState(0);
  // 동영상 재생시간 동기화를 위한 상태
  const [currentDuration, setCurrentDuration] = useState(3000);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const DEFAULT_DURATION_MS = 3000; // 이미지 기본 3초

  const isVideoName = (name) => {
    if (!name) return false;
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(name);
  };

  const active = items[activeIndex];
  // savedName 우선, 없으면 changeName, 마지막으로 originName
  const isCurrentVideo = isVideoName(active?.savedName || active?.changeName || active?.originName);

  const goIndex = useCallback(
    (idx) => {
      if (idx < 0 || idx >= items.length) return;
      setActiveIndex(idx);
      setTick((t) => t + 1);
      setVideoProgress(0);
      setCurrentDuration(DEFAULT_DURATION_MS);
    },
    [items.length]
  );

  useEffect(() => {
    setActiveIndex(0);
    setTick((t) => t + 1);
    setVideoProgress(0);
    setCurrentDuration(DEFAULT_DURATION_MS);
  }, [selected]);

  // 동영상이 아닌 이미지일 때만 자동 전환 타이머 사용
  useEffect(() => {
    if (items.length === 0) return;
    if (isCurrentVideo) return; // 동영상은 onEnded 이벤트로 처리

    const timer = setTimeout(() => {
      if (activeIndex >= items.length - 1) {
        onClose();
      } else {
        goIndex(activeIndex + 1);
      }
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [activeIndex, items.length, onClose, goIndex, isCurrentVideo, currentDuration]);

  // 동영상 메타데이터 로드 시 재생시간 설정
  const handleVideoLoadedMetadata = (e) => {
    const duration = e.target.duration;
    if (duration && !isNaN(duration)) {
      setCurrentDuration(duration * 1000);
    }
  };

  // 동영상 재생 중 프로그레스 업데이트
  const handleVideoTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      setVideoProgress((video.currentTime / video.duration) * 100);
    }
  };

  // 동영상 재생 완료 시 다음으로 이동
  const handleVideoEnded = () => {
    if (activeIndex >= items.length - 1) {
      onClose();
    } else {
      goIndex(activeIndex + 1);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const activeStoryNo = active?._storyNo || owner?.storyNo;

    if (!activeStoryNo) {
      alert("삭제할 스토리를 찾을 수 없습니다.");
      return;
    }

    if (!window.confirm("이 스토리를 삭제하시겠습니까? (복구할 수 없습니다.)")) return;

    try {
      await storyApi.deleteStory(activeStoryNo);
      alert("삭제되었습니다.");
      window.dispatchEvent(new Event("storyChanged"));
      onClose();
    } catch (err) {
      console.error("삭제 중 오류:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const getItemSrc = (it) => {
    // savedName 또는 changeName 지원 (백엔드는 savedName 사용)
    const fileName = it?.savedName || it?.changeName;
    if (!it?.filePath || !fileName) return null;
    const src = getAssetUrl(`${it.filePath}/${fileName}`);
    return src || null;
  };

  return createPortal(
    <div className="storyviewer-overlay" onClick={onClose}>
      <div className="storyviewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="storyviewer-actions">
          {isOwner && (
            <button className="storyviewer-delete" onClick={handleDelete} title="삭제">
              🗑️
            </button>
          )}
          <button className="storyviewer-close" onClick={onClose} title="닫기">
            ✕
          </button>
        </div>

        <div className="storyviewer-header">
          <div className="storyviewer-avatar">
            {owner?.profileImg ? (
              <img
                src={getProfileImageUrl(owner.profileImg)}
                alt={owner.memberNick}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <span className="initial-text">
                {owner?.memberNick ? owner.memberNick.charAt(0) : "S"}
              </span>
            )}
          </div>
          <div className="storyviewer-name">
            {owner?.memberNick || `story#${owner?.storyNo || ""}`}
          </div>
        </div>

        <div className="storyviewer-progress">
          {items.map((item, idx) => {
            const isVideo = isVideoName(item?.savedName || item?.changeName || item?.originName);
            const isActive = idx === activeIndex;
            
            return (
              <div className="progress-seg" key={idx}>
                {idx < activeIndex && <div className="progress-fill done" />}
                {isActive && (
                  isVideo && isCurrentVideo ? (
                    // 동영상: 재생 진행률에 따라 width 직접 설정
                    <div
                      key={`video-${tick}`}
                      className="progress-fill"
                      style={{ width: `${videoProgress}%` }}
                    />
                  ) : (
                    // 이미지: CSS 애니메이션 사용
                    <div
                      key={`run-${tick}`}
                      className="progress-fill run"
                      style={{ animationDuration: `${currentDuration}ms` }}
                    />
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="storyviewer-content">
          {items.length === 0 ? (
            <div className="storyviewer-empty">등록된 콘텐츠가 없습니다.</div>
          ) : (
            <>
              <div className="storyviewer-hit">
                <div className="hit-left" onClick={() => goIndex(activeIndex - 1)} />
                <div className="hit-right" onClick={() => goIndex(activeIndex + 1)} />
              </div>

              <div className="storyviewer-active">
                {active?.filePath && getItemSrc(active) && (
                  isCurrentVideo ? (
                    <video
                      ref={videoRef}
                      src={getItemSrc(active)}
                      className="storyviewer-mainimg"
                      controls
                      autoPlay
                      playsInline
                      onLoadedMetadata={handleVideoLoadedMetadata}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={handleVideoEnded}
                    />
                  ) : (
                    <img
                      src={getItemSrc(active)}
                      alt=""
                      className="storyviewer-mainimg"
                      onError={(e) => {
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  )
                )}
                {active?.storyText && (
                  <div className="storyviewer-text">{active.storyText}</div>
                )}
              </div>

              <div className="storyviewer-thumbs">
                {items.map((it, idx) => (
                  <button
                    type="button"
                    key={it.itemNo || idx}
                    className={`thumb ${idx === activeIndex ? "on" : ""}`}
                    onClick={() => goIndex(idx)}
                  >
                    {getItemSrc(it) && (
                      isVideoName(it?.savedName || it?.changeName || it?.originName) ? (
                        <video src={getItemSrc(it)} muted playsInline />
                      ) : (
                        <img src={getItemSrc(it)} alt="thumb" />
                      )
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StoryViewer;
