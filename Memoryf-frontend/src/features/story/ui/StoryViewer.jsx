import { createPortal } from "react-dom";
import "../css/StoryViewer.css";
import { useEffect, useState, useCallback } from "react";
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

  const DURATION_MS = 3000;

  const goIndex = useCallback(
    (idx) => {
      if (idx < 0 || idx >= items.length) return;
      setActiveIndex(idx);
      setTick((t) => t + 1);
    },
    [items.length]
  );

  useEffect(() => {
    setActiveIndex(0);
    setTick((t) => t + 1);
  }, [selected]);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setTimeout(() => {
      if (activeIndex >= items.length - 1) {
        onClose();
      } else {
        goIndex(activeIndex + 1);
      }
    }, DURATION_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, items.length, onClose, goIndex]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    const active = items[activeIndex];
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

  const active = items[activeIndex];

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
          {items.map((_, idx) => (
            <div className="progress-seg" key={idx}>
              {idx < activeIndex && <div className="progress-fill done" />}
              {idx === activeIndex && (
                <div
                  key={`run-${tick}`}
                  className="progress-fill run"
                  style={{ animationDuration: `${DURATION_MS}ms` }}
                />
              )}
            </div>
          ))}
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
                {active?.filePath && (
                  <img
                    src={getAssetUrl(`${active.filePath}/${active.changeName}`)}
                    alt=""
                    className="storyviewer-mainimg"
                    onError={(e) => {
                      e.target.src = "/fallback-image.png";
                    }}
                  />
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
                    <img src={getAssetUrl(`${it.filePath}/${it.changeName}`)} alt="thumb" />
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
