import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import './ChatRoom.css';

export default function ChatRoom({ chat, onBack, onSendMessage, theme }) {
  const [messageInput, setMessageInput] = useState('');
  const isDark = theme === 'dark';

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(chat.id, messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col chat-room">
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center gap-3`}>
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} flex items-center justify-center transition-colors`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
          {chat.avatar}
        </div>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{chat.userName}</h2>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {chat.isPending && chat.messages.length === 0 ? (
          <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-8`}>
            <p>메시지를 보내서 대화를 시작하세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
              >
                {message.isMine ? (
                  // 내 메시지: 시간 + 내용
                  <div className="flex items-end gap-2 max-w-[70%]">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>
                      {message.time}
                    </span>
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-sm">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  // 상대방 메시지: 내용 + 시간
                  <div className="flex items-end gap-2 max-w-[70%]">
                    <div className={`${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm`}>
                      {message.text}
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>
                      {message.time}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-4 py-2`}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className={`flex-1 ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} outline-none`}
          />
          <button
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              messageInput.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}