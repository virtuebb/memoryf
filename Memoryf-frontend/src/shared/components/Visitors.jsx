import "../css/Visitors.css";

function Visitors() {
  return (
    <div className="visitors">
      <div className="visitors-title">VISITORS</div>

      <div className="visitors-stats">
        <div className="stat">
          <span className="label">TODAY</span>
          <span className="value">12</span>
        </div>

        <div className="divider" />

        <div className="stat">
          <span className="label">TOTAL</span>
          <span className="value">1,284</span>
        </div>
      </div>
    </div>
  );
}

export default Visitors;
