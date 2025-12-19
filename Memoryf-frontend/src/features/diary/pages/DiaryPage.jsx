import { useEffect, useState } from "react";
import { getDiaryList, createDiary } from "../api/diaryApi";
import "../css/DiaryPage.css";

const PAGE_SIZE = 5;
const PAGE_GROUP_SIZE = 5;

function DiaryPage() {
  const [list, setList] = useState([]);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchDiary();
  }, [page]);

  const fetchDiary = async () => {
    const data = await getDiaryList(page, PAGE_SIZE);
    setList(data);
    setTotalCount(100); // 임시 총 개수
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // 🔹 페이지 그룹 계산
  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const groupStart = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);

  const handleSave = async () => {
    if (!content.trim()) return;

    await createDiary({ content });
    setContent("");
    setPage(1);
    fetchDiary();
  };

  return (
    <div className="diary-page">
      {/* ✏️ 작성 */}
      <div className="diary-write-box">
        <textarea
            className="diary-textarea"
            placeholder="오늘의 기록을 남겨보세요!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <div className="diary-write-footer">
            <span className="diary-hint">
            오늘의 기록은 비공개로 저장돼요
            </span>
            <button className="diary-save-btn" onClick={handleSave}>
            저장
            </button>
        </div>
        </div>

      {/* 📓 리스트 */}
      <div className="diary-list">
        {list.map((diary) => (
          <div key={diary.diaryNo} className="diary-card">
            <div className="diary-date">
              {diary.createDate?.slice(0, 10)}
            </div>
            <div className="diary-content">{diary.content}</div>
          </div>
        ))}
      </div>

      {/* 🔢 Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* 이전 그룹 */}
          <button
            className="arrow"
            disabled={groupStart === 1}
            onClick={() => setPage(groupStart - 1)}
          >
            &laquo;
          </button>

          {/* 숫자 */}
          {Array.from(
            { length: groupEnd - groupStart + 1 },
            (_, i) => groupStart + i
          ).map((p) => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          {/* 다음 그룹 */}
          <button
            className="arrow"
            disabled={groupEnd === totalPages}
            onClick={() => setPage(groupEnd + 1)}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default DiaryPage;
