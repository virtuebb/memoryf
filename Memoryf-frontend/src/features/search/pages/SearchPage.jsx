import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMembers, searchFeedsByTag } from '../api/searchApi';
import FeedItem from '../../feed/components/FeedItem';
import defaultProfileImg from '../../../assets/images/profiles/default-profile.svg';
import '../css/SearchPage.css';

function SearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('account'); // 'account' | 'tag'
  const [members, setMembers] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  // 검색 실행 함수
  const executeSearch = useCallback(async (searchKeyword) => {
    if (!searchKeyword.trim()) {
      setMembers([]);
      setFeeds([]);
      return;
    }

    setLoading(true);
    try {
      // '#'으로 시작하면 태그 검색
      if (searchKeyword.startsWith('#')) {
        setSearchType('tag');
        
        // DB에는 태그가 '#' 없이 저장되어 있으므로(예: "피자, 맛집"), '#'을 제거하고 검색해야 함
        const tagKeyword = searchKeyword.substring(1);
        
        // '#'만 입력된 경우 검색하지 않음
        if (!tagKeyword.trim()) {
          setFeeds([]);
          setLoading(false);
          return;
        }

        const data = await searchFeedsByTag(tagKeyword);
        setFeeds(data);
        setMembers([]); // 태그 검색 시 회원 목록 초기화
      } else {
        // 그 외에는 계정(닉네임) 검색
        setSearchType('account');
        const data = await searchMembers(searchKeyword);
        setMembers(data);
        setFeeds([]); // 계정 검색 시 피드 목록 초기화
      }
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 키워드 변경 시 검색 (디바운싱 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(keyword);
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [keyword, executeSearch]);

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
            {searchType === 'account' && keyword && !keyword.startsWith('#') && (
              <div className="search-result-list">
                {members.length > 0 ? (
                  members.map((member) => (
                    <div 
                      key={member.memberNo} 
                      className="search-member-item"
                      onClick={() => navigate(`/${member.memberNick}`)}
                    >
                      <img
                        src={member.profileImage ? `http://localhost:8006/memoryf/profile_images/${member.profileImage}` : defaultProfileImg}
                        alt={member.memberNick}
                        className="search-member-avatar"
                        onError={(e) => {e.target.src = defaultProfileImg}}
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

            {searchType === 'tag' && keyword && keyword.startsWith('#') && (
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
            
            {!keyword && (
              <div className="no-result">
                검색어를 입력하세요.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;

