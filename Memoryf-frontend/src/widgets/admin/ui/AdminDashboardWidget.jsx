import React from "react";

const AdminDashboardWidget = () => {
	// 더미 통계 데이터
	const stats = [
		{ label: "전체 회원", value: "1,234", color: "#3b82f6", icon: "👥" },
		{ label: "오늘 신고", value: "12", color: "#ef4444", icon: "🚨" },
		{ label: "오늘 결제", value: "₩1,234,000", color: "#10b981", icon: "💳" },
		{ label: "등록된 BGM", value: "45", color: "#f59e0b", icon: "🎵" },
	];

	return (
		<div>
			{/* 페이지 헤더 */}
			<div style={{ marginBottom: "32px" }}>
				<h1
					style={{
						fontSize: "28px",
						fontWeight: "700",
						color: "#1f2937",
						marginBottom: "8px",
					}}
				>
					대시보드
				</h1>
				<p style={{ fontSize: "15px", color: "#6b7280" }}>전체 서비스 현황을 한눈에 확인하세요.</p>
			</div>

			{/* 통계 카드 그리드 */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "20px",
					marginBottom: "32px",
				}}
			>
				{stats.map((stat, index) => (
					<div
						key={index}
						style={{
							padding: "24px",
							backgroundColor: "#ffffff",
							borderRadius: "12px",
							border: "1px solid #e5e7eb",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
							transition: "transform 0.2s, box-shadow 0.2s",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "12px",
							}}
						>
							<div
								style={{
									fontSize: "32px",
									width: "48px",
									height: "48px",
									borderRadius: "12px",
									backgroundColor: `${stat.color}20`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{stat.icon}
							</div>
						</div>
						<div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>{stat.label}</div>
						<div style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
					</div>
				))}
			</div>

			{/* 최근 활동 섹션 */}
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
				{/* 최근 신고 */}
				<div
					style={{
						padding: "24px",
						backgroundColor: "#ffffff",
						borderRadius: "12px",
						border: "1px solid #e5e7eb",
					}}
				>
					<h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1f2937" }}>
						최근 신고 내역
					</h2>
					<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
						{[
							{ type: "피드", id: 123, reason: "욕설/비방", time: "5분 전" },
							{ type: "댓글", id: 124, reason: "스팸", time: "10분 전" },
							{ type: "회원", id: 125, reason: "부적절한 행동", time: "15분 전" },
						].map((report, index) => (
							<div
								key={index}
								style={{
									padding: "12px",
									backgroundColor: "#f9fafb",
									borderRadius: "8px",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<div style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>{report.type} #{report.id}</div>
									<div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{report.reason}</div>
								</div>
								<div style={{ fontSize: "12px", color: "#9ca3af" }}>{report.time}</div>
							</div>
						))}
					</div>
				</div>

				{/* 최근 결제 */}
				<div
					style={{
						padding: "24px",
						backgroundColor: "#ffffff",
						borderRadius: "12px",
						border: "1px solid #e5e7eb",
					}}
				>
					<h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1f2937" }}>
						최근 결제 내역
					</h2>
					<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
						{[
							{ userId: 101, product: "BGM 패키지 A", amount: "₩9,900", time: "3분 전" },
							{ userId: 102, product: "BGM 패키지 B", amount: "₩19,900", time: "8분 전" },
							{ userId: 103, product: "BGM 패키지 A", amount: "₩9,900", time: "12분 전" },
						].map((payment, index) => (
							<div
								key={index}
								style={{
									padding: "12px",
									backgroundColor: "#f9fafb",
									borderRadius: "8px",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<div style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>회원 #{payment.userId}</div>
									<div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{payment.product}</div>
								</div>
								<div style={{ textAlign: "right" }}>
									<div style={{ fontSize: "14px", fontWeight: "600", color: "#10b981" }}>{payment.amount}</div>
									<div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{payment.time}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboardWidget;
