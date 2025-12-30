import { useEffect, useState } from "react";
import DiaryEdit from "../components/DiaryEdit.jsx";
import DiaryList from "../components/DiaryList.jsx";
import {
  getDiaryList,
  createDiary,
  updateDiary,
  deleteDiary,
} from "../api/diaryApi";

import "../css/DiaryPage.css";

function DiaryPage() {
  const [diaries, setDiaries] = useState([]);

  // 📌 최초 로딩
  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      // 서버는 page/size 받지만, 지금은 전체 받아서 프론트 페이징
      const data = await getDiaryList(1, 100);
      setDiaries(data);
    } catch (err) {
      console.error("다이어리 조회 실패", err);
    }
  };

  // ✏️ 작성
  const handleCreate = async (content) => {
    try {
      await createDiary(content);
      await fetchDiaries(); // 다시 조회
    } catch (err) {
      console.error("다이어리 작성 실패", err);
    }
  };

  // ✏️ 수정
  const handleUpdate = async (diaryNo, content) => {

      console.log("accessToken =", localStorage.getItem("accessToken")); // ⭐
    try {
      // optimistic UI
      setDiaries((prev) =>
        prev.map((d) =>
          d.diaryNo === diaryNo ? { ...d, content } : d
        )
      );

      await updateDiary(diaryNo, content);
    } catch (err) {
      console.error("다이어리 수정 실패", err);
      fetchDiaries(); // 실패 시 롤백
    }
  };

  // 🗑 삭제
  const handleDelete = async (diaryNo) => {
    try {
      // optimistic UI
      setDiaries((prev) =>
        prev.filter((d) => d.diaryNo !== diaryNo)
      );

      await deleteDiary(diaryNo);
    } catch (err) {
      console.error("다이어리 삭제 실패", err);
      fetchDiaries(); // 실패 시 롤백
    }
  };

  return (
    <div className="diary-page">
      {/* ✏️ 작성 */}
      <DiaryEdit onSave={handleCreate} />

      {/* 📓 리스트 + 페이징 */}
      <DiaryList
        list={diaries}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default DiaryPage;

