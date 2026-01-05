package com.kh.memoryf.common.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

/**
 * 표준 API 응답 래퍼 클래스
 * 
 * 모든 API 응답을 일관된 포맷으로 반환
 * 
 * @param <T> 응답 데이터 타입
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    // 기본 생성자
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    // 전체 필드 생성자
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
    
    // ==================== Static Factory Methods ====================
    
    /**
     * 성공 응답 생성 (데이터 포함)
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data);
    }
    
    /**
     * 성공 응답 생성 (커스텀 메시지 + 데이터)
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    /**
     * 성공 응답 생성 (데이터 없음)
     */
    public static ApiResponse<Void> success() {
        return new ApiResponse<>(true, "Success", null);
    }
    
    /**
     * 성공 응답 생성 (메시지만)
     */
    public static ApiResponse<Void> successMessage(String message) {
        return new ApiResponse<>(true, message, null);
    }
    
    /**
     * 에러 응답 생성
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
    
    /**
     * 에러 응답 생성 (에러 데이터 포함)
     */
    public static <T> ApiResponse<T> error(String message, T errorData) {
        return new ApiResponse<>(false, message, errorData);
    }
    
    // ==================== Getters & Setters ====================
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
