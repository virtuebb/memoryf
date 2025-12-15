/**
 * ChatListItem.jsx - 채팅방 목록의 한 개 항목 컴포넌트
 * 
 * 이 컴포넌트는 채팅방 목록에서 한 사람의 채팅방을 나타내는 작은 카드예요!
 * 
 * 핵심 기능:
 * 1. 친구의 프로필 사진과 이름을 보여줘요
 * 2. 마지막 메시지 내용을 미리 보여줘요
 * 3. 읽지 않은 메시지가 있으면 빨간 뱃지로 개수를 보여줘요
 * 4. 마우스를 올리면 색이 변해서 클릭할 수 있다는 걸 알려줘요
 * 5. 채팅방이 없는 친구는 "새로운 채팅 시작하기"라고 표시해요
 */
import React from 'react';
import { getChatListStyles } from '../styles/chatListStyles';

const DUMMY_CHATS = [
  { id: 1, name: 'Jenny Kim', message: '다음주에 콜라보 관련해서 이야기해요!', time: '오후 4:33', unread: 2, profileUrl: '/src/assets/images/profiles/bono.jpg', hasChatRoom: true },
];

const ChatListItem = ({ name, message, time, unreadCount, onClick, profileUrl, theme, hasChatRoom }) => {
  // 마우스가 이 항목 위에 있는지 확인하는 변수
  const [isHovered, setIsHovered] = React.useState(false);
  const styles = getChatListStyles(theme);

  return (
    <div 
      style={{ 
        ...styles.listItem, 
        // 마우스를 올리면 색이 변해요 (호버 효과)
        ...(isHovered ? styles.listItemHover : {}) 
      }}
      onClick={onClick} // 클릭하면 채팅방이 열려요
      onMouseEnter={() => setIsHovered(true)} // 마우스가 들어오면
      onMouseLeave={() => setIsHovered(false)} // 마우스가 나가면
    >
      {/* 친구의 프로필 사진 */}
      <img src={profileUrl || DUMMY_CHATS[0].profileUrl} alt={name} style={styles.profileImage} />
      <div style={styles.content}>
        {/* 친구의 이름 */}
        <div style={styles.name}>{name}</div>
        {/* 채팅방이 있으면 마지막 메시지를 보여주고, 없으면 "새로운 채팅 시작하기"를 보여줘요 */}
        {hasChatRoom ? (
          <div style={styles.preview}>{message}</div>
        ) : (
          <div style={{ ...styles.preview, fontStyle: 'italic', color: '#888' }}>새로운 채팅 시작하기</div>
        )}
      </div>
      {/* 채팅방이 있을 때만 시간과 읽지 않은 메시지 개수를 보여줘요 */}
      {hasChatRoom && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <div style={{ fontSize: '12px', color: '#AAAAAA' }}>{time}</div>
          {unreadCount > 0 && (
            <div style={styles.badge}>{unreadCount}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatListItem;

