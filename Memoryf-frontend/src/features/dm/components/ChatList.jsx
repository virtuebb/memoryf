import './ChatList.css';

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChatList({ chats, onSelectChat, onOpenSearch, theme }) {
  const themeClass = theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="chat-list">
      {/* Header */}
      <div className={`chat-list-header ${themeClass}`}>
        <h1 className={`chat-list-title ${themeClass}`}>DM</h1>
        <button 
          onClick={onOpenSearch}
          className={`chat-list-add-btn ${themeClass}`}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Chat List */}
      <div className="chat-list-scroll">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item ${themeClass}`}
          >
            {/* Avatar */}
            <div className="chat-avatar">
              {chat.avatar}
            </div>

            {/* Chat Info */}
            <div className="chat-info">
              <div className="chat-info-row">
                <h3 className={`chat-username ${themeClass}`}>{chat.userName}</h3>
                <span className={`chat-time ${themeClass}`}>{chat.time}</span>
              </div>
              <div className="chat-preview-row">
                <p className={`chat-last-message ${themeClass} ${chat.isPending ? 'pending' : ''}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="chat-unread-badge">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
