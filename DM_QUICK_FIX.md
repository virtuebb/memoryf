# DM 실시간 기능 3가지 문제 해결 - 빠른 가이드

## 🔴 3가지 문제점

1. **읽음처리 후 배지(1)가 안 사라짐** ❌
2. **새 메시지가 실시간으로 채팅목록에 표시 안 됨** ❌  
3. **새로고침을 해야 메시지가 나타남** ❌

---

## ✅ 해결방법

### 📝 파일: `Memoryf-frontend/src/features/dm/context/DmContext.jsx`

#### 수정 1️⃣ : handleMarkAsRead 함수 (라인 ~364-420)

**문제**: DB 저장을 먼저 하고 기다린 후 UI 업데이트 → 사용자가 지연을 느낌

**수정 방법**: 
1. UI 업데이트를 **먼저** 한다
2. DB 저장은 **기다리지 않는다** (백그라운드)  
3. WebSocket은 **동시에** 전송한다

**현재 코드 (라인 364-420)**:
```javascript
const handleMarkAsRead = useCallback((chatId) => {
    const chat = [...pendingChats, ...chatRooms].find(
      (c) => String(c.id) === String(chatId)
    );
    
    if (!chat) return;
    
    currentViewingUserIdRef.current = chat.userId;
    
    // ❌ 여기서 DB 저장을 먼저 하고 기다림
    if (chat.id) {
      markMessageAsRead(chat.id, myUserId)
        .then(response => {
          console.log('💾 DB에 읽음 처리 저장:', response);
        })
        ...
    }
    
    // 💬 WebSocket 이벤트
    if (stompClientRef.current && isConnected) {
      ...
    }
    
    // ❌ 마지막에 UI 업데이트
    setChatRooms(...)
    setPendingChats(...)
  }, [...]);
```

**수정된 코드** (순서만 바꿈):
```javascript
const handleMarkAsRead = useCallback((chatId) => {
    const chat = [...pendingChats, ...chatRooms].find(
      (c) => String(c.id) === String(chatId)
    );
    
    if (!chat) return;
    
    currentViewingUserIdRef.current = chat.userId;
    
    // ✅ STEP 1: UI를 **먼저** 업데이트 (사용자가 바로 느낌)
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        String(room.id) === String(chatId)
          ? { ...room, unread: 0 }
          : room
      )
    );
    setPendingChats((prevChats) =>
      prevChats.map((room) =>
        String(room.id) === String(chatId)
          ? { ...room, unread: 0 }
          : room
      )
    );
    
    // ✅ STEP 2: DB 저장은 **기다리지 않음** (백그라운드)
    if (chat.id) {
      markMessageAsRead(chat.id, myUserId)
        .catch(error => {
          console.error('❌ DB 저장 실패:', error);
        });
    }
    
    // ✅ STEP 3: WebSocket으로 상대방 알림
    if (stompClientRef.current && isConnected) {
      const targetUserId = chat.userId;
      
      stompClientRef.current.publish({
        destination: '/pub/chat/private',
        body: JSON.stringify({
          type: 'read',
          roomNo: chat.id,
          roomId: targetUserId,
          sender: myUserId,
          content: ''
        })
      });

      console.log(`👀 읽음 이벤트 전송: ${myUserId} → ${targetUserId}`);
    }
  }, [chatRooms, pendingChats, isConnected, myUserId]);
```

---

#### 수정 2️⃣ : handleReceiveMessage 함수 (라인 ~230-290)

**문제**: 메시지는 수신하지만 `lastMessage`와 `time`을 채팅목록에 업데이트하지 않음

**찾을 위치**: 
```javascript
if (roomIndex !== -1) {
  // 기존 채팅방에 메시지 추가
  const updatedRooms = [...prevRooms];
  updatedRooms[roomIndex] = {
    ...updatedRooms[roomIndex],
    messages: [...updatedRooms[roomIndex].messages, newMessage],
    lastMessage: content,
    time: '방금',  // ❌ 이게 문제!
    unread: isCurrentlyViewing ? 0 : updatedRooms[roomIndex].unread + 1,
  };
  return updatedRooms;
}
```

