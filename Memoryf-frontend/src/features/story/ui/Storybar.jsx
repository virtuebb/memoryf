import "../css/StoryBar.css";
import { useEffect, useState } from "react";
import StoryViewer from "./StoryViewer";
import StoryUploadModal from "./StoryUploadModal";
import { getProfileImageUrl } from "../../../shared/api";
import { storyApi } from "../api";

function StoryBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [storyGroups, setStoryGroups] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // 로그인 멤버 번호 반환
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

  // 응답을 멤버 단위로 그룹핑(아바타 1개만 노출)
  const groupStoriesByMember = (stories = []) => {
    const grouped = stories.reduce((acc, story) => {
      if (!story?.memberNo) return acc;
      const current = acc[story.memberNo] || {
        memberNo: story.memberNo,
        memberNick: story.memberNick,
        profileImg: story.profileImg,
        stories: [],
        latestCreateDate: story.createDate,
      };

      current.stories.push({
        storyNo: story.storyNo,
        createDate: story.createDate,
        expireDate: story.expireDate,
        isRead: story.isRead ?? story.read ?? false,
      });

      if (story.createDate && (!current.latestCreateDate || new Date(story.createDate) > new Date(current.latestCreateDate))) {
        current.latestCreateDate = story.createDate;
      }

      acc[story.memberNo] = current;
      return acc;
    }, {});

    return Object.values(grouped)
      .map((g) => ({
        ...g,
        stories: g.stories.sort((a, b) => new Date(a.createDate || 0) - new Date(b.createDate || 0)),
      }))
      .sort((a, b) => new Date(b.latestCreateDate || 0) - new Date(a.latestCreateDate || 0));
  };

  // 스토리 목록 로드
  const loadStoryList = async () => {
    const storageData = localStorage.getItem("loginMember");
    if (!storageData) return [];

    const loginMember = JSON.parse(storageData);
    const currentMemberNo = loginMember?.memberNo;

    if (currentMemberNo && currentMemberNo !== "null") {
      try {
        const res = await storyApi.selectStoryList(currentMemberNo);
        const grouped = groupStoriesByMember(res.data || []);
        setStoryGroups(grouped);
        return grouped;
      } catch (err) {
        console.error("스토리 목록 로드 실패:", err);
        setStoryGroups([]);
        return [];
      }
    }

    console.warn("전달할 memberNo가 유효하지 않습니다.");
    return [];
  };

  useEffect(() => {
    loadStoryList();

    const handleStoryChanged = () => {
      loadStoryList();
    };

    window.addEventListener("storyChanged", handleStoryChanged);
    return () => window.removeEventListener("storyChanged", handleStoryChanged);
  }, []);

  // 스토리 상세 조회 및 뷰어 열기 (멤버 단위)
  const openViewerForMember = async (group) => {
    try {
      const memberNo = getMemberNo();
      if (!memberNo) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      if (!group?.stories?.length) return;

      await Promise.all(
        group.stories.map((story) =>
          storyApi.insertStoryVisitor(memberNo, story.storyNo).catch((err) => {
            console.error("스토리 방문 기록 실패:", err);
            return null;
          })
        )
      );

      const storyDetails = await Promise.all(
        group.stories.map((story) =>
          storyApi
            .selectStoryDetail(story.storyNo)
            .then((res) => res.data)
            .catch((err) => {
              console.error("스토리 상세 로드 실패:", err);
              return null;
            })
        )
      );

      const validDetails = storyDetails.filter(Boolean);
      if (!validDetails.length) {
        alert("스토리 데이터를 불러올 수 없습니다.");
        return;
      }

      const mergedItems = validDetails
        .sort((a, b) => new Date(a.story.createDate || 0) - new Date(b.story.createDate || 0))
        .flatMap((detail) =>
          (detail.items || []).map((item) => ({
            ...item,
            _storyNo: detail.story.storyNo,
            _storyCreateDate: detail.story.createDate,
          }))
        );

      setSelected({
        owner: {
          memberNo: group.memberNo,
          memberNick: group.memberNick,
          profileImg: group.profileImg,
        },
        items: mergedItems,
      });
      setIsOpen(true);
    } catch (err) {
      console.error("스토리 뷰어 로드 실패:", err);
      alert("스토리 로딩 중 오류가 발생했습니다.");
    }
  };

  const closeViewer = () => {
    setIsOpen(false);
    setSelected(null);
    loadStoryList();
  };

  const closeUpload = () => setIsUploadOpen(false);

  const onUploadSuccess = async () => {
    const grouped = await loadStoryList();
    setIsUploadOpen(false);

    const myNo = getMemberNo();
    const myGroup = grouped.find((g) => g.memberNo === myNo);
    if (myGroup) {
      await openViewerForMember(myGroup);
    }
  };

  return (
    <div className="story-wrapper">
      <div className="story-bar">
        <div className="story" onClick={() => setIsUploadOpen(true)}>
          <div className="story-circle add-circle">+</div>
          <div className="story-label">Add</div>
        </div>

        {storyGroups.map((group) => {
          const hasUnread = group.stories?.some((s) => !s.isRead);
          return (
            <div
              className="story"
              key={group.memberNo}
              onClick={() => openViewerForMember(group)}
            >
              <div className={`story-circle ${group.stories?.length ? (hasUnread ? "has-story" : "has-story read") : ""}`}>
                <div className="story-inner">
                  {group.profileImg ? (
                    <img
                      src={getProfileImageUrl(group.profileImg)}
                      alt={group.memberNick}
                    />
                  ) : (
                    <span className="initial-text">
                      {group.memberNick ? group.memberNick.charAt(0) : "S"}
                    </span>
                  )}
                </div>
              </div>
              <div className="story-label">{group.memberNick || `User#${group.memberNo}`}</div>
            </div>
          );
        })}
      </div>

      {isOpen && selected && (
        <StoryViewer
          isOpen={isOpen}
          onClose={closeViewer}
          selected={selected}
        />
      )}

      <StoryUploadModal
        isOpen={isUploadOpen}
        onClose={closeUpload}
        onSuccess={onUploadSuccess}
      />
    </div>
  );
}

export default StoryBar;
