/**
 * 🔍 사용자 검색 모달 컴포넌트
 * 
 * 🎯 이 파일이 하는 일:
 *    - 새로운 채팅을 시작할 사용자 검색
 *    - 검색 결과에서 사용자 선택하면 채팅 시작
 * 
 * 📦 부모(DmRoutes)에서 받는 데이터:
 *    - onClose: 모달 닫기 함수
 *    - onAddUser: 사용자 선택 시 실행할 함수
 *    - existingUserIds: 이미 채팅 중인 사용자 ID 목록 (중복 방지)
 * 
 * 🔌 백엔드 연동 시 필요한 API:
 *    GET /api/users/search?query=검색어
 *    Response: [
 *      { userId: 'jenny.kim', userName: 'Jenny Kim', avatarUrl: '...' },
 *      ...
 *    ]
 */

// ============================================
// 📌 더미 데이터 (백엔드 연동 전 테스트용)
// 🔌 백엔드 연동 시 이 부분 삭제하고 API에서 가져오기!
// ============================================
import { useState, useEffect } from 'react';
import { useDm } from '../context/DmContext';
import { getFollowingList } from '../../../entities/user';
import { getMemberNoFromToken } from '../../../shared/lib';
import defaultProfileImg from '../../../assets/images/profiles/default-profile.svg';
import { getProfileImageUrl } from '../../../shared/api';
import '../css/UserSearchModal.css';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="user-search-modal-search-icon">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 🧪 테스트용 사용자 목록 (팔로우 관계 대체)
// 📌 실제 서비스에서는 백엔드 API에서 팔로우 목록을 가져옴
// const AVAILABLE_USERS = [
//   { userId: 'test1', userName: '테스트1' },
//   { userId: 'test2', userName: '테스트2' },
//   { userId: 'test3', userName: '테스트3' },
//   { userId: 'qwer', userName: 'qwer' },
//   { userId: 'asdf', userName: 'asdf' },
//   { userId: 'alex.park', userName: 'Alex Park' },
//   { userId: 'sarah.lee', userName: 'Sarah Lee' },
//   { userId: 'david.choi', userName: 'David Choi' },
// ];

export default function UserSearchModal({ onClose, onAddUser, existingUserIds }) {
  // 🔍 검색어 저장
  const [searchQuery, setSearchQuery] = useState('');
  
  // 👤 현재 로그인한 사용자 ID (자기 자신 제외용)
  const { myUserId } = useDm();
  
  // 📋 팔로우 목록 저장
  const [followingUsers, setFollowingUsers] = useState([]);
  
  // ⏳ 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  
  // 📋 검색 결과 저장 (백엔드 연동 시 사용)
  // const [searchResults, setSearchResults] = useState([]);
  
  // ⏳ 로딩 상태 (백엔드 연동 시 사용)
  // const [isLoading, setIsLoading] = useState(false);

  // 팔로우 목록 가져오기
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      const memberNo = getMemberNoFromToken();
      if (!memberNo) return;
      
      setIsLoading(true);
      try {
        const response = await getFollowingList(memberNo);
        console.log('팔로우 목록 응답:', response);

        const payload = response?.data ?? response;
        const users = payload?.content || payload?.list || payload?.data || payload || [];
        console.log('사용자 목록:', users);
        // 사용자 객체를 { userId, userName, profileImg } 형식으로 변환
        const formattedUsers = users.map(user => {
          console.log('개별 사용자:', user);
          return {
            userId: user.memberId || String(user.memberNo || ''),
            userName: user.memberName || '',
            userNick: user.memberNick,
            profileImg: user.profileChangeName
          };
        });
        console.log('포맷된 사용자 목록:', formattedUsers);
        setFollowingUsers(formattedUsers);
      } catch (error) {
        console.error('팔로우 목록 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFollowingUsers();
  }, []);

  // 📋 검색 결과 필터링 (팔로우 목록 기반)
  // 🔌 백엔드 연동 시: filteredUsers → searchResults 사용
  const filteredUsers = followingUsers.filter(
    user => 
      // 🚫 자기 자신은 제외!
      (user.userId || '') !== myUserId &&
      // 이미 채팅 중인 사용자는 제외
      !existingUserIds.includes(user.userId || '') &&
      // 검색어와 이름 또는 아이디가 일치하는 사용자만 표시
      ((user.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
       (user.userId || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ============================================
  // 🎨 화면 그리기
  // ============================================
  return (
    <div className="user-search-modal">
      <div className="user-search-modal-content">
        {/* ====================================== */}
        {/* 📌 헤더: 제목 + 닫기 버튼 */}
        {/* ====================================== */}
        <div className="user-search-modal-header">
          <h2 className="user-search-modal-title">새로운 대화</h2>
          
          {/* ✖️ 닫기 버튼 */}
          <button onClick={onClose} className="user-search-modal-close-btn">
            <CloseIcon />
          </button>
        </div>

        {/* ====================================== */}
        {/* 🔍 검색 입력창 */}
        {/* ====================================== */}
        <div className="user-search-modal-search">
          <div className="user-search-modal-search-wrapper">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사용자 검색..."
              className="user-search-modal-search-input"
              autoFocus  // 모달 열리면 자동으로 입력창에 포커스
            />
          </div>
        </div>

        {/* ====================================== */}
        {/* 📋 검색 결과 목록 */}
        {/* ====================================== */}
        <div className="user-search-modal-list">
          {/* 🔌 백엔드 연동 시 로딩 표시: */}
          {isLoading && <div className="user-search-modal-loading">로딩 중...</div>}
          
          {/* 검색 결과가 없으면 안내 문구 표시 */}
          {filteredUsers.length === 0 && !isLoading ? (
            <div className="user-search-modal-empty">
              {searchQuery ? '검색 결과가 없습니다' : '팔로우 중인 사용자가 없습니다'}
            </div>
          ) : (
            /* 🔄 검색된 사용자들 표시 */
            filteredUsers.map((user) => (
              <div
                key={user.userId || user.userName || Math.random()}
                onClick={() => onAddUser(user)}  // 클릭하면 이 사용자와 채팅 시작
                className="user-search-modal-item"
              >
                {/* 👤 프로필 사진 */}
                <div className="user-search-modal-avatar">
                  <img
                    src={user.profileImg ? getProfileImageUrl(user.profileImg) : defaultProfileImg}
                    alt={user.userName}
                    onError={(e) => { e.target.src = defaultProfileImg; }}
                  />
                </div>
                
                {/* 사용자 정보 */}
                <div className="user-search-modal-user-info">
                  <h3 className="user-search-modal-user-name">{user.userName}({user.userNick})</h3>
                  <p className="user-search-modal-user-id">@{user.userId}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
