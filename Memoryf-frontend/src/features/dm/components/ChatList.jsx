import { Plus } from 'lucide-react';
import './ChatList.css';

export default function ChatList({ chats, onSelectChat, onOpenSearch, theme }) {
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 flex flex-col overflow-hidden chat-list">
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <h1 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>DM</h1>
        <button 
          onClick={onOpenSearch}
          className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} flex items-center justify-center transition-colors`}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors flex items-center gap-3`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white flex-shrink-0">
              {chat.avatar}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{chat.userName}</h3>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate ${chat.isPending ? 'italic' : ''}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center flex-shrink-0">
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