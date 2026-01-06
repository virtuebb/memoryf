package com.kh.memoryf.payment.model.service;

import java.util.ArrayList;

import com.kh.memoryf.payment.model.vo.PointHistory;
import com.kh.memoryf.payment.model.vo.PointWallet;

/**
 * 포인트 서비스 인터페이스
 * V3 스키마: TB_POINT_WALLET, TB_POINT_HISTORY 사용
 */
public interface PointService {

    // ===========================
    // 포인트 지갑 관련
    // ===========================

    /**
     * 포인트 지갑 조회 (없으면 생성)
     */
    PointWallet getOrCreateWallet(int memberNo);

    /**
     * 포인트 잔액 조회
     */
    int getBalance(int memberNo);

    /**
     * 포인트 적립
     * @param memberNo 회원번호
     * @param amount 적립 금액
     * @param description 설명
     * @param referenceNo 관련 번호 (옵션)
     * @param referenceType 관련 타입 (CHARGE, EVENT, ADMIN 등)
     * @return 적립 후 잔액
     */
    int earnPoints(int memberNo, int amount, String description, Integer referenceNo, String referenceType);

    /**
     * 포인트 사용
     * @param memberNo 회원번호
     * @param amount 사용 금액
     * @param description 설명
     * @param referenceNo 관련 번호 (옵션)
     * @param referenceType 관련 타입 (PAYMENT 등)
     * @return 사용 후 잔액 (-1이면 잔액 부족)
     */
    int spendPoints(int memberNo, int amount, String description, Integer referenceNo, String referenceType);

    /**
     * 포인트 환불
     */
    int refundPoints(int memberNo, int amount, String description, Integer referenceNo);

    // ===========================
    // 포인트 이력 관련
    // ===========================

    /**
     * 포인트 이력 조회
     */
    ArrayList<PointHistory> getPointHistory(int memberNo);

    /**
     * 포인트 이력 조회 (페이징)
     */
    ArrayList<PointHistory> getPointHistoryPaged(int memberNo, int page, int size);

    /**
     * 최근 포인트 이력 조회
     */
    ArrayList<PointHistory> getRecentPointHistory(int memberNo, int limit);

    /**
     * 이력 총 개수
     */
    int countPointHistory(int memberNo);
}

