/**
 * 💬 WebSocket 채팅 컴포넌트 (테스트/예제용)
 * 
 * 🎯 이 파일이 하는 일:
 *    - SockJS + STOMP를 사용한 WebSocket 연결
 *    - 1:1 실시간 메시지 송수신
 *    - 백엔드 연동 테스트용 컴포넌트
 * 
 * 📦 사용법:
 *    import Chat from './Chat';
 *    <Chat />
 * 
 * 🔌 백엔드 연동:
 *    - WebSocket 엔드포인트: http://localhost:8006/memoryf/ws
 *    - 메시지 구독: /sub/private/{userId}
 *    - 메시지 발행: /pub/chat/private
 * 
 * 🌐 CORS 설정:
 *    - 백엔드 WebSocketConfig.java에서 setAllowedOriginPatterns("*") 설정됨
 *    - 프록시 없이 직접 연결 가능
 * 
 * ⚠️ 주의: SockJS, STOMP 라이브러리 설치 필요
 *    npm install sockjs-client @stomp/stompjs
 */

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../shared/components/ThemeContext';
import * as SockJSModule from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../css/Chat.css';

// CommonJS/ESM 호환성 처리
const SockJS = SockJSModule.default || SockJSModule;

// 🌐 WebSocket 서버 URL 설정 (직접 연결 - CORS 허용됨)
// - 개발: 백엔드 직접 연결 (localhost:8006)
// - 배포: 환경변수 VITE_WS_URL 설정 (예: https://api.example.com/memoryf/ws)
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8006/memoryf/ws';

