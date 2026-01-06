package com.kh.memoryf.report.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.report.model.service.ReportService;
import com.kh.memoryf.report.model.vo.Report;

/**
 * 신고 컨트롤러
 * - 피드 신고, 댓글 신고 REST API
 */
@RestController
@RequestMapping("reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // ==================== 피드 신고 ====================
    
    /**
     * 피드 신고 등록
     * POST /reports/feeds
     */
    @PostMapping("/feeds")
    public ApiResponse<Void> reportFeed(@RequestBody Report report) {
        report.setReportType("FEED");
        int result = reportService.reportFeed(report);
        
        if (result > 0) {
            return ApiResponse.success("신고가 접수되었습니다.", null);
        } else if (result == -1) {
            return ApiResponse.error("이미 신고한 게시물입니다.");
        } else {
            return ApiResponse.error("신고 접수에 실패했습니다.");
        }
    }
    
    /**
     * 피드 신고 목록 조회 (관리자용)
     * GET /reports/feeds
     */
    @GetMapping("/feeds")
    public ApiResponse<List<Report>> getFeedReportList() {
        ArrayList<Report> list = reportService.getFeedReportList();
        return ApiResponse.success(list);
    }
    
    /**
     * 피드 신고 상세 조회
     * GET /reports/feeds/{reportId}
     */
    @GetMapping("/feeds/{reportId}")
    public ApiResponse<Report> getFeedReport(@PathVariable("reportId") int reportId) {
        Report report = reportService.getFeedReport(reportId);
        if (report != null) {
            return ApiResponse.success(report);
        } else {
            return ApiResponse.error("신고 정보를 찾을 수 없습니다.");
        }
    }
    
    /**
     * 피드 신고 처리 (관리자용)
     * PUT /reports/feeds/{reportId}/process
     * Body: { "action": "APPROVE" | "REJECT" }
     */
    @PutMapping("/feeds/{reportId}/process")
    public ApiResponse<Void> processFeedReport(
            @PathVariable("reportId") int reportId,
            @RequestBody HashMap<String, String> request) {
        
        String action = request.get("action");
        int result = reportService.processFeedReport(reportId, action);
        
        if (result > 0) {
            String message = "APPROVE".equalsIgnoreCase(action) 
                ? "신고가 승인되어 게시물이 삭제되었습니다." 
                : "신고가 거절되었습니다.";
            return ApiResponse.success(message, null);
        } else {
            return ApiResponse.error("신고 처리에 실패했습니다.");
        }
    }

    // ==================== 댓글 신고 ====================
    
    /**
     * 댓글 신고 등록
     * POST /reports/comments
     */
    @PostMapping("/comments")
    public ApiResponse<Void> reportComment(@RequestBody Report report) {
        report.setReportType("COMMENT");
        int result = reportService.reportComment(report);
        
        if (result > 0) {
            return ApiResponse.success("신고가 접수되었습니다.", null);
        } else if (result == -1) {
            return ApiResponse.error("이미 신고한 댓글입니다.");
        } else {
            return ApiResponse.error("신고 접수에 실패했습니다.");
        }
    }
    
    /**
     * 댓글 신고 목록 조회 (관리자용)
     * GET /reports/comments
     */
    @GetMapping("/comments")
    public ApiResponse<List<Report>> getCommentReportList() {
        ArrayList<Report> list = reportService.getCommentReportList();
        return ApiResponse.success(list);
    }
    
    /**
     * 댓글 신고 상세 조회
     * GET /reports/comments/{reportId}
     */
    @GetMapping("/comments/{reportId}")
    public ApiResponse<Report> getCommentReport(@PathVariable("reportId") int reportId) {
        Report report = reportService.getCommentReport(reportId);
        if (report != null) {
            return ApiResponse.success(report);
        } else {
            return ApiResponse.error("신고 정보를 찾을 수 없습니다.");
        }
    }
    
    /**
     * 댓글 신고 처리 (관리자용)
     * PUT /reports/comments/{reportId}/process
     * Body: { "action": "APPROVE" | "REJECT" }
     */
    @PutMapping("/comments/{reportId}/process")
    public ApiResponse<Void> processCommentReport(
            @PathVariable("reportId") int reportId,
            @RequestBody HashMap<String, String> request) {
        
        String action = request.get("action");
        int result = reportService.processCommentReport(reportId, action);
        
        if (result > 0) {
            String message = "APPROVE".equalsIgnoreCase(action) 
                ? "신고가 승인되어 댓글이 삭제되었습니다." 
                : "신고가 거절되었습니다.";
            return ApiResponse.success(message, null);
        } else {
            return ApiResponse.error("신고 처리에 실패했습니다.");
        }
    }

    // ==================== 통계 (관리자용) ====================
    
    /**
     * 신고 통계 조회
     * GET /reports/stats
     */
    @GetMapping("/stats")
    public ApiResponse<HashMap<String, Object>> getReportStats() {
        HashMap<String, Object> stats = reportService.getReportStats();
        return ApiResponse.success(stats);
    }
}
