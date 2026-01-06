--------------------------------------------------------
-- RETROGRAM V2 - 개선된 ERD 스크립트
-- 개선사항:
-- 1. 포인트 테이블 분리 (TB_POINT_WALLET, TB_POINT_HISTORY)
-- 2. DM 테이블 MEMBER_NO 기반으로 변경 + FK 추가
-- 3. 신고 테이블 통합 (TB_REPORT)
-- 4. 방문자 테이블 일별 이력 지원
-- 5. 댓글 대댓글 지원 (PARENT_NO, DEPTH)
-- 6. 스토리 테이블 파일 컬럼 정리
-- 7. 인덱스 추가
-- 8. CHECK 제약조건 추가
--------------------------------------------------------

--------------------------------------------------------
-- 1. 모든 테이블 삭제 (자식 -> 부모 순서)
--------------------------------------------------------
-- 신규 테이블
DROP TABLE TB_POINT_HISTORY;
DROP TABLE TB_POINT_WALLET;
DROP TABLE TB_REPORT;

-- 기존 테이블
DROP TABLE TB_STORY_ITEM;
DROP TABLE TB_NOTIFICATION;
DROP TABLE TB_ACCOUNT_HISTORY;
DROP TABLE TB_STORY_VISITOR;
DROP TABLE TB_COMMENT_LIKE;
DROP TABLE TB_COMMENT;
DROP TABLE TB_GUESTBOOK_LIKE;
DROP TABLE TB_GUESTBOOK;
DROP TABLE TB_DM_READ_STATUS;
DROP TABLE TB_DM_MESSAGE;
DROP TABLE TB_DM_PARTICIPANT;
DROP TABLE TB_DM_ROOM;
DROP TABLE TB_POINT_CHARGE;
DROP TABLE TB_PAYMENT;
DROP TABLE TB_FEED_BOOKMARK;
DROP TABLE TB_FEED_LIKE;
DROP TABLE TB_FEED_FILE;
DROP TABLE TB_FOLLOWS;
DROP TABLE TB_HOME_VISITOR;
DROP TABLE TB_DIARY;
DROP TABLE TB_STORY;
DROP TABLE TB_FEED;
DROP TABLE TB_MEMBER_HOME;
DROP TABLE TB_BGM;
DROP TABLE TB_MEMBER;

--------------------------------------------------------
-- 2. 모든 시퀀스 삭제
--------------------------------------------------------
DROP SEQUENCE SEQ_MEMBER_NO;
DROP SEQUENCE SEQ_HISTORY_NO;
DROP SEQUENCE SEQ_HOME_NO;
DROP SEQUENCE SEQ_FEED_NO;
DROP SEQUENCE SEQ_IMAGE_NO;
DROP SEQUENCE SEQ_BGM_NO;
DROP SEQUENCE SEQ_PAYMENT_NO;
DROP SEQUENCE SEQ_CHARGE_NO;
DROP SEQUENCE SEQ_DM_ROOM_NO;
DROP SEQUENCE SEQ_DM_MESSAGE_NO;
DROP SEQUENCE SEQ_DM_READ_NO;
DROP SEQUENCE SEQ_GUESTBOOK_NO;
DROP SEQUENCE SEQ_COMMENT_NO;
DROP SEQUENCE SEQ_COMMENT_LIKE_NO;
DROP SEQUENCE SEQ_STORY_NO;
DROP SEQUENCE SEQ_STORY_ITEM_NO;
DROP SEQUENCE SEQ_DIARY_NO;
DROP SEQUENCE SEQ_BOOKMARK_NO;
DROP SEQUENCE SEQ_NOTIFICATION_NO;
DROP SEQUENCE SEQ_VISITOR_NO;
DROP SEQUENCE SEQ_REPORT_NO;
DROP SEQUENCE SEQ_WALLET_NO;
DROP SEQUENCE SEQ_POINT_HISTORY_NO;

--------------------------------------------------------
-- 3. 시퀀스 생성 (CACHE 20 적용으로 성능 최적화)
--------------------------------------------------------
CREATE SEQUENCE SEQ_MEMBER_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_HISTORY_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_HOME_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_FEED_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_IMAGE_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_BGM_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_PAYMENT_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_CHARGE_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_DM_ROOM_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_DM_MESSAGE_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_DM_READ_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_GUESTBOOK_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_COMMENT_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_COMMENT_LIKE_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_STORY_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_STORY_ITEM_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_DIARY_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_BOOKMARK_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_NOTIFICATION_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_VISITOR_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_REPORT_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_WALLET_NO START WITH 1 INCREMENT BY 1 CACHE 20;
CREATE SEQUENCE SEQ_POINT_HISTORY_NO START WITH 1 INCREMENT BY 1 CACHE 20;

--------------------------------------------------------
-- 4. 테이블 생성 (부모 -> 자식 순서)
--------------------------------------------------------

-- =====================================================
-- 1. 회원 테이블 (POINT 컬럼 제거)
-- =====================================================
CREATE TABLE TB_MEMBER (
    MEMBER_NO           NUMBER          PRIMARY KEY,
    MEMBER_ID           VARCHAR2(20)    UNIQUE NOT NULL,
    MEMBER_PWD          VARCHAR2(100)   NOT NULL,
    MEMBER_NAME         VARCHAR2(50)    NOT NULL,
    MEMBER_NICK         VARCHAR2(50)    UNIQUE,
    EMAIL               VARCHAR2(250)   UNIQUE,
    PHONE               VARCHAR2(13),
    GENDER              CHAR(1),
    BIRTHDAY            DATE,
    CREATE_DATE         DATE            DEFAULT SYSDATE,
    STATUS              CHAR(1)         DEFAULT 'N',
    CONSTRAINT CHK_MEMBER_GENDER CHECK (GENDER IN ('M', 'F', 'N')),
    CONSTRAINT CHK_MEMBER_STATUS CHECK (STATUS IN ('Y', 'N', 'S'))
    -- Y: 활성, N: 비활성(이메일 미인증), S: 정지
);

