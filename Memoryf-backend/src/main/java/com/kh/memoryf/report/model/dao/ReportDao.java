package com.kh.memoryf.report.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.report.model.vo.Report;

/**
 * 신고 DAO
 * - 피드 신고, 댓글 신고 DB 처리
 */
@Repository
public class ReportDao {

    // ==================== 피드 신고 ====================
    
    /**
     * 피드 신고 등록
     */
    public int insertFeedReport(SqlSessionTemplate sqlSession, Report report) {
        return sqlSession.insert("reportMapper.insertFeedReport", report);
    }
    
    /**
     * 피드 신고 중복 확인
     */
    public int checkFeedReport(SqlSessionTemplate sqlSession, int feedNo, int memberNo) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("feedNo", feedNo);
        map.put("memberNo", memberNo);
        return sqlSession.selectOne("reportMapper.checkFeedReport", map);
    }
    
    /**
     * 피드 신고 목록 조회 (관리자용)
     */
    public ArrayList<Report> selectFeedReportList(SqlSessionTemplate sqlSession) {
        return new ArrayList<>(sqlSession.selectList("reportMapper.selectFeedReportList"));
    }
    
    /**
     * 피드 신고 상세 조회
     */
    public Report selectFeedReport(SqlSessionTemplate sqlSession, int reportNo) {
        return sqlSession.selectOne("reportMapper.selectFeedReport", reportNo);
    }
    
    /**
     * 피드 신고 처리 (승인/거절)
     */
    public int updateFeedReportStatus(SqlSessionTemplate sqlSession, Report report) {
        return sqlSession.update("reportMapper.updateFeedReportStatus", report);
    }

    // ==================== 댓글 신고 ====================
    
    /**
     * 댓글 신고 등록
     */
    public int insertCommentReport(SqlSessionTemplate sqlSession, Report report) {
        return sqlSession.insert("reportMapper.insertCommentReport", report);
    }
    
    /**
     * 댓글 신고 중복 확인
     */
    public int checkCommentReport(SqlSessionTemplate sqlSession, int commentNo, int memberNo) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("commentNo", commentNo);
        map.put("memberNo", memberNo);
        return sqlSession.selectOne("reportMapper.checkCommentReport", map);
    }
    
    /**
     * 댓글 신고 목록 조회 (관리자용)
     */
    public ArrayList<Report> selectCommentReportList(SqlSessionTemplate sqlSession) {
        return new ArrayList<>(sqlSession.selectList("reportMapper.selectCommentReportList"));
    }
    
    /**
     * 댓글 신고 상세 조회
     */
    public Report selectCommentReport(SqlSessionTemplate sqlSession, int reportNo) {
        return sqlSession.selectOne("reportMapper.selectCommentReport", reportNo);
    }
    
    /**
     * 댓글 신고 처리 (승인/거절)
     */
    public int updateCommentReportStatus(SqlSessionTemplate sqlSession, Report report) {
        return sqlSession.update("reportMapper.updateCommentReportStatus", report);
    }
    
    // ==================== 통계 (관리자용) ====================
    
    /**
     * 전체 신고 개수 조회
     */
    public HashMap<String, Object> selectReportStats(SqlSessionTemplate sqlSession) {
        return sqlSession.selectOne("reportMapper.selectReportStats");
    }
}
