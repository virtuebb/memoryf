import { createPortal } from "react-dom";
import "../css/StoryViewer.css";
import { useEffect, useState, useCallback } from "react";
import storyApi from "../api/storyApi";

const StoryViewer = ({ isOpen, onClose, selected }) => {
  // 1. 초기 렌더링 방어
  if (!isOpen || !selected) return null;

  const story = selected?.story;
  const items = selected?.items || [];
  
  // ✅ 로그인 유저 확인 로직 (현재는 하드코딩, 실제 세션/Redux 값으로 대체 필요)
  const loginUserNo = 1; 
  const isOwner = story && Number(story.memberNo) === Number(loginUserNo);

  const [activeIndex, setActiveIndex] = useState(0);
  const [tick, setTick] = useState(0);

  const baseURL = `http://${window.location.hostname}:8006/memoryf`;
  const DURATION_MS = 3000;

  // 2. 인덱스 이동 함수 (useCallback으로 최적화)
  const goIndex = useCallback((idx) => {
    if (idx < 0 || idx >= items.length) return;
    setActiveIndex(idx);
    setTick((t) => t + 1);
  }, [items.length]);

  // 3. 열릴 때 초기화
  useEffect(() => {
    setActiveIndex(0);
    setTick((t) => t + 1);
  }, [selected]);

  // 4. 자동 넘김 로직
  useEffect(() => {
    if (items.length === 0) return;

    const timer = setTimeout(() => {
      if (activeIndex >= items.length - 1) {
        onClose(); // 마지막 장이면 닫기
      } else {
        goIndex(activeIndex + 1);
      }
    }, DURATION_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, items.length, onClose, goIndex]);

  // 5. 삭제 핸들러
  const handleDelete = async (e) => {
    e.stopPropagation(); // 오버레이 클릭 이벤트 전파 방지
    if (!window.confirm("이 스토리를 삭제하시겠습니까? (복구할 수 없습니다.)")) return;

    try {
      await storyApi.deleteStory(story.storyNo);
      alert("삭제되었습니다.");
      window.dispatchEvent(new Event("storyChanged")); // 목록 새로고침 알림
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
        
        {/* ✅ 우상단 버튼 그룹: 주인일 때만 삭제 노출 */}
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

        {/* 상단 정보 */}
        <div className="storyviewer-header">
          <div className="storyviewer-avatar">S</div>
          <div className="storyviewer-name">
            {story ? `story#${story.storyNo}` : "Story"}
          </div>
        </div>

        {/* 상단 진행 바 */}
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

        {/* 메인 콘텐츠 영역 */}
        <div className="storyviewer-content">
          {items.length === 0 ? (
            <div className="storyviewer-empty">등록된 콘텐츠가 없습니다.</div>
          ) : (
            <>
              {/* 클릭 감지 영역 (좌/우) */}
              <div className="storyviewer-hit">
                <div className="hit-left" onClick={() => goIndex(activeIndex - 1)} />
                <div className="hit-right" onClick={() => goIndex(activeIndex + 1)} />
              </div>

              <div className="storyviewer-active">
                {active?.filePath && (
                  <img
                    src={`${baseURL}${active.filePath}/${active.changeName}`}
                    alt=""
                    className="storyviewer-mainimg"
                    onError={(e) => { e.target.src = "/fallback-image.png"; }} // 이미지 로드 실패 대비
                  />
                )}
                {active?.storyText && (
                  <div className="storyviewer-text">{active.storyText}</div>
                )}
              </div>

              {/* 하단 썸네일 바 */}
              <div className="storyviewer-thumbs">
                {items.map((it, idx) => (
                  <button
                    type="button"
                    key={it.itemNo || idx}
                    className={`thumb ${idx === activeIndex ? "on" : ""}`}
                    onClick={() => goIndex(idx)}
                  >
                    <img src={`${baseURL}${it.filePath}/${it.changeName}`} alt="thumb" />
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