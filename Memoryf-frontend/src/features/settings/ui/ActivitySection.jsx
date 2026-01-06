import { useActivitySection } from '../model';
import { getAssetUrl, getFeedUpfileUrl, getProfileImageUrl } from '../../../shared/api';
import '../css/ActivitySection.css';

function ActivitySection() {
	const {
		sidebarItems,
		tabs,
		years,
		months,
		days,
		activeSidebar,
		setActiveSidebar,
		activeTab,
		setActiveTab,
		items,
		historyItems,
		loading,
		isSelectionMode,
		selectedItems,
		filter,
		isModalOpen,
		setIsModalOpen,
		tempFilter,
		setTempFilter,
		dateSelection,
		handleOpenModal,
		handleApplyFilter,
		handleDateSelect,
		toggleSelectionMode,
		handleItemClick,
		handleActionSelected,
	} = useActivitySection();

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
                    // feedFiles가 없거나 비어있으면 null 반환
                    if (!feed.feedFiles || feed.feedFiles.length === 0) {
                      return null;
                    }
                    
                    const firstFile = feed.feedFiles[0];
                    let filePath = firstFile.filePath;
                    const savedName = firstFile.savedName || firstFile.changeName || firstFile.originName;
                    
                    // filePath가 이미 전체 경로인 경우 (파일명 포함)
                    if (filePath && savedName && filePath.includes(savedName)) {
                      return getAssetUrl(filePath) || null;
                    }
                    
                    // filePath와 savedName을 조합해야 하는 경우
                    if (!filePath || !savedName) {
                      return null;
                    }
                    
                    // filePath에 이미 '/'가 포함되어 있을 수 있음
                    const fullPath = filePath.endsWith('/') 
                      ? `${filePath}${savedName}` 
                      : `${filePath}/${savedName}`;
                    
                    return getAssetUrl(fullPath) || null;
                  };
                  
                  const imageUrl = getImageUrl();
                  const isVideo = imageUrl ? ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(
                    imageUrl.split('.').pop()?.toLowerCase()
                  ) : false;
                  const isSelected = selectedItems.has(feed.feedNo);

                  return (
                    <div 
                      key={feed.feedNo || `feed-${feed.feedNo || Math.random()}`} 
                      className={`activity-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(feed)}
                    >
                      {imageUrl ? (
                        isVideo ? (
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
                        )
                      ) : (
                        <div className="activity-item-placeholder">이미지 없음</div>
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
                items.map((comment, index) => {
                  // feedImage는 이미 전체 경로일 수 있음 (백엔드에서 FILE_PATH || '/' || SAVED_NAME)
                  let feedImageUrl = null;
                  if (comment.feedImage) {
                    // 백엔드에서 FILE_PATH || '/' || SAVED_NAME 형태로 반환
                    if (comment.feedImage.includes('/')) {
                      // 전체 경로인 경우
                      feedImageUrl = getAssetUrl(comment.feedImage);
                    } else {
                      // 파일명만 있는 경우 (이전 버전 호환)
                      feedImageUrl = getFeedUpfileUrl(comment.feedImage);
                    }
                  }
                  
                  const profileUrl = comment.writerProfileImage || comment.memberProfileImage
                    ? getProfileImageUrl(comment.writerProfileImage || comment.memberProfileImage)
                    : null;

                  const isSelected = selectedItems.has(comment.commentNo);

                  // 날짜 포맷팅
                  const formatDate = (dateString) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  };

                  return (
                    <div 
                      key={comment.commentNo || `comment-${index}`} 
                      className={`comment-activity-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(comment)}
                    >
                      <div className="comment-activity-left">
                        {profileUrl ? (
                          <img src={profileUrl} alt="profile" className="comment-profile-img" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="comment-profile-img comment-profile-placeholder">👤</div>
                        )}
                        <div className="comment-activity-info">
                          <div className="comment-header">
                            <span className="comment-nickname">{comment.writerNick || comment.memberNick || '알 수 없음'}</span>
                            <span className="comment-date">{formatDate(comment.createDate || comment.createdAt)}</span>
                          </div>
                          <div className="comment-content">{comment.content}</div>
                        </div>
                      </div>
                      <div className="comment-activity-right">
                        {feedImageUrl ? (
                          <img src={feedImageUrl} alt="feed" className="comment-feed-img" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="comment-feed-img comment-feed-placeholder">📷</div>
                        )}
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