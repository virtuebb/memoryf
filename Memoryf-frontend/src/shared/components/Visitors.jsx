import { useEffect, useState } from "react";
import "../css/Visitors.css";
import axios from "axios";

function Visitors() {
  const [stats, setStats] = useState({ today: 0, total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/visits/stats");

        setStats({
          today: res?.data?.today ?? 0,
          total: res?.data?.total ?? 0,
        });
      } catch (err) {
        console.warn("Visitors: 방문자 통계 로드 실패 (guest 가능)");
        setStats({ today: 0, total: 0 });
      }
    };

    fetchStats();
  }, []);

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
