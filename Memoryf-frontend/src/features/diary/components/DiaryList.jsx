import { useState } from "react";
import DiaryItem from "./DiaryItem.jsx";
import "../css/DiaryList.css";

const PAGE_SIZE = 5;
const PAGE_GROUP_SIZE = 5;

function DiaryList({ list, onUpdate, onDelete }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(list.length / PAGE_SIZE);

  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const groupStart = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);

  const startIndex = (page - 1) * PAGE_SIZE;
  const currentDiaries = list.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="diary-list">
      {currentDiaries.map((diary) => (
        <DiaryItem
          key={diary.diaryNo}
          diary={diary}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      <div className="pagination">
        <button
          disabled={groupStart === 1}
          onClick={() => setPage(groupStart - 1)}
        >
          &laquo;
        </button>

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
