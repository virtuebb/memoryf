package com.kh.memoryf.common.exception;

/**
 * 리소스 미발견 예외
 * 
 * 요청한 리소스가 존재하지 않을 때 발생
 */
public class NotFoundException extends BusinessException {
    
    public NotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message);
    }
    
    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public NotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
