import { useEffect, useState } from "react";
import "../css/Visitors.css";
import { visitHome, getVisitorStats } from "../api/visitorApi";

function Visitors({ homeNo }) {
  const [stats, setStats] = useState({ today: 0, total: 0 });

  useEffect(() => {
  if (!homeNo) return;

  const fetchStats = async () => {
    try {
      // ✅ 1. 방문 기록 생성 (중복이면 서버에서 무시됨)
      await visitHome(homeNo);

      // ✅ 2. 그 다음 통계 조회
      const res = await getVisitorStats(homeNo);

      setStats({
        today: res.data?.today ?? 0,
        total: res.data?.total ?? 0,
      });
    } catch (err) {
      console.warn("Visitors: 방문자 통계 로드 실패", err);
      setStats({ today: 0, total: 0 });
    }
  };

    fetchStats();
  }, [homeNo]);

  return (
    <div className="visitors">
      <div className="visitors-title">VISITORS</div>

      <div className="visitors-stats">
        <div className="stat">
          <span className="label">TODAY</span>
          <span className="value">
            {Number(stats.today).toLocaleString()}
          </span>
        </div>

        <div className="divider" />

        <div className="stat">
          <span className="label">TOTAL</span>
          <span className="value">
            {Number(stats.total).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Visitors;
