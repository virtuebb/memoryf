const mockTracks = [
  { id: 1, title: '추억의 노래 1', artist: 'HOMIX', duration: '3:21' },
  { id: 2, title: '추억의 노래 2', artist: 'HOMIX', duration: '2:58' },
  { id: 3, title: '추억의 노래 3', artist: 'HOMIX', duration: '4:12' },
];

function BgmPlayer() {
  // 간단한 정적 플레이어 (추후 API 연동 가능)
  return (
    <div className="left-section bgm">
      <div className="section-label">BGM</div>
      <div className="section-content">
        <div className="bgm-player">
          <div className="bgm-header">
            <div className="bgm-title">BGM</div>
            <span className="bgm-subtitle">오늘의 감성</span>
          </div>
          <ul className="bgm-list">
            {mockTracks.map((track) => (
              <li key={track.id} className="bgm-track">
                <div className="track-meta">
                  <span className="track-title">{track.title}</span>
                  <span className="track-artist">{track.artist}</span>
                </div>
                <span className="track-duration">{track.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BgmPlayer;
