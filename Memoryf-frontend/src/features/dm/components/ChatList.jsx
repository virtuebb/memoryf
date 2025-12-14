import React from 'react';
import { themes } from '../themes';
import { getChatListStyles } from '../styles/chatListStyles';

const DUMMY_CHATS = [
  { id: 1, name: 'Jenny Kim', message: '다음주에 콜라보 관련해서 이야기해요!', time: '오후 4:33', unread: 2, profileUrl: '/src/assets/images/profiles/bono.jpg' },
  { id: 2, name: '@cool_guy.99', message: '생일 축하해!🥳', time: '어제', unread: 0, profileUrl: '/src/assets/images/profiles/bono.jpg' },
  { id: 3, name: 'minji_luv', message: '카페는 다음주에 가요!', time: '1일 전', unread: 1, profileUrl: '/src/assets/images/profiles/bono.jpg' },
  { id: 4, name: 'travel.ha', message: '이탈리아 사진 너무 예뻐요.', time: '3일 전', unread: 0, profileUrl: '/src/assets/images/profiles/bono.jpg' },
];

const ChatListItem = ({ name, message, time, unreadCount, onClick, profileUrl, theme }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const styles = getChatListStyles(theme);

  return (
    <div 
      style={{ 
        ...styles.listItem, 
        ...(isHovered ? styles.listItemHover : {}) 
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={DUMMY_CHATS[0].profileUrl} alt={name} style={styles.profileImage} />
      <div style={styles.content}>
        <div style={styles.name}>{name}</div>
        <div style={styles.preview}>{message}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
        <div style={{ fontSize: '12px', color: '#AAAAAA' }}>{time}</div>
        {unreadCount > 0 && (
          <div style={styles.badge}>{unreadCount}</div>
        )}
      </div>
    </div>
  );
};

const ChatList = ({ onSelectChat, currentTheme, onThemeChange, onStartNewChat }) => {
  const styles = getChatListStyles(currentTheme);
  const [isComposing, setIsComposing] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (isComposing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isComposing]);

  const filteredFriends = DUMMY_CHATS.filter((chat) =>
    [chat.name, chat.message].some((field) => field.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelect = (chat) => {
    if (isComposing && onStartNewChat) {
      onStartNewChat(chat);
      setIsComposing(false);
      setQuery('');
    } else {
      onSelectChat(chat.id, chat.name);
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
      <div style={styles.list}>
        {(isComposing ? filteredFriends : DUMMY_CHATS).map(chat => (
          <ChatListItem 
            key={chat.id}
            name={chat.name}
            message={chat.message}
            time={chat.time}
            unreadCount={chat.unread}
            profileUrl={chat.profile}
            theme={currentTheme}
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