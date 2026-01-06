package com.kh.memoryf.payment.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.payment.model.dao.PointDao;
import com.kh.memoryf.payment.model.vo.PointHistory;
import com.kh.memoryf.payment.model.vo.PointWallet;

/**
 * 포인트 서비스 구현
 * V3 스키마: TB_POINT_WALLET (WALLET_NO PK), TB_POINT_HISTORY
 */
@Service
public class PointServiceImpl implements PointService {

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Autowired
    private PointDao pointDao;

    // ===========================
    // 포인트 지갑 관련
    // ===========================

    @Override
    @Transactional
    public PointWallet getOrCreateWallet(int memberNo) {
        PointWallet wallet = pointDao.selectPointWallet(sqlSession, memberNo);
        if (wallet == null) {
            pointDao.insertPointWallet(sqlSession, memberNo);
            wallet = pointDao.selectPointWallet(sqlSession, memberNo);
        }
        return wallet;
    }

    @Override
    public int getBalance(int memberNo) {
        // V3 테이블에서 조회
        PointWallet wallet = pointDao.selectPointWallet(sqlSession, memberNo);
        if (wallet != null) {
            return wallet.getBalance();
        }
        // 레거시 폴백 (TB_MEMBER.POINT)
        return pointDao.selectMemberPointLegacy(sqlSession, memberNo);
    }

    @Override
    @Transactional
    public int earnPoints(int memberNo, int amount, String description, Integer referenceNo, String referenceType) {
        // 지갑 확보
        getOrCreateWallet(memberNo);
        
        // 포인트 적립
        int result = pointDao.earnPoints(sqlSession, memberNo, amount);
        if (result <= 0) {
            // V3 실패 시 레거시 시도
            pointDao.addMemberPointLegacy(sqlSession, memberNo, amount);
        }
        
        // 현재 잔액 조회
        int balanceAfter = getBalance(memberNo);
        
        // 이력 기록 (양수 금액)
        PointHistory history = new PointHistory();
        history.setMemberNo(memberNo);
        history.setAmount(amount);  // 적립은 양수
        history.setTransactionType(referenceType != null ? referenceType : "BONUS");
        history.setReferenceType(referenceType);
        history.setReferenceNo(referenceNo);
        history.setBalanceAfter(balanceAfter);
        history.setDescription(description);
        
        try {
            pointDao.insertPointHistory(sqlSession, history);
        } catch (Exception e) {
            System.err.println("포인트 이력 저장 실패 (무시): " + e.getMessage());
        }
        
        return balanceAfter;
    }

    @Override
    @Transactional
    public int spendPoints(int memberNo, int amount, String description, Integer referenceNo, String referenceType) {
        // 잔액 확인
        int currentBalance = getBalance(memberNo);
        if (currentBalance < amount) {
            return -1; // 잔액 부족
        }
        
        // 포인트 차감
        int result = pointDao.spendPoints(sqlSession, memberNo, amount);
        if (result <= 0) {
            // V3 실패 시 레거시 시도
            result = pointDao.deductMemberPointLegacy(sqlSession, memberNo, amount);
            if (result <= 0) {
                return -1; // 차감 실패
            }
        }
        
        // 현재 잔액 조회
        int balanceAfter = getBalance(memberNo);
        
        // 이력 기록 (음수 금액)
        PointHistory history = new PointHistory();
        history.setMemberNo(memberNo);
        history.setAmount(-amount);  // 사용은 음수
        history.setTransactionType("USE");
        history.setReferenceType(referenceType);
        history.setReferenceNo(referenceNo);
        history.setBalanceAfter(balanceAfter);
        history.setDescription(description);
        
        try {
            pointDao.insertPointHistory(sqlSession, history);
        } catch (Exception e) {
            System.err.println("포인트 이력 저장 실패 (무시): " + e.getMessage());
        }
        
        return balanceAfter;
    }

    @Override
    @Transactional
    public int refundPoints(int memberNo, int amount, String description, Integer referenceNo) {
        // 포인트 환불
        int result = pointDao.refundPoints(sqlSession, memberNo, amount);
        if (result <= 0) {
            // V3 실패 시 레거시 시도
            pointDao.addMemberPointLegacy(sqlSession, memberNo, amount);
        }
        
        // 현재 잔액 조회
        int balanceAfter = getBalance(memberNo);
        
        // 이력 기록
        PointHistory history = new PointHistory();
        history.setMemberNo(memberNo);
        history.setAmount(amount);  // 환불은 양수
        history.setTransactionType("REFUND");
        history.setReferenceType("REFUND");
        history.setReferenceNo(referenceNo);
        history.setBalanceAfter(balanceAfter);
        history.setDescription(description);
        
        try {
            pointDao.insertPointHistory(sqlSession, history);
        } catch (Exception e) {
            System.err.println("포인트 이력 저장 실패 (무시): " + e.getMessage());
        }
        
        return balanceAfter;
    }

    // ===========================
    // 포인트 이력 관련
    // ===========================

    @Override
    public ArrayList<PointHistory> getPointHistory(int memberNo) {
        return pointDao.selectPointHistoryList(sqlSession, memberNo);
    }

    @Override
    public ArrayList<PointHistory> getPointHistoryPaged(int memberNo, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return pointDao.selectPointHistoryListPaged(sqlSession, memberNo, startRow, endRow);
    }

    @Override
    public ArrayList<PointHistory> getRecentPointHistory(int memberNo, int limit) {
        return pointDao.selectRecentPointHistory(sqlSession, memberNo, limit);
    }

    @Override
    public int countPointHistory(int memberNo) {
        return pointDao.countPointHistory(sqlSession, memberNo);
    }
}