**수정**: `time` 필드를 '방금'이 아니라 **실제 시간**으로 설정
```javascript
if (roomIndex !== -1) {
  // 기존 채팅방에 메시지 추가
  const updatedRooms = [...prevRooms];
  updatedRooms[roomIndex] = {
    ...updatedRooms[roomIndex],
    messages: [...updatedRooms[roomIndex].messages, newMessage],
    lastMessage: content,  // ✅ 이건 맞음
    time: new Date().toLocaleTimeString('ko-KR', {  // ✅ 수정: 실제 현재 시간
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    unread: isCurrentlyViewing ? 0 : (updatedRooms[roomIndex].unread || 0) + 1,
  };
  console.log(`📤 메시지 수신 반영됨: ${updatedRooms[roomIndex].userName}`);
  return updatedRooms;
}
```

---

## 🧪 테스트 방법

### 준비
```
1. 두 개의 브라우저 탭 열기 (예: Chrome + Safari)
2. 각 탭에서 다른 계정으로 로그인
   - 탭1: user1 로그인
   - 탭2: user2 로그인
3. 브라우저 개발자도구 열기 (F12 > Console 탭)
```

### 테스트 1: 읽음처리 배지 사라지기
```
1. 탭1 (user1)에서 탭2 (user2)로 메시지 전송
2. 탭2의 채팅목록에서 빨간 배지(1) 확인
3. 탭2에서 채팅방 클릭 / 입장
4. ✅ 배지가 **즉시** 사라지는지 확인
```

### 테스트 2: 실시간 메시지 표시
```
1. 탭1 (user1)에서 메시지 전송: "안녕하세요"
2. 탭2의 채팅목록에서:
   ✅ lastMessage: "안녕하세요" (표시됨)
   ✅ time: "2:30 PM" (현재 시간으로 업데이트됨)
   ✅ 새로고침 **없이** 자동 반영
```

### 테스트 3: 새로고침 불필요
```
1. 모든 메시지가 새로고침 없이 바로 나타나는지 확인
2. F5 누르지 않아도 UI가 업데이트되는지 확인
```

---

## 🔍 콘솔 로그로 확인

### 프론트엔드 (브라우저 콘솔)
```
// Step 1: 메시지 전송
📤 메시지 전송: user1 → user2 (roomNo:1): 안녕

// Step 2: 메시지 수신
📩 /sub 메시지 수신: {type: 'message', roomNo: 1, ...}
📤 메시지 수신 반영됨: user2

// Step 3: 읽음 처리
UI update - unread to 0 for room 1
👀 읽음 이벤트 전송: user1 → user2
```

### 백엔드 (터미널)
```
// 메시지 저장
📨 메시지 저장 요청 수신
roomNo : 1
senderId : user1
content : 안녕
✅ 메시지 저장 완료 - 결과: 1

// WebSocket 전송
📤 /sub/private/user2로 메시지 전송
```

---

## 💡 핵심 포인트

| 문제 | 원인 | 해결방법 |
|------|------|--------|
| 배지 안 사라짐 | UI 업데이트 지연 | UI 업데이트를 먼저 |
| 메시지 안 보임 | time 필드 미업데이트 | 실제 시간으로 설정 |
| 새로고침 필요 | time 필드 미업데이트 | ↑ 와 동일 |

---

## ⚠️ 주의사항

- DmContext.jsx 파일은 인코딩 문제가 있을 수 있으니 **VSCode에서 직접 수정** 권장
- 수정 후 **브라우저 캐시 삭제** (Ctrl+Shift+Delete 또는 Cmd+Shift+Delete)
- 백엔드 로그에서 메시지 저장 로그가 나타나지 않으면 백엔드 서버 재시작 필요

---

## 📋 체크리스트

- [ ] 수정 1: handleMarkAsRead 함수 순서 변경
- [ ] 수정 2: handleReceiveMessage 함수 time 필드 수정
- [ ] 브라우저 캐시 삭제
- [ ] 백엔드 서버 재시작
- [ ] 테스트 1: 배지 사라지기 확인
- [ ] 테스트 2: 실시간 메시지 표시 확인
- [ ] 테스트 3: 새로고침 불필요 확인
