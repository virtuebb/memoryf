import { createPortal } from "react-dom";
import "../css/StoryUploadPage.css";
import { useRef, useState } from "react";
import storyApi from "../api/storyApi";

const StoryUploadPage = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);

  // ✅ 버튼 클릭 시 숨겨진 input을 클릭하게 함
  const handleSelectImages = () => {
    fileInputRef.current?.click();
  };

  const onChangeFiles = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems = Array.from(files).map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      storyText: "",
    }));

    setItems((prev) => prev.concat(newItems));
    e.target.value = ""; // 초기화
  };

  const onChangeText = (index, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], storyText: value };
      return copy;
    });
  };

  const onRemoveItem = (index) => {
    setItems((prev) => {
      const copy = [...prev];
      if (copy[index]?.previewUrl) URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return alert("이미지를 추가해주세요.");

    try {
      const memberNo = 1; // TODO: 실제 세션 유저 번호로 교체
      const fd = new FormData();
      fd.append("detail", JSON.stringify({
        story: { memberNo },
        items: items.map(it => ({ storyText: it.storyText }))
      }));
      items.forEach(it => fd.append("files", it.file));

      await storyApi.insertStory(fd);
      window.dispatchEvent(new Event("storyChanged"));
      alert("업로드 완료");
      onClose();
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  /* ... 상단 로직 동일 ... */

  return createPortal(
    <div className="story-upload-overlay" onClick={onClose}>
      <div className="story-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="story-upload-header">
          <button className="btn-back" type="button" onClick={onClose}>✕</button>
          <h2 className="story-upload-title">스토리 업로드</h2>
          
          {/* ✅ 이미지가 있을 때만 공유 버튼 노출 */}
          {items.length > 0 && (
            <button 
              type="submit" 
              className="btn-submit-text" 
              form="storyUploadForm"
            >
              공유
            </button>
          )}
        </div>

        <form id="storyUploadForm" className="story-upload-body" onSubmit={onSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onChangeFiles}
            style={{ display: 'none' }}
          />

          <div className="story-upload-list">
            {items.length === 0 ? (
              <div className="story-upload-empty" onClick={handleSelectImages}>
                <div className="empty-icon-wrapper">
                   {/* 보라색 느낌의 아이콘 이미지 태그나 SVG를 넣으셔도 좋습니다 */}
                   <span className="empty-icon-plus">＋</span>
                </div>
                <p>사진을 선택하여 스토리를 시작하세요.</p>
                <button type="button" className="btn-add-main">이미지 선택</button>
              </div>
            ) : (
              <>
                {/* ✅ 이미지 추가 선택 버튼 디자인 개선 */}
                <button type="button" className="btn-add-more" onClick={handleSelectImages}>
                  + 이미지 추가 선택
                </button>
                {items.map((it, idx) => (
                  <div className="story-upload-item" key={idx}>
                    <div className="preview-wrap">
                      <img className="story-upload-preview" src={it.previewUrl} alt="" />
                      <button type="button" className="btn-remove" onClick={() => onRemoveItem(idx)}>✕</button>
                    </div>
                    <textarea
                      className="story-upload-text"
                      placeholder="텍스트 입력 (선택)"
                      value={it.storyText}
                      onChange={(e) => onChangeText(idx, e.target.value)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default StoryUploadPage;