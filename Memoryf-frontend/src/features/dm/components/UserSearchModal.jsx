import { useState } from 'react';
import './UserSearchModal.css';

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AVAILABLE_USERS = [
  { userId: 'alex.park', userName: 'Alex Park' },
  { userId: 'sarah.lee', userName: 'Sarah Lee' },
  { userId: 'david.choi', userName: 'David Choi' },
  { userId: 'emma.jung', userName: 'Emma Jung' },
  { userId: 'michael.kang', userName: 'Michael Kang' },
  { userId: 'olivia.shin', userName: 'Olivia Shin' },
  { userId: 'james.yoon', userName: 'James Yoon' },
  { userId: 'sophia.han', userName: 'Sophia Han' }
];

export default function UserSearchModal({ onClose, onAddUser, existingUserIds }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = AVAILABLE_USERS.filter(
    user => 
      !existingUserIds.includes(user.userId) &&
      (user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.userId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 user-search-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl text-gray-900">새로운 대화</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <div className="text-gray-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사용자 검색..."
              className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? '검색 결과가 없습니다' : '사용 가능한 사용자가 없습니다'}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.userId}
                onClick={() => onAddUser(user)}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white">
                  👤
                </div>
                <div>
                  <h3 className="text-gray-900">{user.userName}</h3>
                  <p className="text-sm text-gray-500">@{user.userId}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}