import "./HomeWidget.css";
import { useParams } from "react-router-dom";

import { useTheme } from "../../../shared/lib";
import { useHomeView } from "../../../features/home";

import { Storybar } from "../../../features/story";
import { FeedTabs, Guestbook, ProfileCard } from "../../../features/home";

function HomeWidget() {
	const { memberNo: memberNoParam, memberNick } = useParams();
	const { theme } = useTheme();
	const { homeNo, notFound, resolvedMemberNo, isOwner, canView } = useHomeView({ memberNoParam, memberNick });

	const handleCreateClick = () => {
		window.dispatchEvent(new Event("openFeedModal"));
	};

	return (
		<div className="home-wrapper" style={{ background: theme.color }}>
			<div className="home-scroll">
				<div className="home-layout">
					<main className="main">
						<div className="card card-story">
							<Storybar />
						</div>

						{notFound ? (
							<div className="card card-profile">
								<div style={{ padding: 16 }}>
									<strong>해당 사용자를 찾을 수 없습니다.</strong>
								</div>
							</div>
						) : (
							<>
								<div className="card card-profile">
									<ProfileCard memberNo={resolvedMemberNo} isOwner={isOwner} />
								</div>

								{canView ? (
									<>
										{/* 🔥 핵심: homeNo + 홈 주인 번호 전달 */}
										{homeNo && resolvedMemberNo && (
											<div className="card card-guestbook">
												<Guestbook homeNo={homeNo} homeOwnerMemberNo={resolvedMemberNo} />
											</div>
										)}

										<div className="feed-section">
											<FeedTabs memberNo={resolvedMemberNo} isOwner={isOwner} onCreateClick={handleCreateClick} />
										</div>
									</>
								) : (
									<div className="card private-account-msg" style={{ padding: "40px", textAlign: "center" }}>
										<div className="lock-icon" style={{ fontSize: "48px", marginBottom: "16px" }}>
											🔒
										</div>
										<h3 style={{ margin: "0 0 8px 0" }}>비공개 계정입니다</h3>
										<p style={{ color: "#888", margin: 0 }}>사진과 동영상을 보려면 팔로우하세요.</p>
									</div>
								)}
							</>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}

export default HomeWidget;
