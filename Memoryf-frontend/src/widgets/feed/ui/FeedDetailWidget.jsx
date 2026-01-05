import "./FeedDetailWidget.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { deleteFeed, useFeedDetail } from "../../../features/feed";
import { useAuthorFollow } from "../../../features/follow";
import { StoryViewer, useStoryViewer } from "../../../features/story";

import { getMemberNoFromToken, useDisclosure, useKakaoMiniMap, emitFollowChange } from "../../../shared/lib";
import { getProfileImageUrl } from "../../../shared/api";

function FeedDetailWidget({ isModal = false, onEditFeed }) {
	const { feedNo } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const {
		feed,
		feedFiles,
		hasMultipleImages,
		loading,
		error,
		currentImageIndex,
		setCurrentImageIndex,
		comments,
		newComment,
		setNewComment,
		isLiked,
		likeCount,
		isBookmarked,
		getImageUrl,
		formatTimeAgo,
		renderTextWithTags,
		handlePrevImage,
		handleNextImage,
		handleSubmitComment,
		handleToggleLike,
		handleToggleBookmark,
		handleToggleCommentLike,
		handleDeleteComment,
	} = useFeedDetail(feedNo);
	const {
		isOpen: isMoreOpen,
		open: openMoreMenu,
		close: closeMoreMenu,
	} = useDisclosure(false);
	const { followStatus, toggleFollow, cancelFollowRequest } = useAuthorFollow(
		feed?.memberNo,
		{ targetMemberStatus: feed?.memberStatus }
	);
	const {
		isOpen: isCancelRequestModalOpen,
		open: openCancelRequestModal,
		close: closeCancelRequestModal,
	} = useDisclosure(false);

	// 미니 지도 미리보기
	const { showMap, setShowMap, mapElRef } = useKakaoMiniMap({
		lat: feed?.latitude,
		lng: feed?.longitude,
		enabledByDefault: false,
	});

	/* =========================
			스토리 뷰어 로직
	========================= */
	const {
		isOpen: isStoryViewerOpen,
		selectedStory,
		openStoryViewer,
		closeStoryViewer,
	} = useStoryViewer();

	// kakao map 렌더/갱신은 useKakaoMiniMap에서 처리

	const isOwner = (() => {
		const me = getMemberNoFromToken();
		return me && feed?.memberNo === me;
	})();

	const handleToggleFollowAuthor = async () => {
		const me = getMemberNoFromToken();
		const targetMemberNo = feed?.memberNo;
		if (!me || !targetMemberNo) return;

		const result = await toggleFollow();
		if (result?.needsCancelConfirm) {
			openCancelRequestModal();
			return;
		}

		if (result?.success) {
			emitFollowChange({
				targetMemberNo,
				actorMemberNo: me,
				status: result?.nextStatus,
			});
			return;
		}

		alert(result?.message || "팔로우 처리에 실패했습니다.");
	};

	const handleCancelFollowRequest = async () => {
		const me = getMemberNoFromToken();
		const targetMemberNo = feed?.memberNo;
		if (!me || !targetMemberNo) return;

		const result = await cancelFollowRequest();
		if (result?.success) {
			closeCancelRequestModal();
			emitFollowChange({
				targetMemberNo,
				actorMemberNo: me,
				status: null,
			});
			return;
		}

		alert(result?.message || "요청 취소에 실패했습니다.");
	};

	const handleClose = () => {
		if (isModal) {
			navigate(-1);
		}
	};

	const handleOverlayClick = (e) => {
		if (!isModal) return;
		if (e.target.classList.contains("feed-modal-overlay")) {
			handleClose();
		}
	};

	const handleDeleteCommentWithConfirm = async (commentNo) => {
		if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
		await handleDeleteComment(commentNo);
	};

	if (loading) {
		return (
			<div className={`feed-detail-page ${isModal ? "modal" : ""}`}>
				<div className="loading">로딩 중...</div>
			</div>
		);
	}

	if (error || !feed) {
		return (
			<div className={`feed-detail-page ${isModal ? "modal" : ""}`}>
				<div className="error">{error || "피드를 찾을 수 없습니다."}</div>
			</div>
		);
	}

	return (
		<div className={isModal ? "feed-modal-overlay" : ""} onClick={handleOverlayClick}>
			<div
				className={`feed-detail-page ${isModal ? "modal" : ""}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="feed-detail-container">
					<div className="feed-detail-image-section">
						{feedFiles.length > 0 ? (
							<div className="feed-image-carousel">
								{hasMultipleImages && (
									<button
										className="carousel-btn carousel-btn-prev"
										onClick={handlePrevImage}
										aria-label="이전 이미지"
									>
										‹
									</button>
								)}

								<div className="carousel-image-wrapper">
									{(() => {
										const fileUrl = getImageUrl(feedFiles[currentImageIndex]?.filePath);
										const isVideo = ["mp4", "webm", "ogg", "mov", "avi"].includes(
											fileUrl.split(".").pop().toLowerCase()
										);

									return isVideo ? (
										<>
											<video
												src={fileUrl}
												className="carousel-image-blur"
												muted
												loop
												autoPlay
											/>
											<video
												src={fileUrl}
												className="carousel-image"
												controls
												autoPlay
												muted
												loop
											/>
										</>
									) : (
										<img
											src={fileUrl}
											alt={feed.content || `피드 이미지 ${currentImageIndex + 1}`}
											className="carousel-image"
										/>
									);
									})()}
								</div>

								{hasMultipleImages && (
									<button
										className="carousel-btn carousel-btn-next"
										onClick={handleNextImage}
										aria-label="다음 이미지"
									>
										›
									</button>
								)}

								{hasMultipleImages && (
									<div className="carousel-indicators">
										{feedFiles.map((_, index) => (
											<button
												key={index}
												className={`carousel-indicator ${index === currentImageIndex ? "active" : ""}`}
												onClick={() => setCurrentImageIndex(index)}
												aria-label={`이미지 ${index + 1}로 이동`}
											/>
										))}
									</div>
								)}
							</div>
						) : (
							<div className="feed-no-image">
								<p>이미지가 없습니다</p>
							</div>
						)}
					</div>

					<div className="feed-detail-content-section">
						<div className="feed-detail-header">
							<div className="feed-detail-author-row">
								<div
									className="feed-detail-author clickable"
									onClick={() => {
										if (feed?.memberStatus === "Y") return;
										if (feed?.hasStory) {
											openStoryViewer(feed.memberNo);
										} else if (feed?.memberNick) {
											navigate(`/${encodeURIComponent(feed.memberNick)}`);
										}
									}}
									style={{ cursor: feed?.memberStatus === "Y" ? "default" : "pointer" }}
								>
									{(() => {
										const hasStory = feed?.hasStory;
										const hasUnreadStory = feed?.hasUnreadStory;
										const content =
											feed?.memberStatus === "Y" ? (
												<div className="author-avatar" style={{ display: "flex" }}>
													👤
												</div>
											) : feed?.profileImage ? (
												<>
													<img
														src={getProfileImageUrl(feed.profileImage)}
														alt="프로필"
														className="author-avatar-img"
														onError={(e) => {
															e.target.style.display = "none";
															e.target.nextSibling.style.display = "flex";
														}}
													/>
													<div className="author-avatar" style={{ display: "none" }}>
														👤
													</div>
												</>
											) : (
												<div className="author-avatar" style={{ display: "flex" }}>
													👤
												</div>
											);

									return hasStory ? (
										<div className={`story-ring-container ${hasUnreadStory ? "" : "read"}`}>
											{content}
										</div>
									) : (
										content
									);
									})()}
									<span className="author-nick">
										{feed?.memberStatus === "Y" ? "deletedUser" : feed?.memberNick || "익명"}
									</span>
								</div>

								{!isOwner && feed?.memberStatus !== "Y" && (
									<button type="button" className="follow-text-btn" onClick={handleToggleFollowAuthor}>
										{followStatus === "Y" ? "팔로잉" : followStatus === "P" ? "요청됨" : "팔로우"}
									</button>
								)}
							</div>
							{isModal && (
								<button
									className="feed-header-menu-btn"
									aria-label="더보기"
									type="button"
									onClick={openMoreMenu}
								>
									⋯
								</button>
							)}
						</div>

						<div className="feed-detail-comments">
							<div className="feed-detail-content-item">
								<div
									className="comment-author-profile clickable"
									onClick={() => {
										if (feed?.memberStatus === "Y") return;
										if (feed?.hasStory) {
											openStoryViewer(feed.memberNo);
										} else if (feed?.memberNick) {
											navigate(`/${encodeURIComponent(feed.memberNick)}`);
										}
									}}
									style={{ cursor: feed?.memberStatus === "Y" ? "default" : "pointer" }}
								>
									{(() => {
										const hasStory = feed?.hasStory;
										const hasUnreadStory = feed?.hasUnreadStory;
										const content =
											feed?.memberStatus === "Y" ? (
												<div className="comment-avatar" style={{ display: "flex" }}>
													👤
												</div>
											) : feed?.profileImage ? (
												<>
													<img
														src={getProfileImageUrl(feed.profileImage)}
														alt="프로필"
														className="comment-avatar-img"
														onError={(e) => {
															e.target.style.display = "none";
															e.target.nextSibling.style.display = "flex";
														}}
													/>
													<div className="comment-avatar" style={{ display: "none" }}>
														👤
													</div>
												</>
											) : (
												<div className="comment-avatar" style={{ display: "flex" }}>
													👤
												</div>
											);

									return hasStory ? (
										<div className={`story-ring-container ${hasUnreadStory ? "" : "read"}`}>
											{content}
										</div>
									) : (
										content
									);
									})()}
								</div>
								<div className="comment-content-wrapper">
									<div className="feed-main-text">
										<span
											className="comment-author-name clickable"
											onClick={() =>
												feed?.memberNick &&
												feed?.memberStatus !== "Y" &&
												navigate(`/${encodeURIComponent(feed.memberNick)}`)
										}
										style={{ cursor: feed?.memberStatus === "Y" ? "default" : "pointer" }}
									>
										{feed?.memberStatus === "Y" ? "deletedUser" : feed?.memberNick || "익명"}
									</span>
										<span className="comment-text-inline">{feed?.content ? renderTextWithTags(feed.content) : ""}</span>
									</div>
									<div className="comment-time">{feed?.createdDate ? formatTimeAgo(feed.createdDate) : ""}</div>

									{feed?.latitude && feed?.longitude && (
										<>
											<div
												className="feed-location"
												style={{ cursor: "pointer", userSelect: "none" }}
												onClick={() => setShowMap((prev) => !prev)}
											>
												📍 {feed?.locationName || "위치"} {showMap ? "▲" : "▼"}
											</div>

											{showMap && (
												<>
													<div
														ref={mapElRef}
														style={{
															width: "100%",
															height: "220px",
															borderRadius: "12px",
															overflow: "hidden",
															marginTop: "8px",
														}}
													/>

													<button
														type="button"
														style={{
															marginTop: "6px",
															background: "none",
															border: "none",
															color: "#3897f0",
															cursor: "pointer",
															padding: 0,
														}}
														onClick={() => {
															const name = encodeURIComponent(feed?.locationName || "위치");
															window.open(
																`https://map.kakao.com/link/to/${name},${feed.latitude},${feed.longitude}`,
																"_blank"
															);
														}}
													>
														카카오맵으로 열기
													</button>
												</>
											)}
										</>
									)}
								</div>
							</div>

							<div className="comments-list">
								{comments.length === 0 ? (
									<div className="comments-placeholder">
										<p className="no-comments-bold">아직 댓글이 없습니다</p>
										<p className="no-comments-sub">댓글을 남겨주세요</p>
									</div>
								) : (
									comments.map((comment) => (
										<div key={comment.commentNo} className="feed-detail-content-item comment-item">
											<div
												className="comment-author-profile clickable"
												onClick={() => {
													if (comment?.writerStatus === "Y") return;
													if (comment?.hasStory) {
														openStoryViewer(comment.writer);
													} else if (comment?.writerNick) {
														navigate(`/${encodeURIComponent(comment.writerNick)}`);
													}
												}}
												style={{ cursor: comment?.writerStatus === "Y" ? "default" : "pointer" }}
											>
												{(() => {
													const hasStory = comment?.hasStory;
													const hasUnreadStory = comment?.hasUnreadStory;
													const content =
														comment?.writerStatus === "Y" ? (
															<div className="comment-avatar" style={{ display: "flex" }}>
																👤
															</div>
														) : comment.writerProfileImage ? (
															<>
																<img
																	src={getProfileImageUrl(comment.writerProfileImage)}
																	alt="프로필"
																	className="comment-avatar-img"
																	onError={(e) => {
																	e.target.style.display = "none";
																	e.target.nextSibling.style.display = "flex";
																}}
																/>
																<div className="comment-avatar" style={{ display: "none" }}>
																	👤
																</div>
															</>
														) : (
															<div className="comment-avatar" style={{ display: "flex" }}>
																👤
															</div>
														);
													return hasStory ? (
														<div className={`story-ring-container ${hasUnreadStory ? "" : "read"}`}>
															{content}
														</div>
													) : (
														content
													);
												})()}
											</div>
											<div className="comment-content-wrapper">
												<div className="feed-main-text">
													<span
														className="comment-author-name clickable"
														onClick={() =>
															comment?.writerNick &&
															comment?.writerStatus !== "Y" &&
															navigate(`/${encodeURIComponent(comment.writerNick)}`)
													}
														style={{ cursor: comment?.writerStatus === "Y" ? "default" : "pointer" }}
													>
														{comment?.writerStatus === "Y" ? "deletedUser" : comment.writerNick}
													</span>
													<span className="comment-text-inline">{renderTextWithTags(comment.content)}</span>
												</div>
												<div className="comment-actions">
													<span className="comment-time">{comment.createDate ? formatTimeAgo(comment.createDate) : ""}</span>
													{comment.likeCount > 0 && <span className="comment-likes">좋아요 {comment.likeCount}개</span>}
													{getMemberNoFromToken() === comment.writer && (
														<button
															className="comment-delete-btn"
															onClick={() => handleDeleteCommentWithConfirm(comment.commentNo)}
														>
															삭제
														</button>
													)}
												</div>
											</div>
											<button
												className={`comment-like-btn ${Boolean(comment?.isLiked ?? comment?.liked) ? "liked" : ""}`}
												onClick={() => handleToggleCommentLike(comment.commentNo)}
												aria-label="댓글 좋아요"
											>
												<svg width="12" height="12" viewBox="0 0 24 24" strokeWidth="2">
													<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
												</svg>
											</button>
										</div>
									))
								)}
							</div>
						</div>

						<div className="feed-detail-actions">
							<div className="feed-actions-row">
								<div className="feed-actions-icons">
									<button className={`action-btn like-btn ${isLiked ? "liked" : ""}`} aria-label="좋아요" onClick={handleToggleLike}>
										<svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? "#ed4956" : "none"} stroke="currentColor" strokeWidth="2">
											<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
										</svg>
									</button>
									<button className="action-btn comment-btn" aria-label="댓글">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
										</svg>
									</button>
									<button className="action-btn share-btn" aria-label="공유">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
											<polyline points="16 6 12 2 8 6"></polyline>
											<line x1="12" y1="2" x2="12" y2="15"></line>
										</svg>
									</button>
								</div>
								<button className={`action-btn bookmark-btn ${isBookmarked ? "bookmarked" : ""}`} aria-label="북마크" onClick={handleToggleBookmark}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
										<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
									</svg>
								</button>
							</div>

							<div className="feed-stats">
								<span className="feed-like-count">좋아요 {likeCount}개</span>
								{likeCount === 0 && <p className="first-like-text">가장 먼저 좋아요를 눌러보세요</p>}
							</div>

							<span className="feed-time-ago">{feed?.createdDate ? formatTimeAgo(feed.createdDate) : ""}</span>

							<form className="comment-input-area" onSubmit={handleSubmitComment}>
								<input
									type="text"
									className="comment-input"
									placeholder="댓글 달기..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
								/>
								<button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
									게시
								</button>
							</form>
						</div>
					</div>
				</div>

				{isMoreOpen && (
					<div className="more-menu-overlay" onClick={closeMoreMenu}>
						<div className="more-menu-modal" onClick={(e) => e.stopPropagation()}>
							{isOwner ? (
								<>
									<button
										type="button"
										className="more-menu-item more-menu-danger"
										onClick={async () => {
											if (!window.confirm("이 피드를 삭제하시겠습니까?")) return;
											try {
												const res = await deleteFeed(feed.feedNo);
												if (res?.success) {
													alert("삭제되었습니다.");
													window.dispatchEvent(new Event("feedChanged"));
																	closeMoreMenu();
													navigate("/feeds");
												} else {
													alert(res?.message || "삭제에 실패했습니다.");
												}
											} catch (err) {
												alert("삭제 중 오류가 발생했습니다.");
											}
										}}
									>
										삭제
									</button>
									<button
										type="button"
										className="more-menu-item"
										onClick={() => {
											closeMoreMenu();
											if (onEditFeed) {
												onEditFeed(feed);
												handleClose();
											}
										}}
									>
										수정
									</button>
									<button
										type="button"
										className="more-menu-item"
										onClick={() => {
											const url = `${window.location.origin}/feeds/${feed.feedNo}`;
											if (navigator.clipboard?.writeText) {
												navigator.clipboard.writeText(url).catch(() => {});
											}
											closeMoreMenu();
										}}
									>
										링크 복사
									</button>
									<button type="button" className="more-menu-item more-menu-cancel" onClick={closeMoreMenu}>
										취소
									</button>
								</>
							) : (
								<>
									<button type="button" className="more-menu-item more-menu-danger">
										신고
									</button>
									<button
										type="button"
										className="more-menu-item"
										onClick={() => {
											const url = `${window.location.origin}/feeds/${feed.feedNo}`;
											if (navigator.clipboard?.writeText) {
												navigator.clipboard.writeText(url).catch(() => {});
											}
										closeMoreMenu();
										}}
									>
										링크 복사
									</button>
									<button type="button" className="more-menu-item more-menu-cancel" onClick={closeMoreMenu}>
										취소
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			{isCancelRequestModalOpen && (
				<div
					className="more-menu-overlay"
					onClick={closeCancelRequestModal}
					style={{ zIndex: 2000 }}
				>
					<div className="more-menu-modal" onClick={(e) => e.stopPropagation()}>
						<div
							className="more-menu-header"
							style={{
								padding: "20px",
								textAlign: "center",
								borderBottom: "1px solid #dbdbdb",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							{feed?.profileImage && (
								<img
									src={getProfileImageUrl(feed.profileImage)}
									alt="프로필"
									style={{
										width: "60px",
										height: "60px",
										borderRadius: "50%",
										marginBottom: "15px",
										objectFit: "cover",
									}}
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
							)}
							<div style={{ fontWeight: "600", fontSize: "16px" }}>팔로우 요청을 취소하시겠습니까?</div>
						</div>
						<button
							type="button"
							className="more-menu-item more-menu-danger"
							onClick={handleCancelFollowRequest}
							style={{ fontWeight: "bold" }}
						>
							팔로우 요청 취소
						</button>
						<button
							type="button"
							className="more-menu-item more-menu-cancel"
							onClick={closeCancelRequestModal}
						>
							취소
						</button>
					</div>
				</div>
			)}

			{isStoryViewerOpen && (
				<StoryViewer
					isOpen={isStoryViewerOpen}
					onClose={() => {
						closeStoryViewer();
						window.dispatchEvent(new Event("feedChanged"));
					}}
					selected={selectedStory}
				/>
			)}
		</div>
	);
}

export default FeedDetailWidget;