COMMENT ON TABLE TB_MEMBER IS '회원 정보 테이블';
COMMENT ON COLUMN TB_MEMBER.MEMBER_NO IS '회원 고유번호 (PK)';
COMMENT ON COLUMN TB_MEMBER.MEMBER_ID IS '로그인 아이디';
COMMENT ON COLUMN TB_MEMBER.STATUS IS 'Y: 활성, N: 비활성, S: 정지';

-- =====================================================
-- 2. 포인트 지갑 테이블 (신규)
-- =====================================================
CREATE TABLE TB_POINT_WALLET (
    WALLET_NO       NUMBER          PRIMARY KEY,
    MEMBER_NO       NUMBER          UNIQUE NOT NULL,
    BALANCE         NUMBER          DEFAULT 0 NOT NULL,
    LAST_UPDATE     DATE            DEFAULT SYSDATE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_WALLET_BALANCE CHECK (BALANCE >= 0)
);

COMMENT ON TABLE TB_POINT_WALLET IS '회원별 포인트 잔액 관리';
COMMENT ON COLUMN TB_POINT_WALLET.BALANCE IS '현재 포인트 잔액';

-- =====================================================
-- 3. 포인트 이력 테이블 (신규)
-- =====================================================
CREATE TABLE TB_POINT_HISTORY (
    HISTORY_NO      NUMBER          PRIMARY KEY,
    MEMBER_NO       NUMBER          NOT NULL,
    AMOUNT          NUMBER          NOT NULL,       -- 양수: 적립, 음수: 차감
    TYPE            VARCHAR2(20)    NOT NULL,       -- CHARGE, USE, REFUND, BONUS, PENALTY
    REF_TYPE        VARCHAR2(20),                   -- BGM, STICKER, EVENT 등
    REF_NO          NUMBER,                         -- 관련 결제/이벤트 번호
    BALANCE_AFTER   NUMBER          NOT NULL,       -- 거래 후 잔액
    DESCRIPTION     VARCHAR2(200),
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_POINT_TYPE CHECK (TYPE IN ('CHARGE', 'USE', 'REFUND', 'BONUS', 'PENALTY'))
);

COMMENT ON TABLE TB_POINT_HISTORY IS '포인트 거래 이력';
COMMENT ON COLUMN TB_POINT_HISTORY.AMOUNT IS '양수: 적립, 음수: 차감';
COMMENT ON COLUMN TB_POINT_HISTORY.TYPE IS 'CHARGE: 충전, USE: 사용, REFUND: 환불, BONUS: 보너스, PENALTY: 차감';

-- =====================================================
-- 4. 계정 활동 히스토리
-- =====================================================
CREATE TABLE TB_ACCOUNT_HISTORY (
    HISTORY_NO      NUMBER          PRIMARY KEY,
    MEMBER_NO       NUMBER          NOT NULL,
    EVENT_TYPE      VARCHAR2(50)    NOT NULL,
    EVENT_DESC      VARCHAR2(300),
    EVENT_DATE      DATE            DEFAULT SYSDATE,
    IP_ADDRESS      VARCHAR2(50),                   -- 보안용 IP 기록
    USER_AGENT      VARCHAR2(500),                  -- 접속 기기 정보
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO) ON DELETE CASCADE
);

COMMENT ON TABLE TB_ACCOUNT_HISTORY IS '계정 활동 로그 (로그인, 비밀번호 변경 등)';

-- =====================================================
-- 5. 홈피 테이블
-- =====================================================
CREATE TABLE TB_MEMBER_HOME (
    HOME_NO             NUMBER          PRIMARY KEY,
    HOME_TITLE          VARCHAR2(50),
    STATUS_MSG          VARCHAR2(500),
    PROFILE_ORIGIN_NAME VARCHAR2(200),
    PROFILE_CHANGE_NAME VARCHAR2(200),
    IS_PRIVATE_PROFILE  CHAR(1)         DEFAULT 'N',
    IS_PRIVATE_VISIT    CHAR(1)         DEFAULT 'N',
    IS_PRIVATE_FOLLOW   CHAR(1)         DEFAULT 'N',
    THEME_CODE          VARCHAR2(20)    DEFAULT 'DEFAULT',  -- 테마 설정
    MEMBER_NO           NUMBER          UNIQUE NOT NULL,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_HOME_PRIVATE_PROFILE CHECK (IS_PRIVATE_PROFILE IN ('Y', 'N')),
    CONSTRAINT CHK_HOME_PRIVATE_VISIT CHECK (IS_PRIVATE_VISIT IN ('Y', 'N')),
    CONSTRAINT CHK_HOME_PRIVATE_FOLLOW CHECK (IS_PRIVATE_FOLLOW IN ('Y', 'N'))
);

COMMENT ON TABLE TB_MEMBER_HOME IS '회원 홈피 설정';

