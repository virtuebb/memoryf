package com.kh.memoryf.common.exception;

/**
 * 에러 코드 열거형
 * 
 * HTTP 상태 코드와 메시지를 정의
 */
public enum ErrorCode {
    
    // 400 Bad Request
    BAD_REQUEST(400, "잘못된 요청입니다."),
    INVALID_INPUT_VALUE(400, "입력값이 올바르지 않습니다."),
    INVALID_TYPE_VALUE(400, "타입이 올바르지 않습니다."),
    
    // 401 Unauthorized
    UNAUTHORIZED(401, "인증이 필요합니다."),
    INVALID_TOKEN(401, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(401, "만료된 토큰입니다."),
    
    // 403 Forbidden
    FORBIDDEN(403, "접근 권한이 없습니다."),
    ACCESS_DENIED(403, "접근이 거부되었습니다."),
    
    // 404 Not Found
    NOT_FOUND(404, "리소스를 찾을 수 없습니다."),
    MEMBER_NOT_FOUND(404, "회원을 찾을 수 없습니다."),
    FEED_NOT_FOUND(404, "피드를 찾을 수 없습니다."),
    COMMENT_NOT_FOUND(404, "댓글을 찾을 수 없습니다."),
    HOME_NOT_FOUND(404, "홈을 찾을 수 없습니다."),
    
    // 409 Conflict
    CONFLICT(409, "리소스 충돌이 발생했습니다."),
    DUPLICATE_RESOURCE(409, "이미 존재하는 리소스입니다."),
    ALREADY_FOLLOWING(409, "이미 팔로우 중입니다."),
    ALREADY_LIKED(409, "이미 좋아요를 눌렀습니다."),
    
    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다."),
    DATABASE_ERROR(500, "데이터베이스 오류가 발생했습니다."),
    FILE_UPLOAD_ERROR(500, "파일 업로드 중 오류가 발생했습니다.");
    
    private final int status;
    private final String message;
    
    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
    
    public int getStatus() {
        return status;
    }
    
    public String getMessage() {
        return message;
    }
}
