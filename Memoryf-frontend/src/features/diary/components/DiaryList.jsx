import { useState } from "react";
import DiaryItem from "./DiaryItem.jsx";

const PAGE_SIZE = 5;
const PAGE_GROUP_SIZE = 5; // << 1 2 3 4 5 >>

function DiaryList() {
  // 🔹 더미 데이터 (API 오기 전까지)
  const diaries = Array.from({ length: 37 }, (_, i) => ({
    id: i + 1,
    content: `오늘의 일기 ${i + 1}`,
    date: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
  }));

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(diaries.length / PAGE_SIZE);

  // 현재 페이지 그룹 계산
  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const groupStart = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);

  // 현재 페이지 데이터
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentDiaries = diaries.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="diary-list">
      {currentDiaries.map((diary) => (
        <DiaryItem key={diary.id} diary={diary} />
      ))}

      {/* 🔢 Pagination */}
      <div className="pagination">
        {/* 이전 그룹 */}
        <button
          disabled={groupStart === 1}
          onClick={() => setPage(groupStart - 1)}
        >
          &laquo;
        </button>

        {/* 숫자 버튼 */}
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
          disabled={groupEnd === totalPages}
          onClick={() => setPage(groupEnd + 1)}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

export default DiaryList;
