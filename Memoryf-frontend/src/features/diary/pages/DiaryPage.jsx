import { useEffect, useState } from "react";
import { getDiaryList } from "../api/diaryApi";

function DiaryPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchDiary();
  }, [page]);

  const fetchDiary = async () => {
    const data = await getDiaryList(page, 5);
    setList(data);
  };

  return (
    <div>
      {list.map(diary => (
        <div key={diary.diaryNo}>
          {diary.content}
        </div>
      ))}
    </div>
  );
}

export default DiaryPage;
