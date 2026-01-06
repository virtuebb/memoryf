package com.kh.memoryf.report.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.comment.model.dao.CommentDao;
import com.kh.memoryf.feed.model.dao.FeedDao;
import com.kh.memoryf.report.model.dao.ReportDao;
import com.kh.memoryf.report.model.vo.Report;

/**
 * 신고 서비스 구현체
 */
@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportDao reportDao;
    
    @Autowired
    private FeedDao feedDao;
    
    @Autowired
    private CommentDao commentDao;
    
    @Autowired
    private SqlSessionTemplate sqlSession;

    // ==================== 피드 신고 ====================
    
    @Override
    @Transactional
    public int reportFeed(Report report) {
        // 중복 신고 확인
        int exists = reportDao.checkFeedReport(sqlSession, report.getTargetNo(), report.getReporterNo());
        if (exists > 0) {
            return -1; // 이미 신고한 피드
        }
        return reportDao.insertFeedReport(sqlSession, report);
    }

    @Override
    public ArrayList<Report> getFeedReportList() {
        return reportDao.selectFeedReportList(sqlSession);
    }

    @Override
    public Report getFeedReport(int reportNo) {
        return reportDao.selectFeedReport(sqlSession, reportNo);
    }

    @Override
    @Transactional
    public int processFeedReport(int reportNo, String action) {
        Report report = reportDao.selectFeedReport(sqlSession, reportNo);
        if (report == null) {
            return 0;
        }
        
        if ("APPROVE".equalsIgnoreCase(action)) {
            // 피드 삭제 (소프트 딜리트)
            feedDao.deleteFeed(sqlSession, report.getTargetNo());
            report.setProcessStatus("COMPLETED");
        } else {
            report.setProcessStatus("REJECTED");
        }
        
        return reportDao.updateFeedReportStatus(sqlSession, report);
    }

    // ==================== 댓글 신고 ====================
    
    @Override
    @Transactional
    public int reportComment(Report report) {
        // 중복 신고 확인
        int exists = reportDao.checkCommentReport(sqlSession, report.getTargetNo(), report.getReporterNo());
        if (exists > 0) {
            return -1; // 이미 신고한 댓글
        }
        return reportDao.insertCommentReport(sqlSession, report);
    }

    @Override
    public ArrayList<Report> getCommentReportList() {
        return reportDao.selectCommentReportList(sqlSession);
    }

    @Override
    public Report getCommentReport(int reportNo) {
        return reportDao.selectCommentReport(sqlSession, reportNo);
    }

    @Override
    @Transactional
    public int processCommentReport(int reportNo, String action) {
        Report report = reportDao.selectCommentReport(sqlSession, reportNo);
        if (report == null) {
            return 0;
        }
        
        if ("APPROVE".equalsIgnoreCase(action)) {
            // 댓글 삭제 (소프트 딜리트)
            commentDao.deleteComment(sqlSession, report.getTargetNo());
            report.setProcessStatus("COMPLETED");
        } else {
            report.setProcessStatus("REJECTED");
        }
        
        return reportDao.updateCommentReportStatus(sqlSession, report);
    }

    // ==================== 통계 ====================
    
    @Override
    public HashMap<String, Object> getReportStats() {
        return reportDao.selectReportStats(sqlSession);
    }
}
