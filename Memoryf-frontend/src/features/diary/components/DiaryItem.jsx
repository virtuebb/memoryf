import "../css/DiaryItem.css";

function DiaryItem({ diary }) {
  return (
    <div className="diary-item">
      <div className="diary-meta">
        <span className="diary-date">
          {new Date(diary.createDate).toLocaleDateString("ko-KR")}
        </span>
      </div>

      <div className="diary-content">
        {diary.content}
      </div>
    </div>
  );
}

export default DiaryItem;
