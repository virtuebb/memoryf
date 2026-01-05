import { useEffect, useState } from "react";
import "../css/DiaryItem.css";

function DiaryItem({ diary, onUpdate, onDelete }) {
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState(diary?.content ?? "");

  // diary 변경 시 동기화
  useEffect(() => {
    setContent(diary?.content ?? "");
  }, [diary]);

  // 🔒 방어 코드 (디버깅용)
  if (!diary) return null;
  if (typeof onUpdate !== "function" || typeof onDelete !== "function") {
    console.error("❌ DiaryItem props missing", { diary, onUpdate, onDelete });
    return null;
  }

  const handleUpdate = () => {
    if (!content.trim()) return;
    onUpdate(diary.diaryNo, content);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setContent(diary.content);
    setIsEdit(false);
  };

  return (
    <div className="diary-item">
      {/* 날짜 (없어도 안 터지게) */}
      <div className="diary-meta">
        {diary.createDate && (
          <span className="diary-date">
            {new Date(diary.createDate).toLocaleDateString("ko-KR")}
          </span>
        )}
      </div>

      {/* 내용 */}
      <div className="diary-content">
        {isEdit ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        ) : (
          content
        )}
      </div>

      {/* 버튼 */}
      <div className="edit-footer">

        {isEdit ? (
          <>
            <button className="save-btn" onClick={handleUpdate}>
              저장
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              취소
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setIsEdit(true)}>
              수정
            </button>
            <button
              className="delete-btn"
              onClick={() => onDelete(diary.diaryNo)}
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DiaryItem;
