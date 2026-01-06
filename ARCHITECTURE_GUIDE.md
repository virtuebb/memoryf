# 📐 Memoryf 프로젝트 아키텍처 가이드

> 복습용 가이드: 스스로 타이핑하며 학습하기 좋게 정리했습니다.

---

## 📊 프로젝트 개요

| 구분 | 기술 |
|------|------|
| **Backend** | Spring Boot 3.5.8, MyBatis, Oracle DB |
| **Frontend** | React 19, Vite 7, React Router 7 |
| **인증** | JWT (Access Token + Refresh Token) |
| **실시간** | WebSocket + STOMP (DM 채팅) |
| **결제** | 포트원(iamport) 연동 |

---

## 🏗️ 백엔드 아키텍처 (계층형)

### 폴더 구조

```
src/main/java/com/kh/memoryf/
├── config/              # 설정 클래스
│   ├── SecurityConfig   # Spring Security + JWT
│   ├── CorsConfig       # CORS 설정
│   ├── WebSocketConfig  # STOMP 설정
│   └── JwtAuthFilter    # JWT 인증 필터
│
├── common/              # 공통 모듈
│   ├── response/        # ApiResponse 통일
│   ├── exception/       # 예외 처리
│   └── template/        # 유틸리티
│
├── [도메인]/            # 각 기능별 모듈
│   ├── controller/      # REST Controller
│   ├── model/
│   │   ├── vo/          # Value Object (DTO)
│   │   ├── dao/         # Data Access Object
│   │   └── service/     # 비즈니스 로직
│   └── (필요 시 config/)
│
└── MemoryfBackendApplication.java  # 메인 클래스
```

### 핵심 도메인

| 도메인 | 설명 | 주요 API |
|--------|------|----------|
| `auth` | 인증/인가 | 로그인, 회원가입, 이메일 인증 |
| `member` | 회원 정보 | 프로필, 정보 수정 |
| `home` | 미니홈피 | 홈 정보, 스킨 설정 |
| `feed` | 피드 | CRUD, 좋아요, 북마크 |
| `comment` | 댓글 | 등록, 삭제, 좋아요 |
| `story` | 스토리 | 24시간 제한 콘텐츠 |
| `dm` | 다이렉트 메시지 | WebSocket 채팅 |
| `diary` | 다이어리 | 개인 일기 |
| `guestbook` | 방명록 | 홈 방명록 |
| `follow` | 팔로우 | 팔로우/언팔로우 |
| `notification` | 알림 | 좋아요, 댓글, 팔로우 알림 |
| `payment` | 결제 | 포인트 충전, BGM 구매 |
| `report` | 신고 | 피드/댓글 신고 |
| `search` | 검색 | 사용자, 피드 검색 |
| `admin` | 관리자 | 대시보드, 회원관리 |

---

### REST API 컨벤션

```java
// ✅ 좋은 예시 (RESTful)
@RestController
@RequestMapping("feeds")  // 복수형 명사
public class FeedController {
    
    @GetMapping("")              // GET /feeds         - 목록 조회
    @GetMapping("/{feedNo}")     // GET /feeds/{id}    - 상세 조회
    @PostMapping("")             // POST /feeds        - 생성
    @PutMapping("/{feedNo}")     // PUT /feeds/{id}    - 수정
    @DeleteMapping("/{feedNo}")  // DELETE /feeds/{id} - 삭제
    
    // 서브 리소스
    @GetMapping("/{feedNo}/comments")   // 피드의 댓글 목록
    @PostMapping("/{feedNo}/likes")     // 좋아요 토글
}
```

### 통일된 응답 형식

```java
// ApiResponse.java
public class ApiResponse<T> {
    private boolean success;  // 성공 여부
    private String message;   // 메시지
    private T data;           // 데이터

    public static <T> ApiResponse<T> success(T data) { ... }
    public static <T> ApiResponse<T> success(String message, T data) { ... }
    public static <T> ApiResponse<T> error(String message) { ... }
}
```

---

## 🎨 프론트엔드 아키텍처 (FSD)

### Feature-Sliced Design 구조

```
src/
├── app/                 # 앱 설정, 라우터
│   ├── providers/       # Context Providers
│   └── router/          # 라우팅 설정
│
├── pages/               # 페이지 컴포넌트
│   └── [기능]/          # 각 페이지별 폴더
│       ├── XxxPage.jsx
│       └── XxxPage.css
│
├── widgets/             # 독립적 UI 블록 (조합 컴포넌트)
│   ├── header/
│   ├── sidebar/
│   ├── footer/
│   └── [기능]/
│
├── features/            # 기능 단위 모듈 ⭐ 핵심
│   └── [기능]/
│       ├── api/         # API 호출
│       ├── model/       # 커스텀 훅, 상태
│       ├── ui/          # UI 컴포넌트
│       └── index.js     # 모듈 진입점
│
├── entities/            # 도메인 엔티티 (읽기 전용)
│   └── [엔티티]/
│       └── api/         # 조회 API만
│
└── shared/              # 공용 모듈
    ├── api/             # axios 설정, 인터셉터
    ├── lib/             # 유틸, 훅
    ├── ui/              # 공통 UI
    └── constants/       # 상수
```

