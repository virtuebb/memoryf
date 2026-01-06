package com.kh.memoryf.payment.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.payment.model.vo.PointHistory;
import com.kh.memoryf.payment.model.vo.PointWallet;

/**
 * 포인트 DAO
 * V3 스키마: TB_POINT_WALLET, TB_POINT_HISTORY 사용
 */
@Repository
public class PointDao {

    // ===========================
    // 포인트 지갑 관련
    // ===========================

    /**
     * 포인트 지갑 조회
     */
    public PointWallet selectPointWallet(SqlSessionTemplate sqlSession, int memberNo) {
        return sqlSession.selectOne("pointMapper.selectPointWallet", memberNo);
    }

    /**
     * 포인트 지갑 생성
     */
    public int insertPointWallet(SqlSessionTemplate sqlSession, int memberNo) {
        return sqlSession.insert("pointMapper.insertPointWallet", memberNo);
    }

    /**
     * 포인트 잔액 조회
     */
    public int selectBalance(SqlSessionTemplate sqlSession, int memberNo) {
        Integer balance = sqlSession.selectOne("pointMapper.selectBalance", memberNo);
        return balance != null ? balance : 0;
    }

    /**
     * 포인트 적립
     */
    public int earnPoints(SqlSessionTemplate sqlSession, int memberNo, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("amount", amount);
        return sqlSession.update("pointMapper.earnPoints", map);
    }

    /**
     * 포인트 사용
     */
    public int spendPoints(SqlSessionTemplate sqlSession, int memberNo, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("amount", amount);
        return sqlSession.update("pointMapper.spendPoints", map);
    }

    /**
     * 포인트 환불
     */
    public int refundPoints(SqlSessionTemplate sqlSession, int memberNo, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("amount", amount);
        return sqlSession.update("pointMapper.refundPoints", map);
    }

    // ===========================
    // 포인트 이력 관련
    // ===========================

    /**
     * 포인트 이력 등록
     */
    public int insertPointHistory(SqlSessionTemplate sqlSession, PointHistory history) {
        return sqlSession.insert("pointMapper.insertPointHistory", history);
    }

    /**
     * 포인트 이력 조회 (회원별)
     */
    public ArrayList<PointHistory> selectPointHistoryList(SqlSessionTemplate sqlSession, int memberNo) {
        return new ArrayList<>(sqlSession.selectList("pointMapper.selectPointHistoryList", memberNo));
    }

    /**
     * 포인트 이력 조회 (페이징)
     */
    public ArrayList<PointHistory> selectPointHistoryListPaged(SqlSessionTemplate sqlSession, 
            int memberNo, int startRow, int endRow) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("startRow", startRow);
        map.put("endRow", endRow);
        return new ArrayList<>(sqlSession.selectList("pointMapper.selectPointHistoryListPaged", map));
    }

    /**
     * 이력 개수 조회
     */
    public int countPointHistory(SqlSessionTemplate sqlSession, int memberNo) {
        Integer count = sqlSession.selectOne("pointMapper.countPointHistory", memberNo);
        return count != null ? count : 0;
    }

    /**
     * 최근 포인트 이력 조회
     */
    public ArrayList<PointHistory> selectRecentPointHistory(SqlSessionTemplate sqlSession, int memberNo, int limit) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("limit", limit);
        return new ArrayList<>(sqlSession.selectList("pointMapper.selectRecentPointHistory", map));
    }

    // ===========================
    // 레거시 호환 (TB_MEMBER.POINT)
    // ===========================

    /**
     * 레거시: 회원 테이블에서 포인트 조회
     */
    public int selectMemberPointLegacy(SqlSessionTemplate sqlSession, int memberNo) {
        Integer point = sqlSession.selectOne("pointMapper.selectMemberPointLegacy", memberNo);
        return point != null ? point : 0;
    }

    /**
     * 레거시: 회원 테이블 포인트 증가
     */
    public int addMemberPointLegacy(SqlSessionTemplate sqlSession, int memberNo, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("amount", amount);
        return sqlSession.update("pointMapper.addMemberPointLegacy", map);
    }

    /**
     * 레거시: 회원 테이블 포인트 차감
     */
    public int deductMemberPointLegacy(SqlSessionTemplate sqlSession, int memberNo, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("amount", amount);
        return sqlSession.update("pointMapper.deductMemberPointLegacy", map);
    }
}

