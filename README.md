# 🎞️ Memoryf (메모리프)

> **SNS 기반 추억 공유 플랫폼** - KH 파이널 프로젝트 (Team Homix)

## 📌 프로젝트 소개

Memoryf는 사용자들이 일상의 추억을 피드, 다이어리, 스토리 형태로 기록하고 공유할 수 있는 SNS 플랫폼입니다.

## 🛠️ 기술 스택

### Frontend
- **Framework:** React 18 + Vite
- **Architecture:** FSD (Feature-Sliced Design)
- **State Management:** Context API
- **Styling:** CSS Modules, Tailwind CSS

### Backend
- **Framework:** Spring Boot
- **Database:** Oracle
- **ORM:** MyBatis

## 📁 프로젝트 구조

```
Team_Homix_workspace/
├── Memoryf-frontend/     # React 프론트엔드 (FSD 아키텍처)
│   ├── src/
│   │   ├── app/          # 앱 초기화, 라우터, 프로바이더
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── widgets/      # 독립적인 UI 블록
│   │   ├── features/     # 비즈니스 로직 (액션)
│   │   ├── entities/     # 비즈니스 엔티티
│   │   └── shared/       # 공통 유틸리티
│   └── ...
├── Memoryf-backend/      # Spring Boot 백엔드
│   └── src/
└── RETROGRAM.sql         # 데이터베이스 스키마
```

## 🚀 시작하기

### 1. 환경 설정

```bash
# Frontend 환경 설정
cd Memoryf-frontend
cp .env.example .env
# .env 파일에서 API 키 설정

# Backend 환경 설정  
cd Memoryf-backend/src/main/resources
cp application.properties.example application.properties
# application.properties에서 DB 정보 설정
```

### 2. Frontend 실행

```bash
cd Memoryf-frontend
npm install
npm run dev
```

### 3. Backend 실행

```bash
cd Memoryf-backend
./mvnw spring-boot:run
```

### 4. 데이터베이스 설정

```sql
-- Oracle에서 RETROGRAM.sql 실행
@RETROGRAM.sql
```

## 📋 주요 기능

- 🔐 **인증:** 회원가입, 로그인, 비밀번호 찾기
- 📸 **피드:** 사진/동영상 업로드, 좋아요, 댓글, 북마크
- 📖 **다이어리:** 개인 일기 작성
- 💬 **DM:** 실시간 다이렉트 메시지
- 🏠 **미니홈피:** 개인 프로필, 방명록
- 🔔 **알림:** 실시간 알림
- 🎵 **BGM:** 배경음악 설정

## 👥 팀원

Team Homix

## 📄 라이선스

MIT License
