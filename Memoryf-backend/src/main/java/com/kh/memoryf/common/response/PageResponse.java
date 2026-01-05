package com.kh.memoryf.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/**
 * 페이징 응답 클래스
 * 
 * 목록 조회 시 페이징 메타데이터와 함께 반환
 * 
 * @param <T> 목록 항목 타입
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PageResponse<T> {
    
    /** 데이터 목록 */
    private List<T> content;
    
    /** 현재 페이지 번호 (0부터 시작) */
    private int page;
    
    /** 페이지 크기 */
    private int size;
    
    /** 전체 항목 수 */
    private long totalElements;
    
    /** 전체 페이지 수 */
    private int totalPages;
    
    /** 다음 페이지 존재 여부 */
    private boolean hasNext;
    
    /** 이전 페이지 존재 여부 */
    private boolean hasPrevious;
    
    /** 첫 페이지 여부 */
    private boolean isFirst;
    
    /** 마지막 페이지 여부 */
    private boolean isLast;
    
    // 기본 생성자
    public PageResponse() {}
    
    // 전체 필드 생성자
    private PageResponse(List<T> content, int page, int size, long totalElements,
                         int totalPages, boolean hasNext, boolean hasPrevious,
                         boolean isFirst, boolean isLast) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
        this.isFirst = isFirst;
        this.isLast = isLast;
    }
    
    /**
     * PageResponse 생성
     * 
     * @param content 데이터 목록
     * @param page 현재 페이지 번호
     * @param size 페이지 크기
     * @param totalElements 전체 항목 수
     */
    public static <T> PageResponse<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
        
        return new PageResponse<>(
            content,
            page,
            size,
            totalElements,
            totalPages,
            page < totalPages - 1,  // hasNext
            page > 0,               // hasPrevious
            page == 0,              // isFirst
            page >= totalPages - 1  // isLast
        );
    }
    
    /**
     * 빈 페이지 응답 생성
     */
    public static <T> PageResponse<T> empty(int page, int size) {
        return new PageResponse<>(
            List.of(),
            page,
            size,
            0,
            0,
            false,  // hasNext
            false,  // hasPrevious
            true,   // isFirst
            true    // isLast
        );
    }
    
    // ==================== Getters & Setters ====================
    
    public List<T> getContent() {
        return content;
    }
    
    public void setContent(List<T> content) {
        this.content = content;
    }
    
    public int getPage() {
        return page;
    }
    
    public void setPage(int page) {
        this.page = page;
    }
    
    public int getSize() {
        return size;
    }
    
    public void setSize(int size) {
        this.size = size;
    }
    
    public long getTotalElements() {
        return totalElements;
    }
    
    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
    
    public int getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    
    public boolean isHasNext() {
        return hasNext;
    }
    
    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }
    
    public boolean isHasPrevious() {
        return hasPrevious;
    }
    
    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }
    
    public boolean isFirst() {
        return isFirst;
    }
    
    public void setFirst(boolean first) {
        isFirst = first;
    }
    
    public boolean isLast() {
        return isLast;
    }
    
    public void setLast(boolean last) {
        isLast = last;
    }
}
