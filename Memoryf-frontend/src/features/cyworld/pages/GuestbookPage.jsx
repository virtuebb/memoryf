import GuestbookItem from '../components/GuestbookItem';

const mockGuestbooks = [
  { id: 1, author: '방문자1', message: '잘 보고 갑니다!', date: '2024-05-02' },
  { id: 2, author: '방문자2', message: 'BGM 좋네요 😊', date: '2024-05-04' },
];

function GuestbookPage() {
  return (
    <div className="guestbook-page">
      <h1>방명록</h1>
      <div className="guestbook-list">
        {mockGuestbooks.map((item) => (
          <GuestbookItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default GuestbookPage;
