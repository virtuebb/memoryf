const mockVisitors = [
  { id: 1, name: '고마운 친구', message: '다녀갑니다 😊' },
  { id: 2, name: '하트뿅뿅', message: '오늘도 좋은 하루!' },
  { id: 3, name: '기억수집가', message: '사진 잘 보고 갑니다.' },
];

function HomeVisitorList() {
  return (
    <div className="left-section visitors">
      <div className="section-label">Visitors</div>
      <div className="section-content">
        <div className="visitor-list">
          <div className="visitor-header">
            <h4>방명록/방문자</h4>
            <span className="visitor-count">{mockVisitors.length}</span>
          </div>
          <ul>
            {mockVisitors.map((visitor) => (
              <li key={visitor.id} className="visitor-row">
                <span className="visitor-name">{visitor.name}</span>
                <span className="visitor-message">{visitor.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeVisitorList;
