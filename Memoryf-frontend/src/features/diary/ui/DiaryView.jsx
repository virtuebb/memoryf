import "./DiaryView.css";

import DiaryEdit from "./DiaryEdit.jsx";
import DiaryList from "./DiaryList.jsx";
import { useDiaryPage } from "../model";

function DiaryView() {
	const { diaries, handleCreate, handleUpdate, handleDelete } = useDiaryPage({
		page: 1,
		size: 100,
	});

	return (
		<div className="diary-page">
			<DiaryEdit onSave={handleCreate} />
			<DiaryList list={diaries} onUpdate={handleUpdate} onDelete={handleDelete} />
		</div>
	);
}

export default DiaryView;
