package com.kh.memoryf.report.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import com.kh.memoryf.report.model.vo.Report;

/**
 * 신고 서비스 인터페이스
 */
public interface ReportService {

    // ==================== 피드 신고 ====================
    
    /**
     * 피드 신고 등록
     * @param report 신고 정보
     * @return 등록 결과 (1: 성공, 0: 실패, -1: 중복)
     */
    int reportFeed(Report report);
    
    /**
     * 피드 신고 목록 조회 (관리자용)
     * @return 피드 신고 목록
     */
    ArrayList<Report> getFeedReportList();
    
    /**
     * 피드 신고 상세 조회
     * @param reportId 신고 ID
     * @return 신고 상세 정보
     */
    Report getFeedReport(int reportId);
    
    /**
     * 피드 신고 처리 (승인: 피드 삭제 / 거절)
     * @param reportId 신고 ID
     * @param action 처리 액션 (APPROVE / REJECT)
     * @return 처리 결과
     */
    int processFeedReport(int reportId, String action);

    // ==================== 댓글 신고 ====================
    
    /**
     * 댓글 신고 등록
     * @param report 신고 정보
     * @return 등록 결과 (1: 성공, 0: 실패, -1: 중복)
     */
    int reportComment(Report report);
    
    /**
     * 댓글 신고 목록 조회 (관리자용)
     * @return 댓글 신고 목록
     */
    ArrayList<Report> getCommentReportList();
    
    /**
     * 댓글 신고 상세 조회
     * @param reportId 신고 ID
     * @return 신고 상세 정보
     */
    Report getCommentReport(int reportId);
    
    /**
     * 댓글 신고 처리 (승인: 댓글 삭제 / 거절)
     * @param reportId 신고 ID
     * @param action 처리 액션 (APPROVE / REJECT)
     * @return 처리 결과
     */
    int processCommentReport(int reportId, String action);
    
    // ==================== 통계 ====================
    
    /**
     * 신고 통계 조회 (관리자용)
     * @return 통계 데이터
     */
    HashMap<String, Object> getReportStats();
}