-- =====================================================
-- 6. 피드 테이블
-- =====================================================
CREATE TABLE TB_FEED (
    FEED_NO         NUMBER          PRIMARY KEY,
    CONTENT         VARCHAR2(2000),                 -- 500 -> 2000으로 확장
    TAG             VARCHAR2(200),                  -- 100 -> 200으로 확장
    LATITUDE        NUMBER(10,6),
    LONGITUDE       NUMBER(10,6),
    PLACE_NAME      VARCHAR2(100),
    KAKAO_PLACE_ID  VARCHAR2(50),
    ADDRESS_NAME    VARCHAR2(200),
    ROAD_ADDRESS    VARCHAR2(200),
    LOCATION_NAME   VARCHAR2(200),
    VIEW_COUNT      NUMBER          DEFAULT 0,      -- 조회수 추가
    CREATED_DATE    DATE            DEFAULT SYSDATE,
    UPDATED_DATE    DATE,                           -- 수정일 추가
    IS_DEL          CHAR(1)         DEFAULT 'N',
    MEMBER_NO       NUMBER          NOT NULL,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_FEED_IS_DEL CHECK (IS_DEL IN ('Y', 'N'))
);

COMMENT ON TABLE TB_FEED IS '피드(게시글) 테이블';

-- =====================================================
-- 7. BGM 테이블
-- =====================================================
CREATE TABLE TB_BGM (
    BGM_NO          NUMBER          PRIMARY KEY,
    BGM_TITLE       VARCHAR2(200)   NOT NULL,
    ARTIST          VARCHAR2(100),
    FILE_PATH       VARCHAR2(250),
    THUMBNAIL_URL   VARCHAR2(500),                  -- 썸네일 추가
    YOUTUBE_ID      VARCHAR2(20),                   -- 유튜브 ID 추가
    PRICE           NUMBER          DEFAULT 0,
    DURATION        NUMBER,                         -- 재생시간(초)
    REG_DATE        DATE            DEFAULT SYSDATE,
    IS_ACTIVE       CHAR(1)         DEFAULT 'Y',
    CONSTRAINT CHK_BGM_ACTIVE CHECK (IS_ACTIVE IN ('Y', 'N'))
);

COMMENT ON TABLE TB_BGM IS 'BGM 상품 목록';

-- =====================================================
-- 8. DM 대화방 테이블
-- =====================================================
CREATE TABLE TB_DM_ROOM (   
    ROOM_NO         NUMBER          PRIMARY KEY, 
    ROOM_TYPE       CHAR(1)         DEFAULT 'P',    -- P: 1:1, G: 그룹
    ROOM_NAME       VARCHAR2(100),                  -- 그룹채팅용 방 이름
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    CONSTRAINT CHK_DM_ROOM_TYPE CHECK (ROOM_TYPE IN ('P', 'G'))
);

COMMENT ON TABLE TB_DM_ROOM IS 'DM 대화방';
COMMENT ON COLUMN TB_DM_ROOM.ROOM_TYPE IS 'P: 1:1 채팅, G: 그룹 채팅';

