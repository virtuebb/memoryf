import "../css/StoryBar.css";
import { useEffect, useState } from "react";
import StoryViewer from "./StoryViewer";
import StoryUploadPage from "../pages/StoryUploadPage";
import storyApi from "../api/storyApi";

function StoryBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [storyList, setStoryList] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loginMember = JSON.parse(localStorage.getItem("loginMember"));
  const memberNo = loginMember ? loginMember.memberNo : null;

  // 스토리 목록 로드
  const loadStoryList = () => {
    storyApi
      .selectStoryList(memberNo)
      .then((res) => setStoryList(res.data || []))
      .catch((err) => {
        console.error("스토리 목록 로드 실패:", err);
        setStoryList([]);
      });
  };

  useEffect(() => {
    loadStoryList();

    // 커스텀 이벤트 리스너 (업로드 시 목록 갱신)
    const handleStoryChanged = () => loadStoryList();
    window.addEventListener("storyChanged", handleStoryChanged);

    return () => window.removeEventListener("storyChanged", handleStoryChanged);
  }, []);

  // 스토리 상세 조회 및 뷰어 열기
  const openViewer = async (storyNo) => {
    try {
      // 1. 방문자 기록 (비동기)
      await storyApi.insertStoryVisitor(memberNo, storyNo);
      
      // 2. 상세 데이터 가져오기
      const res = await storyApi.selectStoryDetail(storyNo);

      // 3. 데이터가 정상적으로 왔을 때만 뷰어 상태 업데이트
      if (res.data) {
        setSelected(res.data);
        setIsOpen(true);
      } else {
        alert("스토리 데이터를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("상세 조회 에러:", err);
      alert("스토리 로딩 중 오류가 발생했습니다.");
    }
  };

  const closeViewer = () => {
    setIsOpen(false);
    setSelected(null);
  };

  const closeUpload = () => setIsUploadOpen(false);

  // 업로드 성공 후 처리
  const onUploadSuccess = async (storyNo) => {
    loadStoryList();              // 목록 즉시 갱신
    setIsUploadOpen(false);       // 업로드 모달 닫기
    if (storyNo) {
      await openViewer(storyNo);  // 새로 작성한 스토리 바로 열기
    }
  };

  return (
    <div className="story-wrapper">
      <div className="story-bar">
        {/* 업로드 버튼 (Add) */}
        <div className="story" onClick={() => setIsUploadOpen(true)}>
          <div className="story-circle add-circle">+</div>
          <div className="story-label">Add</div>
        </div>

        {/* 스토리 리스트 루프 */}
        {storyList.map((s) => (
          <div className="story" key={s.storyNo} onClick={() => openViewer(s.storyNo)}>
            <div className="story-circle">S</div>
            <div className="story-label">story#{s.storyNo}</div>
          </div>
        ))}
      </div>

      {/* ✅ 렌더링 에러 방지: isOpen과 selected가 모두 존재할 때만 Viewer를 그림 */}
      {isOpen && selected && (
        <StoryViewer 
          isOpen={isOpen} 
          onClose={closeViewer} 
          selected={selected} 
        />
      )}

      {/* 스토리 업로드 모달 */}
      <StoryUploadPage
        isOpen={isUploadOpen}
        onClose={closeUpload}
        onSuccess={onUploadSuccess}
      />
    </div>
  );
}

export default StoryBar;