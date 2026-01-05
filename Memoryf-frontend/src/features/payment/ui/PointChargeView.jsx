import { usePointCharge } from "../model";
import "./PointChargeView.css";

const PointChargeView = () => {
	const { chargeAmounts, currentPoint, selectedAmount, setSelectedAmount, isLoading, requestPayment } = usePointCharge();

	return (
		<div className="point-charge-page">
			<div className="point-charge-container">
				<h1 className="page-title">포인트 충전</h1>

				<div className="current-point-box">
					<span className="point-label">보유 포인트</span>
					<span className="point-value">{currentPoint.toLocaleString()}P</span>
				</div>

				<div className="charge-amount-section">
					<h2 className="section-title">충전 금액 선택</h2>
					<div className="amount-grid">
						{chargeAmounts.map((item) => (
							<button
								key={item.amount}
								className={`amount-button ${selectedAmount === item.amount ? "selected" : ""}`}
								onClick={() => setSelectedAmount(item.amount)}
							>
								{item.label}
							</button>
						))}
					</div>
				</div>

				<div className="charge-button-section">
					{selectedAmount && (
						<div className="selected-info">
							<span>선택 금액: </span>
							<strong>{selectedAmount.toLocaleString()}원</strong>
						</div>
					)}
					<button className="charge-button" onClick={requestPayment} disabled={!selectedAmount || isLoading}>
						{isLoading ? "처리 중..." : "충전하기"}
					</button>
				</div>

				<div className="info-section">
					<h3>안내사항</h3>
					<ul>
						<li>포인트는 BGM 구매에 사용할 수 있습니다.</li>
						<li>현재 테스트 모드로 실제 결제가 이루어지지 않습니다.</li>
						<li>카카오페이 테스트 결제를 통해 포인트가 충전됩니다.</li>
						<li>충전된 포인트는 환불이 불가능합니다.</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default PointChargeView;
