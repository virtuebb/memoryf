-- 테스트용 회원 데이터 삽입
-- 피드 업로드 테스트를 위한 기본 회원 데이터

-- 회원 시퀀스가 없으므로 직접 번호 지정
INSERT INTO TB_MEMBER (
    MEMBER_NO,
    MEMBER_ID,
    MEMBER_PWD,
    MEMBER_NAME,
    MEMBER_NICK,
    EMAIL,
    PHONE,
    GENDER,
    BIRTHDAY,
    CREATE_DATE,
    STATUS
) VALUES (
    1,
    'testuser',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwy7pJ5m', -- 비밀번호: test1234 (BCrypt 암호화)
    '테스트사용자',
    '테스트닉네임',
    'test@test.com',
    '010-1234-5678',
    'M',
    TO_DATE('1990-01-01', 'YYYY-MM-DD'),
    SYSDATE,
    'N'
);

-- 회원 홈피 데이터도 생성 (선택사항)
INSERT INTO TB_MEMBER_HOME (
    HOME_NO,
    HOME_TITLE,
    STATUS_MSG,
    IS_PRIVATE_PROFILE,
    IS_PRIVATE_VISIT,
    IS_PRIVATE_FOLLOW,
    MEMBER_NO
) VALUES (
    SEQ_HOME_NO.NEXTVAL,
    '테스트 사용자의 홈피',
    '안녕하세요! 테스트 사용자입니다.',
    'N',
    'N',
    'N',
    1
);

COMMIT;

