# 관리자 페이지 구조 설명

## 📁 전체 구조

```
admin/
├── components/          # 공통 컴포넌트
│   ├── AdminLayout.jsx      # 레이아웃 (사이드바 + 헤더)
│   ├── AdminSidebar.jsx     # 좌측 사이드바 메뉴
│   ├── AdminHeader.jsx      # 상단 헤더
│   ├── ConfirmModal.jsx     # 확인 모달
│   ├── DataTable.jsx        # 데이터 테이블
│   └── Pagination.jsx       # 페이지네이션
├── pages/               # 페이지 컴포넌트
│   ├── DashboardPage.jsx        # 대시보드
│   ├── UserManagementPage.jsx   # 회원 관리
│   ├── ReportManagementPage.jsx # 신고 관리
│   ├── PaymentManagementPage.jsx # 결제 관리
│   └── BgmManagementPage.jsx    # BGM 관리
└── api/
    └── adminApi.js      # API 통신 모듈
```

## 🎨 화면 구조

### 레이아웃 구조
```
┌─────────────────────────────────────────┐
│  AdminHeader (상단 헤더)                │
├──────────┬──────────────────────────────┤
│          │                              │
│ Admin    │  메인 콘텐츠 영역            │
│ Sidebar  │  (각 페이지가 여기에 렌더링) │
│ (좌측)   │                              │
│          │                              │
│ - 대시보드                              │
│ - 회원 관리                              │
│ - 신고 관리                              │
│ - 결제 관리                              │
│ - 상품 관리                              │
└──────────┴──────────────────────────────┘
```

## 📄 페이지별 기능

### 1. 대시보드 (DashboardPage)
- 전체 통계 카드 (회원 수, 신고 건수, 결제 금액, BGM 수)
- 최근 신고 내역
- 최근 결제 내역

### 2. 회원 관리 (UserManagementPage)
- 회원 목록 조회 (테이블)
- 회원 상세 조회
- 회원 탈퇴 (Confirm 모달 필수)
- 페이지네이션

### 3. 신고 관리 (ReportManagementPage)
- 탭 구조로 3가지 신고 유형 관리
  - 신고된 피드: 목록, 상세, 삭제
  - 신고된 댓글: 목록, 삭제
  - 신고된 회원: 목록, 정지 (기간 선택)

### 4. 결제 관리 (PaymentManagementPage)
- 결제 목록 조회
- 결제 상세 조회 (모달)
- 통계 카드

### 5. BGM 관리 (BgmManagementPage)
- BGM 목록 조회
- BGM 추가 (제목, 가격, 음원 파일)
- BGM 수정
- BGM 삭제 (Confirm 모달 필수)
- 미리듣기 기능

## 🔧 주요 컴포넌트

### AdminLayout
- 전체 레이아웃 구조
- 좌측 사이드바 + 상단 헤더 + 메인 콘텐츠
- React Router의 Outlet 사용

### AdminSidebar
- 네비게이션 메뉴
- 현재 페이지 하이라이트
- 아이콘 + 텍스트

### DataTable
- 재사용 가능한 테이블 컴포넌트
- 컬럼 정의로 유연하게 사용
- 로딩 상태, 빈 데이터 상태 처리

### ConfirmModal
- 삭제/정지/탈퇴 등 중요한 작업 전 확인
- variant로 색상 변경 가능 (danger, warning)

### Pagination
- 페이지 번호 표시
- 이전/다음 버튼
- 현재 페이지 하이라이트

## 🔌 API 연동 가이드

### React Query 사용 예시

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/adminApi';

// 회원 목록 조회
const { data, isLoading } = useQuery(
  ['users', currentPage],
  () => userApi.getUsers(currentPage, 10)
);

// 회원 탈퇴
const queryClient = useQueryClient();
const deleteMutation = useMutation(
  (userId) => userApi.deleteUser(userId),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  }
);
```

## 🚀 사용 방법

1. **라우팅 설정** (App.jsx에 이미 추가됨)
```jsx
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="users" element={<UserManagementPage />} />
  <Route path="reports" element={<ReportManagementPage />} />
  <Route path="payments" element={<PaymentManagementPage />} />
  <Route path="bgm" element={<BgmManagementPage />} />
</Route>
```

2. **접근 방법**
- `/admin` - 대시보드
- `/admin/users` - 회원 관리
- `/admin/reports` - 신고 관리
- `/admin/payments` - 결제 관리
- `/admin/bgm` - BGM 관리

## 📝 TODO

1. **인증/권한 체크**
   - 관리자 로그인 페이지 추가
   - 인증 토큰 관리
   - 권한 체크 미들웨어

2. **API 연동**
   - adminApi.js의 주석 해제 및 실제 엔드포인트 연결
   - React Query 설정 및 사용
   - 에러 처리 강화

3. **기능 추가**
   - 검색 기능
   - 필터링 기능
   - 정렬 기능
   - 엑셀 다운로드

4. **디자인 개선**
   - Tailwind CSS 적용 (현재는 인라인 스타일)
   - 반응형 디자인
   - 다크 모드 지원

