package com.kh.memoryf.payment.model.service;

import java.util.List;

import com.kh.memoryf.payment.model.dto.ChargeRequestDto;
import com.kh.memoryf.payment.model.vo.Bgm;

public interface PaymentService {
	
	// 포트원 결제 검증 및 포인트 충전
	boolean verifyAndChargePoint(int memberNo, ChargeRequestDto chargeRequest);
	
	// BGM 전체 목록 조회
	List<Bgm> getAllBgmList();
	
	// 회원이 구매한 BGM 목록 조회
	List<Bgm> getPurchasedBgmList(int memberNo);
	
	// BGM 구매
	boolean purchaseBgm(int memberNo, com.kh.memoryf.payment.model.dto.BgmPurchaseRequestDto request);
	
	// 회원 포인트 조회
	int getMemberPoint(int memberNo);
	
	// 결제 내역 조회
	List<com.kh.memoryf.payment.model.dto.PaymentHistoryDto> getPaymentHistory(int memberNo);
}

