import DiaryItem from '../components/DiaryItem';

const mockDiaries = [
  { id: 1, title: '추억 한 조각', content: '오늘은 친구들과 함께한 추억을 기록했어요.', date: '2024-05-01' },
  { id: 2, title: '소소한 일상', content: '카페에서 마신 커피가 정말 맛있었어요.', date: '2024-05-03' },
];

function DiaryPage() {
  return (
    <div className="diary-page">
      <h1>다이어리</h1>
      <div className="diary-list">
        {mockDiaries.map((diary) => (
          <DiaryItem key={diary.id} {...diary} />
        ))}
      </div>
    </div>
  );
}

export default DiaryPage;
