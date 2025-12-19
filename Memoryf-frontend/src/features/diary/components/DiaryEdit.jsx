import { useState } from "react";
import "../css/DiaryEdit.css";

function DiaryEditor({ onSave }) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave(content);
    setContent("");
  };

  return (
    <div className="diary-edit">
      <h3>오늘의 일기</h3>

      <textarea
        placeholder="오늘의 기록을 남겨보세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="edit-footer">
        <span className="hint">나만 볼 수 있는 기록이에요</span>
        <button className="save-btn" onClick={handleSubmit}>
          저장
        </button>
      </div>
    </div>
  );
}

export default DiaryEditor;
