import "../css/Visitors.css";

function Visitors({ today = 0, total = 0 }) {
  
  return (
    <div className="visitors">
      <div className="visitors-title">VISITORS</div>

      <div className="visitors-stats">
        <div className="stat">
          <span className="label">TODAY</span>
          <span className="value">{today}</span>
        </div>

        <div className="divider" />

        <div className="stat">
          <span className="label">TOTAL</span>
          <span className="value">{total}</span>
        </div>
      </div>
    </div>
  );
}

export default Visitors;

