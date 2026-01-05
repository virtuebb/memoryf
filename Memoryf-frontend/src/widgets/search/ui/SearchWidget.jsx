import "./SearchWidget.css";
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../features/search';
import { FeedItem } from '../../../entities/feed';
import defaultProfileImg from '../../../assets/images/profiles/default-profile.svg';
import { getProfileImageUrl } from '../../../shared/api';

function SearchWidget() {
	const navigate = useNavigate();
	const { keyword, setKeyword, searchType, isTagKeyword, members, feeds, loading } = useSearch();

	return (
		<div className="search-container">
			<div className="search-header">
				<div className="search-input-wrapper">
					<svg
						className="search-icon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
					<input
						type="text"
						className="search-input"
						placeholder="검색"
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
				</div>
			</div>

			<div className="search-content">
				{loading ? (
					<div className="loading">검색 중...</div>
				) : (
					<>
						{searchType === 'account' && keyword && !isTagKeyword && (
							<div className="search-result-list">
								{members.length > 0 ? (
									members.map((member) => (
										<div
											key={member.memberNo}
											className="search-member-item"
											onClick={() => navigate(`/${member.memberNick}`)}
										>
											<img
												src={
													member.profileImage
														? getProfileImageUrl(member.profileImage)
														: defaultProfileImg
												}
												alt={member.memberNick}
												className="search-member-avatar"
												onError={(e) => {
													e.target.src = defaultProfileImg;
												}}
											/>
											<div className="search-member-info">
												<span className="search-member-nick">{member.memberNick}</span>
												<span className="search-member-name">{member.memberName}</span>
											</div>
										</div>
									))
								) : (
									<div className="no-result">검색 결과가 없습니다.</div>
								)}
							</div>
						)}

						{searchType === 'tag' && keyword && isTagKeyword && (
							<div className="search-feed-grid">
								{feeds.length > 0 ? (
									feeds.map((feed) => (
										<FeedItem key={feed.feedNo} feed={feed} isGrid={true} />
									))
								) : (
									<div className="no-result">검색 결과가 없습니다.</div>
								)}
							</div>
						)}

						{!keyword && <div className="no-result">검색어를 입력하세요.</div>}
					</>
				)}
			</div>
		</div>
	);
}

export default SearchWidget;