export default function Chat() {
  // 🎨 전역 테마 사용
  const { theme } = useTheme();
  const isDark = theme?.name === 'Night';
  const themeClass = isDark ? 'dark' : 'light';

  // 📦 상태 관리
  const [myId, setMyId] = useState('');           // 내 ID
  const [targetId, setTargetId] = useState('');   // 받는 사람 ID
  const [message, setMessage] = useState('');     // 보낼 메시지
  const [messages, setMessages] = useState([]);   // 채팅 메시지 목록
  const [isConnected, setIsConnected] = useState(false); // 연결 상태

  // 🔌 WebSocket 연결 객체 참조
  const stompClientRef = useRef(null);

  // 🧹 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate(); // v7: deactivate() 사용
      }
    };
  }, []);

  /**
   * 📡 서버에 WebSocket 연결
   */
  const connect = () => {
    // 이미 연결되어 있으면 무시
    if (isConnected) {
      addMessage('⚠️ 이미 연결되어 있습니다.', 'system');
      return;
    }

    // ID 검증
    if (!myId.trim()) {
      addMessage('⚠️ 내 ID를 입력하세요.', 'system');
      return;
    }

    addMessage(`📡 연결 시도: ${WS_URL}`, 'system');

    try {
      // @stomp/stompjs v7 방식 - Client 사용
      const stompClient = new Client({
        // SockJS를 사용한 WebSocket 팩토리, WebSocket 팩토리는 웹소켓을 사용하는 팩토리를 의미
        // WS_URL : http://localhost:8006/memoryf/ws 위에서 정의한 주소를 사용
        webSocketFactory: () => new SockJS(WS_URL),
        
        // 디버그 로그 (필요시 활성화)
        debug: (str) => {
          // console.log('STOMP:', str);
        },
        
        // 재연결 설정
        // 5초마다 재연결 시도
        reconnectDelay: 5000,
        
        // 연결 성공 시
        onConnect: () => {
          setIsConnected(true);
          // stompClientRef.current : WebSocket 연결 객체 참조
          // stompClient : WebSocket 연결 객체
          stompClientRef.current = stompClient;
          addMessage(`✅ [${myId}] 연결 성공`, 'system');
          // addMessage : 메시지 추가 함수

          // 내게 오는 메시지 구독
          stompClient.subscribe(`/sub/private/${myId}`, (msg) => {
            const data = JSON.parse(msg.body);
            // JSON.parse : 문자열을 JSON 객체로 변환
            // data : { sender: 'user1', content: '안녕하세요' }
            addMessage(`${data.sender} → 나 : ${data.content}`, 'received');
          });
        },
        
        // 연결 실패 시
        onStompError: (frame) => {
          console.error('STOMP 에러:', frame.headers['message']);
          addMessage('❌ STOMP 연결 에러', 'system');
        },
        
        // WebSocket 에러
        onWebSocketError: (event) => {
          console.error('WebSocket 에러:', event);
          addMessage('❌ 연결 실패. 서버가 실행 중인지 확인하세요.', 'system');
        },
        
        // 연결 해제 시
        onDisconnect: () => {
          setIsConnected(false);
          addMessage('🔌 연결 해제됨', 'system');
        }
      });

      // 연결 시작
      stompClient.activate();
      
    } catch (error) {
      console.error('연결 오류:', error);
      addMessage(`❌ 연결 오류: ${error.message}`, 'system');
    }
  };

  /**
   * 🔌 연결 해제
   */
  const disconnect = () => {
    if (stompClientRef.current && isConnected) {
      // stompClientRef.current.deactivate() : WebSocket 연결 해제
      stompClientRef.current.deactivate(); // v7: deactivate() 사용

      // stompClientRef.current = null : WebSocket 연결 객체 초기화
      stompClientRef.current = null;

      // setIsConnected(false) : 연결 상태 업데이트
      setIsConnected(false);
    }
  };

  /**
   * 📤 1:1 메시지 보내기
   */
  const sendPrivateMessage = () => {
    if (!isConnected) {
      addMessage('⚠️ 먼저 연결하세요.', 'system');
      return;
    }

    if (!targetId.trim()) {
      addMessage('⚠️ 받는 사람 ID를 입력하세요.', 'system');
      return;
    }

    if (!message.trim()) {
      addMessage('⚠️ 메시지를 입력하세요.', 'system');
      return;
    }

    // STOMP로 메시지 전송 (v7: publish 사용)
    stompClientRef.current.publish({
      destination: '/pub/chat/private',
      body: JSON.stringify({
        roomId: targetId,
        sender: myId,
        content: message
      })
      // JSON.stringify : JSON 객체를 문자열로 변환
      // { roomId: 'user2', sender: 'user1', content: '안녕하세요' }
      // destination: '/pub/chat/private' : 서버로 메세지를 보내는 경로
    });

    // 내가 보낸 메시지 표시
    addMessage(`나 → ${targetId} : ${message}`, 'sent');
    setMessage(''); // 입력창 비우기
  };

  /**
   * 💬 메시지 목록에 추가
   */
  const addMessage = (text, type = 'normal') => {
    const newMessage = {
      id: Date.now(),
      text,
      type, // 'system', 'sent', 'received', 'normal'
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  /**
   * ⌨️ 엔터 키로 메시지 전송
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrivateMessage();
    }
  };

  // ============================================
  // 🎨 화면 그리기
  // ============================================
  return (
    <div className={`chat-test-container ${themeClass}`}>
      <div className={`chat-test-card ${themeClass}`}>
        {/* 📌 헤더 */}
        <div className={`chat-test-header ${themeClass}`}>
          <h2>🧪 WebSocket 채팅 테스트</h2>
          <span className={`chat-test-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 연결됨' : '🔴 연결 안됨'}
          </span>
        </div>

        {/* 📝 입력 영역 */}
        <div className={`chat-test-inputs ${themeClass}`}>
          <div className="chat-test-input-row">
            <input
              type="text"
              placeholder="내 ID (예: user1)"
              value={myId}
              onChange={(e) => setMyId(e.target.value)}
              disabled={isConnected}
              className={`chat-test-input ${themeClass}`}
            />
            <input
              type="text"
              placeholder="받는 사람 ID (예: user2)"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className={`chat-test-input ${themeClass}`}
            />
          </div>

          {/* 🔘 연결 버튼들 */}
          <div className="chat-test-buttons">
            <button
              onClick={connect}
              disabled={isConnected}
              className={`chat-test-btn connect ${themeClass}`}
            >
              🔗 연결
            </button>
            <button
              onClick={disconnect}
              disabled={!isConnected}
              className={`chat-test-btn disconnect ${themeClass}`}
            >
              🔌 연결 해제
            </button>
          </div>
        </div>

        {/* 💬 메시지 목록 */}
        <div className={`chat-test-messages ${themeClass}`}>
          {messages.length === 0 ? (
            <div className="chat-test-empty">
              연결 후 메시지가 여기 표시됩니다.
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`chat-test-message ${msg.type} ${themeClass}`}>
                <span className="chat-test-message-time">[{msg.time}]</span>
                <span className="chat-test-message-text">{msg.text}</span>
              </div>
            ))
          )}
        </div>

        {/* ✏️ 메시지 입력 */}
        <div className={`chat-test-send ${themeClass}`}>
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            className={`chat-test-input message ${themeClass}`}
          />
          <button
            onClick={sendPrivateMessage}
            disabled={!isConnected}
            className={`chat-test-btn send ${themeClass}`}
          >
            📤 보내기
          </button>
        </div>

        {/* 📖 사용 가이드 */}
        <div className={`chat-test-guide ${themeClass}`}>
          <h4>📖 사용 방법</h4>
          <ol>
            <li>백엔드 서버 실행 (Spring Boot)</li>
            <li>내 ID 입력 후 "연결" 클릭</li>
            <li>받는 사람 ID 입력</li>
            <li>메시지 입력 후 "보내기" 클릭</li>
          </ol>
          <p className="chat-test-note">
            ⚠️ 테스트하려면 두 개의 브라우저 탭을 열어서 각각 다른 ID로 연결하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

