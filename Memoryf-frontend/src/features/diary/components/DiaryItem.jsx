import "../css/DiaryItem.css";

function DiaryItem({ diary }) {
  return (
    <div className="diary-item card">
      <div className="date">{diary.date}</div>
      <p>{diary.content}</p>
    </div>
  );
}

export default DiaryItem;
