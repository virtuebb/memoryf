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

  // 1. 멤버 번호를 가져오는 로직을 함수화해서 안전하게 관리
  const getMemberNo = () => {
    const storageData = localStorage.getItem("loginMember");
    if (!storageData || storageData === "null") return null;
    try {
      const loginMember = JSON.parse(storageData);
      return loginMember ? loginMember.memberNo : null;
    } catch (e) {
      return null;
    }
  };

// 스토리 목록 로드
  const loadStoryList = () => {
    // 1. 함수 실행 시점에 localStorage에서 최신 정보를 다시 읽어옵니다.
    const storageData = localStorage.getItem("loginMember");
    if (!storageData) return;

    const loginMember = JSON.parse(storageData);
    const currentMemberNo = loginMember?.memberNo;

    // 2. ★ 중요: memberNo가 진짜 있을 때만 서버에 요청을 보냅니다.
    if (currentMemberNo && currentMemberNo !== "null") {
      storyApi
        .selectStoryList(currentMemberNo)
        .then((res) => {
          console.log("스토리 목록 수신 성공:", res.data);
          setStoryList(res.data || []);
        })
        .catch((err) => {
          console.error("스토리 목록 로드 실패:", err);
          setStoryList([]);
        });
    } else {
      console.warn("전달할 memberNo가 유효하지 않습니다.");
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시점에 바로 실행
    loadStoryList();

    const handleStoryChanged = () => loadStoryList();
    window.addEventListener("storyChanged", handleStoryChanged);

    return () => window.removeEventListener("storyChanged", handleStoryChanged);
  }, []);

  // 스토리 상세 조회 및 뷰어 열기
  const openViewer = async (storyNo) => {
    try {
      // 1. ★ 현재 로그인한 사용자의 번호를 가져옵니다. (에러 해결 지점)
      const memberNo = getMemberNo(); 

      if (!memberNo) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      // 2. 방문자 기록 (이제 memberNo가 정의되어 에러가 나지 않습니다)
      await storyApi.insertStoryVisitor(memberNo, storyNo);
      
      // 3. 상세 데이터 가져오기
      const res = await storyApi.selectStoryDetail(storyNo);

      // 4. 데이터가 정상적으로 왔을 때만 뷰어 상태 업데이트
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
            <div className="story-circle">
              {/* ✅ profileImg(PROFILE_CHANGE_NAME)가 있으면 이미지 출력, 없으면 닉네임 첫 글자 */}
              {s.profileImg ? (
                <img 
                src={`http://localhost:8006/memoryf/profile_images/${s.profileImg}`} 
                alt={s.memberNick} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }}
              />
              ) : (
                /* ✅ 이미지가 없을 때 기존처럼 'S' 대신 닉네임의 첫 글자 표시 */
                <span className="initial-text">
                  {s.memberNick ? s.memberNick.charAt(0) : 'S'}
                </span>
              )}
            </div>
            {/* ✅ story#{s.storyNo} 대신 실제 닉네임 출력 */}
            <div className="story-label">{s.memberNick || `User#${s.memberNo}`}</div>
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