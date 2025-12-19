import { useState } from "react";
import "../css/DiaryEdit.css";

function DiaryEditor() {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    alert("일기 저장 (임시)");
    setContent("");
  };

  return (
    <div className="diary-editor card">
      <div className="diary-edit card">
        <h3>오늘의 일기</h3>

        <textarea
            placeholder="오늘의 기록을 남겨보세요!"
        />

        <div className="edit-footer">
            <span className="hint">오늘의 기록은 비공개로 저장돼요</span>
            <button className="save-btn">저장</button>
        </div>
      </div>
    </div>
  );
}

export default DiaryEditor;