-- =====================================================
-- 9. DM 참여자 테이블 (MEMBER_NO로 변경 + FK 추가)
-- =====================================================
CREATE TABLE TB_DM_PARTICIPANT (	
    ROOM_NO                 NUMBER          NOT NULL, 
    MEMBER_NO               NUMBER          NOT NULL,   -- MEMBER_ID -> MEMBER_NO
    LAST_READ_MESSAGE_NO    NUMBER          DEFAULT 0, 
    JOINED_AT               DATE            DEFAULT SYSDATE NOT NULL,
    LEFT_AT                 DATE,                       -- 나간 시간 (NULL이면 참여중)
    IS_MUTED                CHAR(1)         DEFAULT 'N', -- 알림 음소거
    PRIMARY KEY (ROOM_NO, MEMBER_NO),
    FOREIGN KEY (ROOM_NO) REFERENCES TB_DM_ROOM(ROOM_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_DM_MUTED CHECK (IS_MUTED IN ('Y', 'N'))
);

COMMENT ON TABLE TB_DM_PARTICIPANT IS 'DM 대화방 참여자';

-- =====================================================
-- 10. DM 메시지 테이블 (MEMBER_NO로 변경)
-- =====================================================
CREATE TABLE TB_DM_MESSAGE (
    MESSAGE_NO      NUMBER          PRIMARY KEY, 
    ROOM_NO         NUMBER          NOT NULL, 
    SENDER_NO       NUMBER          NOT NULL,       -- SENDER_ID -> SENDER_NO
    CONTENT         VARCHAR2(4000), 
    MESSAGE_TYPE    VARCHAR2(20)    DEFAULT 'TEXT', -- TEXT, IMAGE, FILE, SYSTEM
    FILE_PATH       VARCHAR2(500),                  -- 파일 첨부 경로
    CREATE_DATE     DATE            DEFAULT SYSDATE, 
    IS_DEL          CHAR(1)         DEFAULT 'N',
    FOREIGN KEY (ROOM_NO) REFERENCES TB_DM_ROOM(ROOM_NO) ON DELETE CASCADE,
    FOREIGN KEY (SENDER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_DM_MSG_DEL CHECK (IS_DEL IN ('Y', 'N')),
    CONSTRAINT CHK_DM_MSG_TYPE CHECK (MESSAGE_TYPE IN ('TEXT', 'IMAGE', 'FILE', 'SYSTEM'))
);

COMMENT ON TABLE TB_DM_MESSAGE IS 'DM 메시지';

-- =====================================================
-- 11. 다이어리 테이블
-- =====================================================
CREATE TABLE TB_DIARY (
    DIARY_NO        NUMBER          PRIMARY KEY,
    TITLE           VARCHAR2(100),                  -- 50 -> 100
    CONTENT         VARCHAR2(4000),                 -- 2100 -> 4000
    DIARY_DATE      DATE            DEFAULT TRUNC(SYSDATE), -- 일기 날짜
    MOOD            VARCHAR2(20),                   -- 기분 (HAPPY, SAD, ANGRY 등)
    WEATHER         VARCHAR2(20),                   -- 날씨
    ORIGIN_NAME     VARCHAR2(200),
    CHANGE_NAME     VARCHAR2(200),
    FILE_PATH       VARCHAR2(200),
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    IS_DEL          CHAR(1)         DEFAULT 'N',
    MEMBER_NO       NUMBER          NOT NULL,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_DIARY_DEL CHECK (IS_DEL IN ('Y', 'N'))
);

COMMENT ON TABLE TB_DIARY IS '다이어리';

-- =====================================================
-- 12. 홈피 방문자 테이블 (일별 이력 지원)
-- =====================================================
CREATE TABLE TB_HOME_VISITOR (
    VISITOR_NO      NUMBER          PRIMARY KEY,
    HOME_NO         NUMBER          NOT NULL,
    MEMBER_NO       NUMBER          NOT NULL,
    VISIT_DATE      DATE            DEFAULT TRUNC(SYSDATE),  -- 날짜만 저장
    VISIT_COUNT     NUMBER          DEFAULT 1,               -- 해당일 방문 횟수
    FIRST_VISIT     DATE            DEFAULT SYSDATE,
    LAST_VISIT      DATE            DEFAULT SYSDATE,
    UNIQUE (HOME_NO, MEMBER_NO, VISIT_DATE),
    FOREIGN KEY (HOME_NO) REFERENCES TB_MEMBER_HOME(HOME_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO)
);

COMMENT ON TABLE TB_HOME_VISITOR IS '홈피 방문 이력';
COMMENT ON COLUMN TB_HOME_VISITOR.VISIT_DATE IS '방문 날짜 (시간 제외)';

-- =====================================================
-- 13. 팔로우 테이블
-- =====================================================
CREATE TABLE TB_FOLLOWS (
    MEMBER_NO       NUMBER          NOT NULL,       -- 팔로우 하는 사람
    HOME_NO         NUMBER          NOT NULL,       -- 팔로우 대상 홈
    STATUS          CHAR(1)         DEFAULT 'Y',    -- Y: 팔로우중, P: 요청중, N: 취소
    REQUEST_DATE    DATE            DEFAULT SYSDATE,
    ACCEPT_DATE     DATE,                           -- 수락 시간
    PRIMARY KEY (MEMBER_NO, HOME_NO),
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    FOREIGN KEY (HOME_NO) REFERENCES TB_MEMBER_HOME(HOME_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_FOLLOW_STATUS CHECK (STATUS IN ('Y', 'N', 'P'))
);

COMMENT ON TABLE TB_FOLLOWS IS '팔로우 관계';
COMMENT ON COLUMN TB_FOLLOWS.STATUS IS 'Y: 팔로우중, P: 요청대기, N: 취소됨';

-- =====================================================
-- 14. 피드 첨부 파일
-- =====================================================
CREATE TABLE TB_FEED_FILE (
    IMAGE_NO        NUMBER          PRIMARY KEY,
    FEED_NO         NUMBER          NOT NULL,
    FILE_ORDER      NUMBER          DEFAULT 1,      -- 파일 순서
    ORIGIN_NAME     VARCHAR2(200),
    CHANGE_NAME     VARCHAR2(200),
    FILE_PATH       VARCHAR2(500),
    FILE_TYPE       VARCHAR2(20),                   -- IMAGE, VIDEO
    FILE_SIZE       NUMBER,                         -- 파일 크기 (bytes)
    UPLOAD_DATE     DATE            DEFAULT SYSDATE,
    IS_DEL          CHAR(1)         DEFAULT 'N',
    FOREIGN KEY (FEED_NO) REFERENCES TB_FEED(FEED_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_FEED_FILE_DEL CHECK (IS_DEL IN ('Y', 'N'))
);

COMMENT ON TABLE TB_FEED_FILE IS '피드 첨부파일';

-- =====================================================
-- 15. 피드 좋아요
-- =====================================================
CREATE TABLE TB_FEED_LIKE (
    FEED_NO         NUMBER          NOT NULL,
    MEMBER_NO       NUMBER          NOT NULL,
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    PRIMARY KEY (FEED_NO, MEMBER_NO),
    FOREIGN KEY (FEED_NO) REFERENCES TB_FEED(FEED_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO)
);

COMMENT ON TABLE TB_FEED_LIKE IS '피드 좋아요';

-- =====================================================
-- 16. 피드 북마크
-- =====================================================
CREATE TABLE TB_FEED_BOOKMARK (
    BOOKMARK_NO     NUMBER          PRIMARY KEY,
    FEED_NO         NUMBER          NOT NULL,
    MEMBER_NO       NUMBER          NOT NULL,
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    UNIQUE (FEED_NO, MEMBER_NO),                    -- 중복 북마크 방지
    FOREIGN KEY (FEED_NO) REFERENCES TB_FEED(FEED_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO)
);

COMMENT ON TABLE TB_FEED_BOOKMARK IS '피드 북마크(저장)';

-- =====================================================
-- 17. 통합 신고 테이블 (신규 - 다형성 테이블)
-- =====================================================
CREATE TABLE TB_REPORT (
    REPORT_NO       NUMBER          PRIMARY KEY,
    REPORT_TYPE     VARCHAR2(20)    NOT NULL,       -- FEED, COMMENT, STORY, GUESTBOOK, DM
    TARGET_NO       NUMBER          NOT NULL,       -- 신고 대상 ID
    REPORTER_NO     NUMBER          NOT NULL,       -- 신고자
    REPORTED_NO     NUMBER,                         -- 피신고자 (선택)
    REPORT_REASON   VARCHAR2(50)    NOT NULL,       -- 사유 코드
    REPORT_DETAIL   VARCHAR2(500),                  -- 상세 사유
    REPORT_DATE     DATE            DEFAULT SYSDATE,
    PROCESS_STATUS  VARCHAR2(20)    DEFAULT 'PENDING',
    PROCESS_DATE    DATE,
    ADMIN_NO        NUMBER,                         -- 처리한 관리자
    ADMIN_MEMO      VARCHAR2(500),
    FOREIGN KEY (REPORTER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    FOREIGN KEY (REPORTED_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_REPORT_TYPE CHECK (REPORT_TYPE IN ('FEED', 'COMMENT', 'STORY', 'GUESTBOOK', 'DM', 'MEMBER')),
    CONSTRAINT CHK_REPORT_STATUS CHECK (PROCESS_STATUS IN ('PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'COMPLETED'))
);

COMMENT ON TABLE TB_REPORT IS '통합 신고 테이블';
COMMENT ON COLUMN TB_REPORT.REPORT_TYPE IS 'FEED, COMMENT, STORY, GUESTBOOK, DM, MEMBER';
COMMENT ON COLUMN TB_REPORT.PROCESS_STATUS IS 'PENDING: 대기, REVIEWING: 검토중, ACCEPTED: 수락, REJECTED: 반려, COMPLETED: 처리완료';

-- =====================================================
-- 18. 결제 테이블
-- =====================================================
CREATE TABLE TB_PAYMENT (
    PAYMENT_NO      NUMBER          PRIMARY KEY,
    MEMBER_NO       NUMBER          NOT NULL,
    PAYMENT_TYPE    VARCHAR2(20)    NOT NULL,       -- BGM, POINT_CHARGE, STICKER 등
    PAYMENT_AMOUNT  NUMBER          NOT NULL,
    PAYMENT_METHOD  VARCHAR2(20),                   -- CARD, KAKAO, TOSS 등
    IMP_UID         VARCHAR2(100),
    MERCHANT_UID    VARCHAR2(100),
    STATUS          VARCHAR2(20)    DEFAULT 'COMPLETED',
    PAYMENT_DATE    DATE            DEFAULT SYSDATE,
    CANCEL_DATE     DATE,
    CANCEL_REASON   VARCHAR2(200),
    BGM_NO          NUMBER,                         -- BGM 구매시
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    FOREIGN KEY (BGM_NO) REFERENCES TB_BGM(BGM_NO),
    CONSTRAINT CHK_PAYMENT_TYPE CHECK (PAYMENT_TYPE IN ('BGM', 'POINT_CHARGE', 'STICKER', 'PREMIUM')),
    CONSTRAINT CHK_PAYMENT_STATUS CHECK (STATUS IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'))
);

COMMENT ON TABLE TB_PAYMENT IS '결제 내역';

-- =====================================================
-- 19. 포인트 충전 내역
-- =====================================================
CREATE TABLE TB_POINT_CHARGE (
    CHARGE_NO       NUMBER          PRIMARY KEY,
    MEMBER_NO       NUMBER          NOT NULL,
    CHARGE_AMOUNT   NUMBER          NOT NULL,
    IMP_UID         VARCHAR2(100)   NOT NULL,
    MERCHANT_UID    VARCHAR2(100)   NOT NULL,
    PAYMENT_METHOD  VARCHAR2(20),
    STATUS          VARCHAR2(20)    DEFAULT 'COMPLETED',
    CHARGE_DATE     DATE            DEFAULT SYSDATE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_CHARGE_STATUS CHECK (STATUS IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'))
);

COMMENT ON TABLE TB_POINT_CHARGE IS '포인트 충전 내역';

-- =====================================================
-- 20. 방명록 테이블
-- =====================================================
CREATE TABLE TB_GUESTBOOK (
    GUESTBOOK_NO        NUMBER          PRIMARY KEY,
    HOME_NO             NUMBER          NOT NULL,
    MEMBER_NO           NUMBER          NOT NULL,       -- 작성자
    GUESTBOOK_CONTENT   VARCHAR2(4000)  NOT NULL,
    CREATE_DATE         DATE            DEFAULT SYSDATE,
    IS_DEL              CHAR(1)         DEFAULT 'N',
    IS_SECRET           CHAR(1)         DEFAULT 'N',    -- 비밀글 여부
    FOREIGN KEY (HOME_NO) REFERENCES TB_MEMBER_HOME(HOME_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_GUESTBOOK_DEL CHECK (IS_DEL IN ('Y', 'N')),
    CONSTRAINT CHK_GUESTBOOK_SECRET CHECK (IS_SECRET IN ('Y', 'N'))
);

COMMENT ON TABLE TB_GUESTBOOK IS '방명록';

-- =====================================================
-- 21. 방명록 좋아요
-- =====================================================
CREATE TABLE TB_GUESTBOOK_LIKE (
    GUESTBOOK_NO    NUMBER          NOT NULL,
    MEMBER_NO       NUMBER          NOT NULL,
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    PRIMARY KEY (GUESTBOOK_NO, MEMBER_NO),
    FOREIGN KEY (GUESTBOOK_NO) REFERENCES TB_GUESTBOOK(GUESTBOOK_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO)
);

COMMENT ON TABLE TB_GUESTBOOK_LIKE IS '방명록 좋아요';

-- =====================================================
-- 22. 댓글 테이블 (대댓글 지원)
-- =====================================================
CREATE TABLE TB_COMMENT (
    COMMENT_NO      NUMBER          PRIMARY KEY,
    FEED_NO         NUMBER          NOT NULL,
    WRITER          NUMBER          NOT NULL,
    PARENT_NO       NUMBER,                         -- 부모 댓글 (NULL이면 최상위)
    DEPTH           NUMBER          DEFAULT 0,      -- 0: 댓글, 1: 대댓글
    CONTENT         VARCHAR2(500),                  -- 250 -> 500
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    IS_DEL          CHAR(1)         DEFAULT 'N',
    FOREIGN KEY (FEED_NO) REFERENCES TB_FEED(FEED_NO) ON DELETE CASCADE,
    FOREIGN KEY (WRITER) REFERENCES TB_MEMBER(MEMBER_NO),
    FOREIGN KEY (PARENT_NO) REFERENCES TB_COMMENT(COMMENT_NO),
    CONSTRAINT CHK_COMMENT_DEL CHECK (IS_DEL IN ('Y', 'N')),
    CONSTRAINT CHK_COMMENT_DEPTH CHECK (DEPTH IN (0, 1))
);

COMMENT ON TABLE TB_COMMENT IS '피드 댓글 (대댓글 지원)';
COMMENT ON COLUMN TB_COMMENT.PARENT_NO IS 'NULL이면 최상위 댓글';
COMMENT ON COLUMN TB_COMMENT.DEPTH IS '0: 댓글, 1: 대댓글';

-- =====================================================
-- 23. 댓글 좋아요
-- =====================================================
CREATE TABLE TB_COMMENT_LIKE (
    COMMENT_LIKE_NO NUMBER          PRIMARY KEY,
    COMMENT_NO      NUMBER          NOT NULL,
    MEMBER_NO       NUMBER          NOT NULL,
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    UNIQUE (COMMENT_NO, MEMBER_NO),
    FOREIGN KEY (COMMENT_NO) REFERENCES TB_COMMENT(COMMENT_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO)
);

COMMENT ON TABLE TB_COMMENT_LIKE IS '댓글 좋아요';

-- =====================================================
-- 24. 스토리 테이블 (파일 컬럼 제거)
-- =====================================================
CREATE TABLE TB_STORY (
    STORY_NO        NUMBER          PRIMARY KEY,
    MEMBER_NO       NUMBER          NOT NULL,
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    EXPIRE_DATE     DATE            DEFAULT SYSDATE + 1,    -- 기본 24시간
    VIEW_COUNT      NUMBER          DEFAULT 0,
    IS_DEL          CHAR(1)         DEFAULT 'N',
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_STORY_DEL CHECK (IS_DEL IN ('Y', 'N'))
);

COMMENT ON TABLE TB_STORY IS '스토리 (24시간 후 만료)';
-- 파일 정보는 TB_STORY_ITEM에서 관리

-- =====================================================
-- 25. 스토리 아이템 (여러 사진/동영상)
-- =====================================================
CREATE TABLE TB_STORY_ITEM (
    ITEM_NO         NUMBER          PRIMARY KEY,
    STORY_NO        NUMBER          NOT NULL,
    ITEM_ORDER      NUMBER          NOT NULL,
    ORIGIN_NAME     VARCHAR2(200),
    CHANGE_NAME     VARCHAR2(200),
    FILE_PATH       VARCHAR2(500),
    FILE_TYPE       VARCHAR2(20)    DEFAULT 'IMAGE', -- IMAGE, VIDEO
    STORY_TEXT      VARCHAR2(300),
    DURATION        NUMBER          DEFAULT 5,       -- 표시 시간(초)
    IS_DEL          CHAR(1)         DEFAULT 'N',
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    FOREIGN KEY (STORY_NO) REFERENCES TB_STORY(STORY_NO) ON DELETE CASCADE,
    CONSTRAINT CHK_STORY_ITEM_DEL CHECK (IS_DEL IN ('Y', 'N')),
    CONSTRAINT CHK_STORY_ITEM_TYPE CHECK (FILE_TYPE IN ('IMAGE', 'VIDEO'))
);

COMMENT ON TABLE TB_STORY_ITEM IS '스토리 내 개별 아이템';

-- =====================================================
-- 26. 스토리 조회자 (읽음 기록)
-- =====================================================
CREATE TABLE TB_STORY_VISITOR (
    STORY_NO        NUMBER          NOT NULL,
    MEMBER_NO       NUMBER          NOT NULL,
    VIEW_DATE       DATE            DEFAULT SYSDATE,
    PRIMARY KEY (STORY_NO, MEMBER_NO),
    FOREIGN KEY (STORY_NO) REFERENCES TB_STORY(STORY_NO) ON DELETE CASCADE,
    FOREIGN KEY (MEMBER_NO) REFERENCES TB_MEMBER(MEMBER_NO)
);

COMMENT ON TABLE TB_STORY_VISITOR IS '스토리 조회 기록';

-- =====================================================
-- 27. 알림 테이블
-- =====================================================
CREATE TABLE TB_NOTIFICATION (
    NOTIFICATION_NO NUMBER          PRIMARY KEY,
    RECEIVER_NO     NUMBER          NOT NULL,
    SENDER_NO       NUMBER          NOT NULL,
    TYPE            VARCHAR2(20)    NOT NULL,
    TARGET_TYPE     VARCHAR2(20),                   -- FEED, COMMENT, STORY 등
    TARGET_NO       NUMBER,                         -- 대상 ID
    MESSAGE         VARCHAR2(200),                  -- 알림 메시지
    IS_READ         CHAR(1)         DEFAULT 'N',
    CREATE_DATE     DATE            DEFAULT SYSDATE,
    FOREIGN KEY (RECEIVER_NO) REFERENCES TB_MEMBER(MEMBER_NO) ON DELETE CASCADE,
    FOREIGN KEY (SENDER_NO) REFERENCES TB_MEMBER(MEMBER_NO),
    CONSTRAINT CHK_NOTI_READ CHECK (IS_READ IN ('Y', 'N')),
    CONSTRAINT CHK_NOTI_TYPE CHECK (TYPE IN ('LIKE', 'COMMENT', 'FOLLOW', 'FOLLOW_REQUEST', 'FOLLOW_ACCEPT', 'DM', 'MENTION', 'SYSTEM'))
);

COMMENT ON TABLE TB_NOTIFICATION IS '알림';
COMMENT ON COLUMN TB_NOTIFICATION.TYPE IS 'LIKE, COMMENT, FOLLOW, FOLLOW_REQUEST, FOLLOW_ACCEPT, DM, MENTION, SYSTEM';

--------------------------------------------------------
-- 5. 인덱스 생성
--------------------------------------------------------

-- 회원 관련
CREATE INDEX IDX_MEMBER_NICK ON TB_MEMBER(MEMBER_NICK);
CREATE INDEX IDX_MEMBER_EMAIL ON TB_MEMBER(EMAIL);
CREATE INDEX IDX_MEMBER_STATUS ON TB_MEMBER(STATUS);

-- 피드 관련
CREATE INDEX IDX_FEED_MEMBER ON TB_FEED(MEMBER_NO);
CREATE INDEX IDX_FEED_DATE ON TB_FEED(CREATED_DATE DESC);
CREATE INDEX IDX_FEED_TAG ON TB_FEED(TAG);
CREATE INDEX IDX_FEED_DEL ON TB_FEED(IS_DEL);
CREATE INDEX IDX_FEED_FILE_FEED ON TB_FEED_FILE(FEED_NO);

-- 댓글 관련
CREATE INDEX IDX_COMMENT_FEED ON TB_COMMENT(FEED_NO);
CREATE INDEX IDX_COMMENT_WRITER ON TB_COMMENT(WRITER);
CREATE INDEX IDX_COMMENT_PARENT ON TB_COMMENT(PARENT_NO);

-- 스토리 관련
CREATE INDEX IDX_STORY_MEMBER ON TB_STORY(MEMBER_NO);
CREATE INDEX IDX_STORY_EXPIRE ON TB_STORY(EXPIRE_DATE);
CREATE INDEX IDX_STORY_DEL ON TB_STORY(IS_DEL);
CREATE INDEX IDX_STORY_ITEM_STORY ON TB_STORY_ITEM(STORY_NO);

-- DM 관련
CREATE INDEX IDX_DM_PART_MEMBER ON TB_DM_PARTICIPANT(MEMBER_NO);
CREATE INDEX IDX_DM_MSG_ROOM ON TB_DM_MESSAGE(ROOM_NO, CREATE_DATE DESC);
CREATE INDEX IDX_DM_MSG_SENDER ON TB_DM_MESSAGE(SENDER_NO);

-- 팔로우/홈 관련
CREATE INDEX IDX_FOLLOWS_HOME ON TB_FOLLOWS(HOME_NO);
CREATE INDEX IDX_FOLLOWS_STATUS ON TB_FOLLOWS(STATUS);
CREATE INDEX IDX_HOME_MEMBER ON TB_MEMBER_HOME(MEMBER_NO);
CREATE INDEX IDX_VISITOR_HOME ON TB_HOME_VISITOR(HOME_NO, VISIT_DATE);

-- 알림 관련
CREATE INDEX IDX_NOTI_RECEIVER ON TB_NOTIFICATION(RECEIVER_NO, IS_READ);
CREATE INDEX IDX_NOTI_DATE ON TB_NOTIFICATION(CREATE_DATE DESC);

-- 신고 관련
CREATE INDEX IDX_REPORT_TYPE_TARGET ON TB_REPORT(REPORT_TYPE, TARGET_NO);
CREATE INDEX IDX_REPORT_STATUS ON TB_REPORT(PROCESS_STATUS);
CREATE INDEX IDX_REPORT_REPORTER ON TB_REPORT(REPORTER_NO);

-- 포인트 관련
CREATE INDEX IDX_POINT_HISTORY_MEMBER ON TB_POINT_HISTORY(MEMBER_NO, CREATE_DATE DESC);
CREATE INDEX IDX_POINT_HISTORY_TYPE ON TB_POINT_HISTORY(TYPE);

-- 결제 관련
CREATE INDEX IDX_PAYMENT_MEMBER ON TB_PAYMENT(MEMBER_NO);
CREATE INDEX IDX_PAYMENT_DATE ON TB_PAYMENT(PAYMENT_DATE DESC);

--------------------------------------------------------
-- 6. 트리거 생성 (자동화)
--------------------------------------------------------

-- 회원 가입 시 자동으로 홈피 + 포인트 지갑 생성
CREATE OR REPLACE TRIGGER TRG_MEMBER_AFTER_INSERT
AFTER INSERT ON TB_MEMBER
FOR EACH ROW
BEGIN
    -- 홈피 자동 생성
    INSERT INTO TB_MEMBER_HOME (HOME_NO, HOME_TITLE, MEMBER_NO)
    VALUES (SEQ_HOME_NO.NEXTVAL, :NEW.MEMBER_NICK || '의 홈', :NEW.MEMBER_NO);
    
    -- 포인트 지갑 자동 생성
    INSERT INTO TB_POINT_WALLET (WALLET_NO, MEMBER_NO, BALANCE)
    VALUES (SEQ_WALLET_NO.NEXTVAL, :NEW.MEMBER_NO, 0);
END;
/

-- 포인트 이력 추가 시 자동으로 지갑 잔액 업데이트
CREATE OR REPLACE TRIGGER TRG_POINT_HISTORY_AFTER_INSERT
AFTER INSERT ON TB_POINT_HISTORY
FOR EACH ROW
BEGIN
    UPDATE TB_POINT_WALLET 
    SET BALANCE = :NEW.BALANCE_AFTER,
        LAST_UPDATE = SYSDATE
    WHERE MEMBER_NO = :NEW.MEMBER_NO;
END;
/

-- 스토리 생성 시 만료일 자동 설정 (24시간 후)
CREATE OR REPLACE TRIGGER TRG_STORY_BEFORE_INSERT
BEFORE INSERT ON TB_STORY
FOR EACH ROW
BEGIN
    IF :NEW.EXPIRE_DATE IS NULL THEN
        :NEW.EXPIRE_DATE := SYSDATE + 1;
    END IF;
END;
/

--------------------------------------------------------
-- 7. 뷰 생성 (자주 사용하는 조회)
--------------------------------------------------------

-- 피드 + 좋아요/댓글 수 뷰
CREATE OR REPLACE VIEW VW_FEED_STATS AS
SELECT 
    F.FEED_NO,
    F.MEMBER_NO,
    F.CONTENT,
    F.CREATED_DATE,
    NVL(L.LIKE_COUNT, 0) AS LIKE_COUNT,
    NVL(C.COMMENT_COUNT, 0) AS COMMENT_COUNT,
    NVL(B.BOOKMARK_COUNT, 0) AS BOOKMARK_COUNT
FROM TB_FEED F
LEFT JOIN (
    SELECT FEED_NO, COUNT(*) AS LIKE_COUNT 
    FROM TB_FEED_LIKE GROUP BY FEED_NO
) L ON F.FEED_NO = L.FEED_NO
LEFT JOIN (
    SELECT FEED_NO, COUNT(*) AS COMMENT_COUNT 
    FROM TB_COMMENT WHERE IS_DEL = 'N' GROUP BY FEED_NO
) C ON F.FEED_NO = C.FEED_NO
LEFT JOIN (
    SELECT FEED_NO, COUNT(*) AS BOOKMARK_COUNT 
    FROM TB_FEED_BOOKMARK GROUP BY FEED_NO
) B ON F.FEED_NO = B.FEED_NO
WHERE F.IS_DEL = 'N';

-- 회원 + 포인트 잔액 뷰
CREATE OR REPLACE VIEW VW_MEMBER_WITH_POINT AS
SELECT 
    M.MEMBER_NO,
    M.MEMBER_ID,
    M.MEMBER_NAME,
    M.MEMBER_NICK,
    M.EMAIL,
    M.STATUS,
    M.CREATE_DATE,
    NVL(W.BALANCE, 0) AS POINT_BALANCE
FROM TB_MEMBER M
LEFT JOIN TB_POINT_WALLET W ON M.MEMBER_NO = W.MEMBER_NO;

--------------------------------------------------------
-- 8. 초기 데이터 삽입 (테스트용)
--------------------------------------------------------

-- 테스트용 회원 데이터 삽입 (트리거가 홈피와 포인트 지갑 자동 생성)
INSERT INTO TB_MEMBER (MEMBER_NO, MEMBER_ID, MEMBER_PWD, MEMBER_NAME, MEMBER_NICK, EMAIL, PHONE, GENDER, BIRTHDAY, STATUS)
VALUES (SEQ_MEMBER_NO.NEXTVAL, 'testuser', '$2a$10$N7P8Yw1qU5KvQ5rKqLqLJ.nQ5Y4R8Z9Z8Y7Y6Y5Y4Y3Y2Y1Y0Y9Y8Y', '테스트유저', '테스터', 'test@test.com', '010-1234-5678', 'M', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'Y');

-- 테스트용 포인트 적립
INSERT INTO TB_POINT_HISTORY (HISTORY_NO, MEMBER_NO, AMOUNT, TYPE, BALANCE_AFTER, DESCRIPTION)
VALUES (SEQ_POINT_HISTORY_NO.NEXTVAL, 1, 10000, 'BONUS', 10000, '신규 가입 보너스');

-- 관리자 계정
INSERT INTO TB_MEMBER (MEMBER_NO, MEMBER_ID, MEMBER_PWD, MEMBER_NAME, MEMBER_NICK, EMAIL, PHONE, GENDER, STATUS)
VALUES (SEQ_MEMBER_NO.NEXTVAL, 'admin', '$2a$10$N7P8Yw1qU5KvQ5rKqLqLJ.nQ5Y4R8Z9Z8Y7Y6Y5Y4Y3Y2Y1Y0Y9Y8Y', '관리자', 'ADMIN', 'admin@retrogram.com', '010-0000-0000', 'N', 'Y');

COMMIT;

--------------------------------------------------------
-- 9. 권한 설정 (필요 시)
--------------------------------------------------------
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TB_MEMBER TO APP_USER;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TB_FEED TO APP_USER;
-- ... 필요한 권한 설정

--------------------------------------------------------
-- END OF SCRIPT
--------------------------------------------------------

