import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLikedFeeds, getCommentedFeeds, toggleLike, getAccountHistory } from '../api/activityApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import '../css/ActivitySection.css';

function ActivitySection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSidebar, setActiveSidebar] = useState('interactions');
  const [activeTab, setActiveTab] = useState('likes');
  const [items, setItems] = useState([]); // Renamed from feeds to items
  const [historyItems, setHistoryItems] = useState([]); // 계정 내역 아이템
  const [loading, setLoading] = useState(false);
  
  // 선택 모드 및 선택된 아이템 (feedNo 또는 commentNo)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // 필터 상태
  const [filter, setFilter] = useState({
    sortBy: 'recent',
    startDate: '',
    endDate: ''
  });

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState({ ...filter });
  
  // 날짜 선택 상태 (모달용)
  const [dateSelection, setDateSelection] = useState({
    startYear: '', startMonth: '', startDay: '',
    endYear: '', endMonth: '', endDay: ''
  });

  const tokenMemberNo = getMemberNoFromToken();
  const memberNo = tokenMemberNo || localStorage.getItem('memberNo');

  const sidebarItems = [
    {
      id: 'interactions',
      icon: '⇄',
      title: '반응',
      desc: '좋아요, 댓글 및 회원님의 기타 반응을 검토하고 삭제합니다.'
    },
    {
      id: 'history',
      icon: '📅',
      title: '계정 내역',
      desc: '계정을 만든 이후 적용한 변경 사항을 검토해보세요.'
    }
  ];

  const tabs = [
    { id: 'likes', label: '좋아요', icon: '♡' },
    { id: 'comments', label: '댓글', icon: '💬' }
  ];

  // 날짜 옵션 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    if (!memberNo) {
      console.warn('회원 정보를 찾을 수 없어 활동/계정 내역을 불러오지 않습니다.');
      return;
    }

    if (activeSidebar === 'interactions') {
      fetchItems();
      // 탭 변경 시 선택 모드 초기화
      setIsSelectionMode(false);
      setSelectedItems(new Set());
    } else if (activeSidebar === 'history') {
      fetchHistory();
    }
  }, [activeSidebar, activeTab, filter, memberNo]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {
        memberNo,
        sortBy: filter.sortBy,
        startDate: filter.startDate,
        endDate: filter.endDate
      };

      let data;
      if (activeTab === 'likes') {
        data = await getLikedFeeds(params);
      } else {
        data = await getCommentedFeeds(params);
      }
      setItems(data.list || []);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!memberNo) return;
    setLoading(true);
    try {
      const params = {
        memberNo,
        sortBy: filter.sortBy === 'recent' ? 'newest' : 'oldest',
        startDate: filter.startDate,
        endDate: filter.endDate
      };
      const data = await getAccountHistory(params);
      setHistoryItems(data.list || []);
    } catch (error) {
      console.error('계정 내역 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setTempFilter({ ...filter });
    
    const parseDate = (dateStr, prefix) => {
      if (!dateStr) return { [`${prefix}Year`]: '', [`${prefix}Month`]: '', [`${prefix}Day`]: '' };
      const [y, m, d] = dateStr.split('-');
      return {
        [`${prefix}Year`]: parseInt(y),
        [`${prefix}Month`]: parseInt(m),
        [`${prefix}Day`]: parseInt(d)
      };
    };

    setDateSelection({
      ...parseDate(filter.startDate, 'start'),
      ...parseDate(filter.endDate, 'end')
    });

    setIsModalOpen(true);
  };

  const handleApplyFilter = () => {
    const formatDate = (y, m, d) => {
      if (!y || !m || !d) return '';
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    };

    const newStartDate = formatDate(dateSelection.startYear, dateSelection.startMonth, dateSelection.startDay);
    const newEndDate = formatDate(dateSelection.endYear, dateSelection.endMonth, dateSelection.endDay);

    setFilter({ 
      sortBy: tempFilter.sortBy,
      startDate: newStartDate,
      endDate: newEndDate
    });
    setIsModalOpen(false);
  };

  const handleDateSelect = (field, value) => {
    setDateSelection(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedItems(new Set());
    } else {
      setIsSelectionMode(true);
    }
  };

  const handleItemClick = (item) => {
    const itemId = activeTab === 'likes' ? item.feedNo : item.commentNo;

    if (isSelectionMode) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      setSelectedItems(newSelected);
    } else {
      // 상세 보기 모달 열기 (라우트 이동)
      navigate(`/feeds/${item.feedNo}`, { state: { backgroundLocation: location } });
    }
  };

  const handleActionSelected = async () => {
    if (selectedItems.size === 0) return;
    
    const actionName = activeTab === 'likes' ? '좋아요 취소' : '삭제';
    if (!window.confirm(`${selectedItems.size}개의 항목을 ${actionName}하시겠습니까?`)) return;

    try {
      const promises = Array.from(selectedItems).map(id => {
        if (activeTab === 'likes') {
          return toggleLike(id, memberNo);
        } else {
          // 댓글 삭제의 경우 feedNo도 필요함
          const comment = items.find(item => item.commentNo === id);
          if (comment) {
            return deleteComment(comment.feedNo, id);
          }
          return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      fetchItems();
      setIsSelectionMode(false);
      setSelectedItems(new Set());
    } catch (error) {
      console.error('작업 처리 실패:', error);
      alert('일부 작업을 처리하는 중 오류가 발생했습니다.');
    }
  };

  const renderContent = () => {
    if (activeSidebar === 'interactions') {
      return (
        <>
          <div className="activity-tabs">
            {tabs.map(tab => (
              <div 
                key={tab.id} 
                className={`activity-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={{ marginRight: '6px' }}>{tab.icon}</span>
                {tab.label}
              </div>
            ))}
          </div>

          <div className="activity-filter-bar">
            <div className="filter-left">
              <span className="sort-label">
                {filter.sortBy === 'recent' ? '최신순' : '오래된 순'}
              </span>
              <button className="sort-btn" onClick={handleOpenModal}>정렬 및 필터</button>
            </div>
            <button className="select-btn" onClick={toggleSelectionMode}>
              {isSelectionMode ? '취소' : '선택'}
            </button>
          </div>

          {activeTab === 'likes' ? (
            <div className="activity-grid">
              {loading ? (
                <div className="loading-state">로딩 중...</div>
              ) : items.length > 0 ? (
                items.map(feed => {
                  // 이미지 URL 추출 (FeedItem 로직과 동일)
                  const getImageUrl = () => {
                    if (!feed.feedFiles || feed.feedFiles.length === 0) {
                      return 'https://via.placeholder.com/300?text=No+Image';
                    }
                    
                    const filePath = feed.feedFiles[0].filePath;
                    
                    // 절대 URL이면 그대로 사용
                    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                      return filePath;
                    }
                    
                    // 상대 경로면 백엔드 서버 URL과 결합
                    if (filePath.startsWith('/')) {
                      return `http://localhost:8006/memoryf${filePath}`;
                    }
                    
                    // 그 외의 경우 그대로 사용
                    return filePath;
                  };
                  
                  const imageUrl = getImageUrl();
                  const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(
                    imageUrl.split('.').pop()?.toLowerCase()
                  );
                  const isSelected = selectedItems.has(feed.feedNo);

                  return (
                    <div 
                      key={feed.feedNo} 
                      className={`activity-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(feed)}
                    >
                      {isVideo ? (
                        <>
                          <video 
                            src={`${imageUrl}#t=1.0`} 
                            className="activity-video-blur" 
                            muted 
                            loop 
                            preload="metadata"
                          />
                          <video 
                            src={`${imageUrl}#t=1.0`} 
                            className="activity-video" 
                            muted 
                            loop 
                            preload="metadata"
                          />
                        </>
                      ) : (
                        <img src={imageUrl} alt="feed" />
                      )}
                      {isSelectionMode && (
                        <div className={`selection-overlay ${isSelected ? 'active' : ''}`}>
                          <div className="check-circle">
                            {isSelected && <span className="check-mark">✓</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <p>내역이 없습니다.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="activity-list">
              {loading ? (
                <div className="loading-state">로딩 중...</div>
              ) : items.length > 0 ? (
                items.map(comment => {
                  const feedImageUrl = comment.feedImage
                    ? `http://localhost:8006/memoryf/feed_upfiles/${comment.feedImage}`
                    : 'https://via.placeholder.com/100?text=No+Image';
                  
                  const profileUrl = comment.writerProfileImage
                    ? `http://localhost:8006/memoryf/profile_images/${comment.writerProfileImage}`
                    : '/assets/images/profiles/default-profile.png';

                  const isSelected = selectedItems.has(comment.commentNo);

                  // 날짜 포맷팅
                  const formatDate = (dateString) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  };

                  return (
                    <div 
                      key={comment.commentNo} 
                      className={`comment-activity-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(comment)}
                    >
                      <div className="comment-activity-left">
                        <img src={profileUrl} alt="profile" className="comment-profile-img" />
                        <div className="comment-activity-info">
                          <div className="comment-header">
                            <span className="comment-nickname">{comment.writerNick}</span>
                            <span className="comment-date">{formatDate(comment.createDate)}</span>
                          </div>
                          <div className="comment-content">{comment.content}</div>
                        </div>
                      </div>
                      <div className="comment-activity-right">
                        <img src={feedImageUrl} alt="feed" className="comment-feed-img" />
                      </div>
                      
                      {isSelectionMode && (
                        <div className={`selection-overlay-list ${isSelected ? 'active' : ''}`}>
                           <div className="check-circle-list">
                            {isSelected && <span className="check-mark">✓</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <p>내역이 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* 하단 선택 작업 바 */}
          {isSelectionMode && (
            <div className="selection-footer">
              <div className="selection-count">
                <button className="close-selection-btn" onClick={toggleSelectionMode}>✕</button>
                <span>{selectedItems.size}개 선택됨</span>
              </div>
              <button 
                className={`footer-action-btn ${selectedItems.size > 0 ? 'active' : ''}`}
                onClick={handleActionSelected}
                disabled={selectedItems.size === 0}
              >
                {activeTab === 'likes' ? '좋아요 취소' : '삭제'}
              </button>
            </div>
          )}
        </>
      );
    } else if (activeSidebar === 'history') {
      return (
        <>
          <div className="activity-content-header">
            <h2>계정 내역 정보</h2>
            <p className="activity-desc">계정을 만든 이후 변경한 사항을 검토해보세요.</p>
            <div className="activity-filters">
              <div className="sort-filter-btn" onClick={handleOpenModal}>
                {filter.sortBy === 'recent' ? '최신순' : '오래된 순'}
                <span className="filter-icon">⇅</span>
              </div>
              <button className="filter-btn" onClick={handleOpenModal}>정렬 및 필터</button>
            </div>
          </div>

          <div className="history-list">
            {loading ? (
              <div className="loading-state">로딩 중...</div>
            ) : historyItems.length > 0 ? (
              historyItems.map((item) => {
                const date = new Date(item.eventDate);
                const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                
                let icon = 'ℹ️';
                let title = '정보 변경';
                
                switch(item.eventType) {
                  case 'CREATE': icon = '🎉'; title = '계정 생성됨'; break;
                  case 'PASSWORD': icon = '🔒'; title = '비밀번호 변경'; break;
                  case 'NICKNAME': icon = '👤'; title = '닉네임 변경'; break;
                  case 'EMAIL': icon = '📧'; title = '이메일 변경'; break;
                  case 'BIO': icon = '📝'; title = '소개글 변경'; break;
                  case 'PRIVACY': icon = '👁️'; title = '공개 범위 변경'; break;
                  default: break;
                }

                return (
                  <div key={item.historyNo} className="history-item">
                    <div className="history-icon-wrapper">
                      <span className="history-icon">{icon}</span>
                    </div>
                    <div className="history-info">
                      <div className="history-title">{title}</div>
                      <div className="history-desc">{item.eventDesc}</div>
                      <div className="history-date">{dateStr}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <p>계정 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className="activity-container">
      {/* Left Sidebar */}
      <aside className="activity-sidebar">
        <div className="activity-sidebar-header">내 활동</div>
        <ul className="activity-menu">
          {sidebarItems.map(item => (
            <li 
              key={item.id} 
              className={`activity-menu-item ${activeSidebar === item.id ? 'active' : ''}`}
              onClick={() => setActiveSidebar(item.id)}
            >
              <div className="activity-menu-icon">{item.icon}</div>
              <div className="activity-menu-text">
                <span className="activity-menu-title">{item.title}</span>
                <span className="activity-menu-desc">{item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Right Content */}
      <section className="activity-content">
        {renderContent()}
      </section>

      {/* Filter Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>정렬 및 필터</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <div className="filter-modal-body">
              <div className="filter-section">
                <label>정렬 기준</label>
                <div className="sort-options">
                  <div 
                    className={`sort-radio-item ${tempFilter.sortBy === 'recent' ? 'selected' : ''}`}
                    onClick={() => setTempFilter(prev => ({ ...prev, sortBy: 'recent' }))}
                  >
                    <div className="radio-circle">
                      {tempFilter.sortBy === 'recent' && <div className="radio-inner" />}
                    </div>
                    <span>최신순</span>
                  </div>
                  <div 
                    className={`sort-radio-item ${tempFilter.sortBy === 'oldest' ? 'selected' : ''}`}
                    onClick={() => setTempFilter(prev => ({ ...prev, sortBy: 'oldest' }))}
                  >
                    <div className="radio-circle">
                      {tempFilter.sortBy === 'oldest' && <div className="radio-inner" />}
                    </div>
                    <span>오래된 순</span>
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <label>시작 날짜</label>
                <div className="date-selects">
                  <select 
                    value={dateSelection.startYear} 
                    onChange={(e) => handleDateSelect('startYear', e.target.value)}
                    className="date-select"
                  >
                    <option value="">연도</option>
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                  <select 
                    value={dateSelection.startMonth} 
                    onChange={(e) => handleDateSelect('startMonth', e.target.value)}
                    className="date-select"
                  >
                    <option value="">월</option>
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                  <select 
                    value={dateSelection.startDay} 
                    onChange={(e) => handleDateSelect('startDay', e.target.value)}
                    className="date-select"
                  >
                    <option value="">일</option>
                    {days.map(d => <option key={d} value={d}>{d}일</option>)}
                  </select>
                </div>
              </div>

              <div className="filter-section">
                <label>종료 날짜</label>
                <div className="date-selects">
                  <select 
                    value={dateSelection.endYear} 
                    onChange={(e) => handleDateSelect('endYear', e.target.value)}
                    className="date-select"
                  >
                    <option value="">연도</option>
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                  <select 
                    value={dateSelection.endMonth} 
                    onChange={(e) => handleDateSelect('endMonth', e.target.value)}
                    className="date-select"
                  >
                    <option value="">월</option>
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                  <select 
                    value={dateSelection.endDay} 
                    onChange={(e) => handleDateSelect('endDay', e.target.value)}
                    className="date-select"
                  >
                    <option value="">일</option>
                    {days.map(d => <option key={d} value={d}>{d}일</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="apply-btn" onClick={handleApplyFilter}>적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivitySection;