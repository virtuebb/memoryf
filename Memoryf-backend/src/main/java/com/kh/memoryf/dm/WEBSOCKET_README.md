# 🔗 WebSocket 실시간 채팅 시스템 분석

## 📌 전체 구조도

```
클라이언트 (chat.html)
    ↓ WebSocket 연결
    ↓ /memoryf/ws (SockJS + STOMP)
    ↓
서버 (Spring Boot)
    ├─ WebSocketConfig (설정)
    ├─ StompHandler (연결 처리)
    ├─ DmController (메시지 라우팅)
    └─ Dm.java (데이터 모델)
```

---

## 🏗️ 1. WebSocketConfig.java (설정 클래스)

### 역할
웹소켓 통신의 전체 규칙을 정의하는 설정 클래스

### 주요 메서드 분석

#### 1️⃣ `registerStompEndpoints()` - 연결 포인트 등록
```java
registry.addEndpoint("/ws")
        .setAllowedOriginPatterns("*")  // 모든 도메인에서 연결 허용
        .withSockJS();                   // SockJS 폴백 지원
```

**의미:**
- **엔드포인트**: `/ws`라는 주소로 클라이언트가 연결 시도
- **CORS 허용**: `*`로 모든 도메인 허용 (보안 주의)
- **SockJS**: 웹소켓을 지원하지 않는 구형 브라우저도 사용 가능

**클라이언트 연결 방식:**
```javascript
const socket = new SockJS("/memoryf/ws");
// Context path(/memoryf) + 엔드포인트(/ws) = /memoryf/ws
```

---

#### 2️⃣ `configureMessageBroker()` - 메시지 흐름 설정
```java
registry.setApplicationDestinationPrefixes("/pub");  // 클라이언트 → 서버
registry.enableSimpleBroker("/sub", "/queue");       // 서버 → 클라이언트
registry.setUserDestinationPrefix("/user");          // 1:1 채팅 전용
```

**메시지 플로우 이해:**

| 방향 | 경로 | 설명 |
|------|------|------|
| **클라이언트 → 서버** | `/pub/...` | 클라이언트가 보낸 메시지 (DmController로 전송) |
| **서버 → 클라이언트** | `/sub/...` | 서버가 보내는 메시지 (클라이언트가 구독) |
| **1:1 메시지** | `/user/...` | 특정 사용자 개인 메시지 |

**예시 흐름:**
```
클라이언트 → /pub/chat/private (메시지 발신)
              ↓
        DmController에서 처리
              ↓
        /sub/private/{receiverId} (수신자에게 전달)
              ↓
        특정 클라이언트가 구독 중인 채널로 전송
```

---

#### 3️⃣ `configureClientInboundChannel()` - 수신 메시지 가로채기
```java
registration.interceptors(stompHandler);
```

**의미:** 클라이언트에서 들어오는 모든 메시지를 `StompHandler`를 통해 먼저 처리

---

## 👤 2. StompHandler.java (연결 처리 클래스)

### 역할
클라이언트 연결/연결해제 시점에서 사용자 정보를 처리

### 주요 메서드 분석

```java
@Override
public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
    
    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
        String login = accessor.getFirstNativeHeader("login");
        System.out.println("🔥 CONNECT login = " + login);
        
        if (login != null) {
            accessor.setUser(() -> login);  // 현재 사용자로 설정
        }
    }
    return message;
}
```

**실행 시점:**
1. 클라이언트가 연결 시도
2. `preSend()` 실행
3. 헤더에서 "login" 정보 추출
4. 그 사용자 정보를 Spring Security 사용자로 등록

**클라이언트에서 로그인 정보 전달:**
```javascript
const socket = new SockJS("/memoryf/ws");
stompClient = Stomp.over(socket);

stompClient.connect({
    login: "user1"  // 이 정보가 StompHandler에서 캡처됨
}, function() {
    console.log("연결 성공");
});
```

---

## 💬 3. DmController.java (메시지 처리 컨트롤러)

### 역할
클라이언트에서 보낸 메시지를 받아서 어디로 보낼지 결정

### 주요 메서드 분석

#### 1️⃣ `roomChat()` - 단체 채팅 (채팅방)
```java
@MessageMapping("/chat/room/{roomId}")  // /pub/chat/room/{roomId} 경로에서 받음
@SendTo("/sub/chat/room/{roomId}")      // /sub/chat/room/{roomId}로 즉시 브로드캐스트
public Dm roomChat(
        @DestinationVariable String roomId,
        Dm message) {
    return message;
}
```

**흐름:**
```
클라이언트 → /pub/chat/room/1
            ↓
        roomChat() 메서드 실행
            ↓
        @SendTo로 /sub/chat/room/1 구독자에게 즉시 전송
            ↓
        같은 채팅방 모든 사람에게 메시지 표시
```

**실행 코드:**
```javascript
// 채팅방 1에 메시지 보내기
stompClient.send("/pub/chat/room/1", {}, JSON.stringify({
    sender: "user1",
    content: "안녕하세요!"
}));

// 채팅방 1 구독 (메시지 수신)
stompClient.subscribe("/sub/chat/room/1", function(msg) {
    console.log("받은 메시지:", msg.body);
});
```

---

#### 2️⃣ `privateChat()` - 1:1 채팅 (직접 메시지)
```java
@MessageMapping("/chat/private")
public void privateChat(Dm message) {
    System.out.println("📨 메시지 수신: " + message.getContent() + " to " + message.getRoomId());
    messagingTemplate.convertAndSend(
            "/sub/private/" + message.getRoomId(),  // 받는 사람 ID
            message
    );
}
```

**흐름:**
```
클라이언트 (user1) → /pub/chat/private
                      {
                        roomId: "user2",      (받는 사람)
                        sender: "user1",      (보낸 사람)
                        content: "hi"         (메시지)
                      }
                      ↓
                  privateChat() 메서드
                      ↓
                  messagingTemplate.convertAndSend()
                      ↓
                  /sub/private/user2 (user2에게만 전송)
                      ↓
                  user2 화면에만 메시지 표시
```

**실행 코드:**
```javascript
// 1:1 메시지 발신
stompClient.send("/pub/chat/private", {}, JSON.stringify({
    roomId: "user2",        // 받는 사람 ID
    sender: "user1",        // 보낸 사람
    content: "비밀 메시지"
}));

// 내게 오는 1:1 메시지 구독
stompClient.subscribe("/sub/private/user1", function(msg) {
    const data = JSON.parse(msg.body);
    console.log(data.sender + "의 메시지:", data.content);
});
```

---

## 📦 4. Dm.java (데이터 모델 - VO)

```java
@Alias("dm")
@NoArgsConstructor @Setter @Getter @ToString
public class Dm {
    private String roomId;   // 받는 사람 ID (1:1 채팅) 또는 방 ID (단체)
    private String sender;   // 보낸 사람 이름
    private String content;  // 메시지 내용
}
```

**역할:** 
- 메시지를 JSON으로 직렬화/역직렬화 할 때 사용
- 클라이언트와 서버 간에 메시지 형식 통일

---

## 🔄 전체 통신 흐름 예시

### 시나리오: user1이 user2에게 "안녕" 전송

```
1️⃣ 클라이언트 (chat.html)
   - user1 입력 후 "연결" 버튼 클릭
   - WebSocket 연결 성공
   - /sub/private/user1 구독 (받을 메시지 대기)

2️⃣ 클라이언트 → 서버
   sendPrivate() 실행
   stompClient.send("/pub/chat/private", {}, JSON.stringify({
       roomId: "user2",
       sender: "user1",
       content: "안녕"
   }));

3️⃣ 서버 (Spring Boot)
   WebSocketConfig: "/pub" 경로 확인
   DmController.privateChat() 호출
   messagingTemplate.convertAndSend("/sub/private/user2", message)

4️⃣ 서버 → 클라이언트
   user2가 이미 "/sub/private/user2" 구독 중이면
   즉시 메시지 수신

5️⃣ 클라이언트 (chat.html)
   stompClient.subscribe("/sub/private/user2", function(msg) { ... })
   받은 메시지 화면에 표시
```

---

## 🐛 404 오류 해결 방법

**문제:** `Failed to load resource: the server responded with a status of 404`

**원인:** Context Path 미반영

```javascript
// ❌ 잘못된 방식
const socket = new SockJS("/ws");

// ✅ 올바른 방식
const socket = new SockJS("/memoryf/ws");
// Context Path(/memoryf) + Endpoint(/ws)
```

**application.properties 확인:**
```properties
server.servlet.context-path=/memoryf
```

---

## 🔑 핵심 개념 정리

| 개념 | 설명 |
|------|------|
| **WebSocket** | TCP 기반 양방향 통신 (HTTP와 다름) |
| **STOMP** | 메시지 형식 규약 (복잡한 웹소켓 사용 쉽게 함) |
| **SockJS** | 웹소켓 미지원 브라우저 폴백 |
| **/pub** | 클라이언트 → 서버 메시지 경로 |
| **/sub** | 서버 → 클라이언트 메시지 경로 |
| **@MessageMapping** | 클라이언트 메시지 수신 (컨트롤러의 @RequestMapping 같은 개념) |
| **@SendTo** | 즉시 브로드캐스트 (모두에게 전송) |
| **convertAndSend()** | 특정 경로로 메시지 전송 (선택적 전송) |

---

## 📝 추가 학습 팁

1. **브라우저 개발자 도구 → 네트워크 탭**에서 WebSocket 연결 확인
2. **Spring Boot 콘솔**에서 `System.out.println()` 로그 확인
3. **메시지 구조**를 JSON으로 이해하면 더 쉬움
4. **@Payload**, **@Header** 등으로 더 복잡한 메시지 처리 가능

---

**작성일:** 2025년 12월 16일
