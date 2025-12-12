function GuestbookItem({ author, message, date }) {
  return (
    <div className="guestbook-item">
      <div className="guestbook-meta">
        <span className="guestbook-author">{author}</span>
        <span className="guestbook-date">{date}</span>
      </div>
      <p className="guestbook-message">{message}</p>
    </div>
  );
}

export default GuestbookItem;
