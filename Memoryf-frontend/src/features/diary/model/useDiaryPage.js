import { useCallback, useEffect, useState } from "react";

import { createDiary, deleteDiary, getDiaryList, updateDiary } from "../api";

export function useDiaryPage(options = {}) {
	const { page = 1, size = 100 } = options;

	const [diaries, setDiaries] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchDiaries = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getDiaryList(page, size);
			setDiaries(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("다이어리 조회 실패", error);
		} finally {
			setLoading(false);
		}
	}, [page, size]);

	useEffect(() => {
		fetchDiaries();
	}, [fetchDiaries]);

	const handleCreate = useCallback(
		async (content) => {
			try {
				await createDiary(content);
				await fetchDiaries();
			} catch (error) {
				console.error("다이어리 작성 실패", error);
			}
		},
		[fetchDiaries]
	);

	const handleUpdate = useCallback(
		async (diaryNo, content) => {
			setDiaries((prev) =>
				prev.map((diary) =>
					diary.diaryNo === diaryNo ? { ...diary, content } : diary
				)
			);

			try {
				await updateDiary(diaryNo, content);
			} catch (error) {
				console.error("다이어리 수정 실패", error);
				await fetchDiaries();
			}
		},
		[fetchDiaries]
	);

	const handleDelete = useCallback(
		async (diaryNo) => {
			setDiaries((prev) => prev.filter((diary) => diary.diaryNo !== diaryNo));

			try {
				await deleteDiary(diaryNo);
			} catch (error) {
				console.error("다이어리 삭제 실패", error);
				await fetchDiaries();
			}
		},
		[fetchDiaries]
	);

	return {
		diaries,
		loading,
		reload: fetchDiaries,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
}
