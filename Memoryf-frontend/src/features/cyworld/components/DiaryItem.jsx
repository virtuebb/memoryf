function DiaryItem({ title, content, date }) {
  return (
    <article className="diary-item">
      <div className="diary-header">
        <h3 className="diary-title">{title}</h3>
        <span className="diary-date">{date}</span>
      </div>
      <p className="diary-content">{content}</p>
    </article>
  );
}

export default DiaryItem;
