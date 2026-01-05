import { useNavigate } from "react-router-dom";

import { useBgmStore } from "../model";
import "./BgmStoreView.css";

const BgmStoreView = () => {
	const navigate = useNavigate();

	const {
		allBgmList,
		purchasedBgmList,
		currentPoint,
		activeTab,
		setActiveTab,
		isLoading,
		handlePurchase,
		isPurchased,
		playFromMyList,
	} = useBgmStore({ navigate });

	return (
		<div className="bgm-store-page">
			<div className="bgm-store-container">
				<div className="store-header">
					<h1 className="store-title">BGM Store</h1>
					<div className="header-info">
						<div className="point-display">
							<span className="point-label">보유 포인트</span>
							<span className="point-value">{currentPoint.toLocaleString()}P</span>
						</div>
						<button className="charge-link-button" onClick={() => navigate("/payment/charge")}>
							포인트 충전
						</button>
					</div>
				</div>

				<div className="tab-menu">
					<button className={`tab-button ${activeTab === "store" ? "active" : ""}`} onClick={() => setActiveTab("store")}>
						멜론 차트 TOP 100
					</button>
					<button className={`tab-button ${activeTab === "mylist" ? "active" : ""}`} onClick={() => setActiveTab("mylist")}>
						내 플레이리스트 ({purchasedBgmList.length})
					</button>
				</div>

				{isLoading ? (
					<div className="loading">로딩 중...</div>
				) : (
					<div className="bgm-list">
						{activeTab === "store" &&
							allBgmList.map((bgm) => (
								<div key={bgm.bgmNo} className="bgm-card">
									<div className="bgm-info">
										<div className="bgm-icon">{bgm.thumbnail ? <img src={bgm.thumbnail} alt={bgm.bgmTitle} /> : "🎵"}</div>
										<div className="bgm-details">
											<h3 className="bgm-title">{bgm.bgmTitle}</h3>
											<p className="bgm-artist">{bgm.artist}</p>
										</div>
									</div>
									<div className="bgm-actions">
										<span className="bgm-price">{bgm.price.toLocaleString()}P</span>
										{isPurchased(bgm) ? (
											<button className="purchased-button" disabled>
												구매완료
											</button>
										) : (
											<button className="purchase-button" onClick={() => handlePurchase(bgm)}>
												구매하기
											</button>
										)}
									</div>
								</div>
							))}

						{activeTab === "mylist" &&
							(purchasedBgmList.length > 0 ? (
								purchasedBgmList.map((bgm) => (
									<div key={bgm.bgmNo} className="bgm-card purchased">
										<div className="bgm-info">
											<div className="bgm-icon">{bgm.thumbnail ? <img src={bgm.thumbnail} alt={bgm.bgmTitle} /> : "🎵"}</div>
											<div className="bgm-details">
												<h3 className="bgm-title">{bgm.bgmTitle}</h3>
												<p className="bgm-artist">{bgm.artist}</p>
											</div>
										</div>
										<div className="bgm-actions">
											<button className="play-button" onClick={() => playFromMyList(bgm)}>
												재생
											</button>
										</div>
									</div>
								))
							) : (
								<div className="empty-list">
									<p>구매한 BGM이 없습니다.</p>
									<button onClick={() => setActiveTab("store")}>BGM 둘러보기</button>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default BgmStoreView;
