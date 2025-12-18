import { useEffect, useState } from "react";
import "../css/Visitors.css";
import axios from "axios";

function Visitors() {
  const [stats, setStats] = useState({ today: 0, total: 0 });

  useEffect(() => {
    axios.get("/api/visits/stats").then(res => {
      setStats(res.data);
    });
  }, []);

  return (
    <div className="visitors">
      <div className="visitors-title">VISITORS</div>

      <div className="visitors-stats">
        <div className="stat">
          <span className="label">TODAY</span>
          <span className="value">{stats.today}</span>
        </div>

        <div className="divider" />

        <div className="stat">
          <span className="label">TOTAL</span>
          <span className="value">{stats.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default Visitors;