### FSD 레이어 규칙

```
┌─────────────┐
│    app      │  ← 최상위 (라우터, 프로바이더)
├─────────────┤
│   pages     │  ← 페이지 조합
├─────────────┤
│  widgets    │  ← 독립적 UI 블록
├─────────────┤
│  features   │  ← 기능 단위 (CUD)
├─────────────┤
│  entities   │  ← 도메인 데이터 (Read)
├─────────────┤
│   shared    │  ← 공용 (하위 레이어만 참조)
└─────────────┘

⚠️ 규칙: 상위 레이어는 하위 레이어만 import 가능
         (예: features → entities ✅, entities → features ❌)
```

---

### API 모듈 패턴

```javascript
// features/report/api/reportApi.js

import { baseApi, getApiResponseData } from '../../../shared/api';

// 피드 신고
export const reportFeed = async (feedNo, memberNo, reportReason) => {
  const response = await baseApi.post('/reports/feeds', {
    feedNo,
    memberNo,
    reportReason,
  });
  return getApiResponseData(response.data, response.data);
};
```

### 커스텀 훅 패턴

```javascript
// features/report/model/useReport.js

import { useState, useCallback } from 'react';
import { reportFeed, reportComment } from '../api/reportApi';

export const useReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const openFeedReport = useCallback((feedNo) => {
    setReportType('FEED');
    setTargetId(feedNo);
    setIsOpen(true);
  }, []);

  const submitReport = useCallback(async (memberNo, reason) => {
    setIsLoading(true);
    try {
      await reportFeed(targetId, memberNo, reason);
      return true;
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [targetId]);

  return { isOpen, isLoading, openFeedReport, submitReport };
};
```

---

## 🔐 인증 흐름 (JWT)

### 토큰 구조

```
1. Access Token  (만료: 30분)  - API 요청 시 사용
2. Refresh Token (만료: 7일)   - Access Token 갱신용
```

### 인증 흐름도

```
[로그인 요청]
     ↓
[서버: JWT 발급] → AccessToken + RefreshToken
     ↓
[클라이언트: localStorage 저장]
     ↓
[API 요청] → Authorization: Bearer {accessToken}
     ↓
[401 에러 시] → RefreshToken으로 갱신 시도
     ↓
[갱신 성공] → 새 토큰 저장, 원래 요청 재시도
[갱신 실패] → 로그아웃 처리
```

### 프론트엔드 인터셉터

```javascript
// shared/api/baseApi.js

// 요청 인터셉터 - 토큰 자동 첨부
const requestInterceptor = (config) => {
  const token = getAccessToken();
  if (token && !isPublicPath(url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// 응답 인터셉터 - 401시 토큰 갱신
const responseErrorInterceptor = async (error) => {
  if (error.response?.status === 401 && !originalRequest._retry) {
    // Refresh Token으로 갱신 시도
    const response = await axios.post('/auth/refresh', { refreshToken });
    setTokens(response.data.accessToken, response.data.refreshToken);
    // 원래 요청 재시도
    return baseApi(originalRequest);
  }
  return Promise.reject(error);
};
```

---

## 💬 WebSocket 채팅 (STOMP)

### 백엔드 설정

```java
// WebSocketConfig.java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub");   // 구독 prefix
        config.setApplicationDestinationPrefixes("/pub");  // 발행 prefix
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")  // WebSocket 엔드포인트
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
```

### 메시지 흐름

```
[클라이언트 A] ──발행──> /pub/chat/private
                              ↓
                        [서버: DmController]
                              ↓
[클라이언트 B] <──구독── /sub/private/{userId}
```

---

## ⚡ 리팩토링 권장 사항

### 1. 생성자 주입 사용 (백엔드)

```java
// ❌ 필드 주입 (현재)
@Autowired
private FeedService feedService;

// ✅ 생성자 주입 (권장)
private final FeedService feedService;

@Autowired  // 생성자 하나면 생략 가능
public FeedController(FeedService feedService) {
    this.feedService = feedService;
}

// ✅ Lombok 사용 시
@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;
}
```

### 2. DTO 분리 (백엔드)

```java
// ✅ Request/Response DTO 분리
public class FeedCreateRequest {
    private String content;
    private String tag;
    // validation 어노테이션
}

public class FeedResponse {
    private int feedNo;
    private String content;
    // Entity → Response 변환 메서드
}
```

### 3. 비동기 상태 관리 (프론트엔드)

```javascript
// ✅ React Query 도입 권장
import { useQuery, useMutation } from '@tanstack/react-query';

const useFeedList = () => {
  return useQuery({
    queryKey: ['feeds'],
    queryFn: getFeedList,
    staleTime: 1000 * 60 * 5,  // 5분 캐시
  });
};
```

---


---

## 🚀 다음 단계 추천

1. **테스트 코드 작성** - JUnit5, React Testing Library
2. **React Query 도입** - 서버 상태 관리 최적화
3. **GitHub Actions CI/CD** - 자동 빌드/배포
4. **Docker 컨테이너화** - 개발 환경 통일
5. **성능 최적화** - Lazy Loading, 이미지 최적화

---

> 💡 **Tip**: 복습할 때는 이 가이드를 보며 직접 코드를 처음부터 작성해보세요!

