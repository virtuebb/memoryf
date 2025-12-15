/**
 * ChatList.jsx - 채팅방 목록 컴포넌트
 * 
 * 이 컴포넌트는 모든 채팅방 목록을 보여주는 큰 상자예요!
 * 
 * 핵심 기능:
 * 1. 내가 대화 중인 모든 채팅방 목록을 보여줘요
 * 2. + 버튼을 누르면 친구를 검색해서 새 채팅방을 만들 수 있어요
 * 3. 친구 이름이나 메시지 내용으로 검색할 수 있어요
 * 4. 채팅방을 클릭하면 그 채팅방으로 이동해요
 * 5. 아래쪽에 테마 색상을 바꿀 수 있는 버튼들이 있어요
 */
import React from 'react';
import { themes } from '../themes';
import { getChatListStyles } from '../styles/chatListStyles';
import ChatListItem from './ChatListItem';

// 채팅방이 없는 친구 목록 (새로운 채팅방을 만들 수 있는 사람들)
// 이 친구들과는 아직 대화를 시작하지 않았어요
const DUMMY_FRIENDS = [
  { id: 5, name: 'new_friend_01', profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: false },
  { id: 6, name: 'sunny_day', profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: false },
  { id: 7, name: 'coffee_lover', profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: false },
];

/**
 * ChatList 컴포넌트
 * 
 * @param {Array} chats - 채팅방 목록 (페이지에서 전달받아요)
 * @param {Function} onSelectChat - 채팅방 선택 시 호출되는 함수
 * @param {Object} currentTheme - 현재 테마
 * @param {Function} onThemeChange - 테마 변경 시 호출되는 함수
 * @param {Function} onStartNewChat - 새 채팅방 시작 시 호출되는 함수
 */
const ChatList = ({ chats = [], onSelectChat, currentTheme, onThemeChange, onStartNewChat }) => {
  const styles = getChatListStyles(currentTheme);
  // 지금 새 채팅방을 만들려고 검색 중인지 확인하는 변수
  const [isComposing, setIsComposing] = React.useState(false);
  // 검색창에 입력한 텍스트를 저장하는 변수
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef(null);

  // 검색 모드가 켜지면 자동으로 검색창에 포커스를 줘요
  React.useEffect(() => {
    if (isComposing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isComposing]);

  // 검색할 때 기존 채팅방과 친구 목록을 모두 검색해요
  // chats는 페이지에서 전달받은 채팅방 목록이에요 (새로 만든 채팅방도 포함!)
  const allContacts = [...chats, ...DUMMY_FRIENDS];
  const filteredFriends = allContacts.filter((contact) => {
    const searchFields = [contact.name];
    if (contact.message) {
      searchFields.push(contact.message);
    }
    return searchFields.some((field) => field.toLowerCase().includes(query.toLowerCase()));
  });

  // 채팅방을 선택했을 때 실행되는 함수
  const handleSelect = (chat) => {
    if (isComposing) {
      // 검색 모드일 때는 항상 새로운 채팅방을 만들어요
      if (onStartNewChat) {
        onStartNewChat(chat);
      }
      setIsComposing(false);
      setQuery(''); // 검색창 비우기
    } else {
      // 일반 모드일 때는 기존 채팅방을 열어요
      if (chat.hasChatRoom) {
        onSelectChat(chat.id, chat.name);
      } else {
        // 채팅방이 없는 친구를 클릭해도 새 채팅방을 만들어요
        if (onStartNewChat) {
          onStartNewChat(chat);
        }
      }
    }
  };

  return (
    <div style={styles.chatListContainer}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div style={styles.title}>DM</div>
        <div style={styles.icon}>
          <span
            role="img"
            aria-label="new-message"
            onClick={() => setIsComposing(true)}
            style={{ cursor: 'pointer' }}
          >
            +
          </span>
        </div>
      </div>

      {isComposing && (
        <div style={styles.searchBar}>
          <input
            ref={inputRef}
            style={styles.searchInput}
            placeholder="친구 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button style={styles.searchCancel} onClick={() => { setIsComposing(false); setQuery(''); }}>
            닫기
          </button>
        </div>
      )}

      {/* 채팅 목록 */}
      {/* 검색 모드일 때는 검색 결과를, 일반 모드일 때는 채팅방 목록을 보여줘요 */}
      <div style={styles.list}>
        {(isComposing ? filteredFriends : chats).map(chat => (
          <ChatListItem 
            key={chat.id}
            name={chat.name}
            message={chat.message}
            time={chat.time}
            unreadCount={chat.unread}
            profileUrl={chat.profileUrl}
            theme={currentTheme}
            hasChatRoom={chat.hasChatRoom}
            onClick={() => handleSelect(chat)}
          />
        ))}
      </div>

      {/* 테마 선택 버튼 */}
      <div style={styles.themeSelector}>
        {Object.values(themes).map((theme) => (
          <button
            key={theme.hex}
            style={{
              ...styles.themeButton,
              backgroundColor: theme.primary,
              ...(currentTheme.hex === theme.hex ? styles.themeButtonActive : {}),
            }}
            onClick={() => onThemeChange(theme)}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;