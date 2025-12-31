package com.kh.memoryf.payment.model.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.kh.memoryf.payment.model.dao.PaymentDao;
import com.kh.memoryf.payment.model.dto.ChargeRequestDto;
import com.kh.memoryf.payment.model.dto.PortOneVerificationDto;
import com.kh.memoryf.payment.model.vo.Bgm;
import com.kh.memoryf.payment.model.vo.Payment;
import com.kh.memoryf.payment.model.vo.PointCharge;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImple implements PaymentService {
	
	@Autowired
	private final SqlSession sqlSession;

	@Autowired
	private final PaymentDao paymentDao;

	@Autowired
	private final WebClient.Builder webClientBuilder;
	
	@Value("${portone.api.key}")
	private String portoneApiKey;
	
	@Value("${portone.api.secret}")
	private String portoneApiSecret;
	
	/**
	 * 포트원 결제 검증 및 포인트 충전
	 */
	@Override
	@Transactional
	public boolean verifyAndChargePoint(int memberNo, ChargeRequestDto chargeRequest) {
		// 1. 포트원 결제 검증 (실제 운영에서는 포트원 API 호출)
		log.info("포인트 충전 요청: memberNo={}, amount={}", memberNo, chargeRequest.getAmount());
		
		// 실제 운영 환경에서 포트원 검증 코드
		PortOneVerificationDto verification = verifyPaymentFromPortOne(chargeRequest.getImpUid());
		
		if (verification == null) {
			throw new RuntimeException("포트원 결제 검증 실패: 응답 없음");
		}
		
		if (verification.getAmount() != chargeRequest.getAmount()) {
			log.error("결제 검증 실패: 금액 불일치 (요청: {}, 검증: {})", chargeRequest.getAmount(), verification.getAmount());
			throw new RuntimeException("결제 검증 실패: 금액 불일치");
		}
		
		if (!"paid".equals(verification.getStatus())) {
			log.error("결제 검증 실패: 결제 상태 오류 ({})", verification.getStatus());
			throw new RuntimeException("결제 검증 실패: 결제 상태 오류 (" + verification.getStatus() + ")");
		}
		
		// 2. 포인트 충전 내역 저장
		PointCharge pointCharge = new PointCharge();
		pointCharge.setMemberNo(memberNo);
		pointCharge.setChargeAmount(chargeRequest.getAmount());
		pointCharge.setImpUid(chargeRequest.getImpUid());
		pointCharge.setMerchantUid(chargeRequest.getMerchantUid());
		pointCharge.setPaymentMethod("kakaopay");
		pointCharge.setStatus("COMPLETED");
		
		int chargeResult = paymentDao.insertPointCharge(sqlSession, pointCharge);
		
		if (chargeResult <= 0) {
			throw new RuntimeException("포인트 충전 내역 저장 실패");
		}
		
		// 3. 회원 포인트 업데이트
		int updateResult = paymentDao.updateMemberPoint(sqlSession, memberNo, chargeRequest.getAmount());
		
		if (updateResult <= 0) {
			throw new RuntimeException("회원 포인트 업데이트 실패");
		}
		
		log.info("포인트 충전 완료: memberNo={}, amount={}", memberNo, chargeRequest.getAmount());
		return true;
	}
	
	/**
	 * 포트원 API를 통한 결제 검증 (실제 운영 환경용)
	 */
	private PortOneVerificationDto verifyPaymentFromPortOne(String impUid) {
		try {
			// 1. 포트원 액세스 토큰 발급
			WebClient webClient = webClientBuilder.baseUrl("https://api.iamport.kr").build();
			
			Map<String, String> tokenRequest = Map.of(
				"imp_key", portoneApiKey.trim(),
				"imp_secret", portoneApiSecret.trim()
			);
			
			Map<String, Object> tokenResponse = webClient.post()
				.uri("/users/getToken")
				.bodyValue(tokenRequest)
				.retrieve()
				.bodyToMono(Map.class)
				.block();
			
			if (tokenResponse == null || tokenResponse.get("response") == null) {
				log.error("포트원 액세스 토큰 발급 실패: {}", tokenResponse);
				throw new RuntimeException("포트원 액세스 토큰 발급 실패");
			}
			
			@SuppressWarnings("unchecked")
			Map<String, String> responseData = (Map<String, String>) tokenResponse.get("response");
			String accessToken = responseData.get("access_token");
			
			// 2. 결제 정보 조회
			Map<String, Object> paymentResponse = webClient.get()
				.uri("/payments/" + impUid)
				.header("Authorization", "Bearer " + accessToken)
				.retrieve()
				.bodyToMono(Map.class)
				.block();
			
			if (paymentResponse == null || paymentResponse.get("response") == null) {
				log.error("포트원 결제 정보 조회 실패: {}", paymentResponse);
				throw new RuntimeException("포트원 결제 정보 조회 실패");
			}
			
			@SuppressWarnings("unchecked")
			Map<String, Object> paymentData = (Map<String, Object>) paymentResponse.get("response");
			
			PortOneVerificationDto verification = new PortOneVerificationDto();
			verification.setAmount(((Number) paymentData.get("amount")).intValue());
			verification.setImpUid((String) paymentData.get("imp_uid"));
			verification.setMerchantUid((String) paymentData.get("merchant_uid"));
			verification.setStatus((String) paymentData.get("status"));
			verification.setPayMethod((String) paymentData.get("pay_method"));
			
			return verification;
			
		} catch (Exception e) {
			log.error("포트원 결제 검증 중 오류 발생", e);
			throw new RuntimeException("포트원 결제 검증 중 오류 발생: " + e.getMessage());
		}
	}
	
	/**
	 * BGM 전체 목록 조회
	 */
	@Override
	public List<Bgm> getAllBgmList() {
		return paymentDao.selectAllBgmList(sqlSession);
	}
	
	/**
	 * 회원이 구매한 BGM 목록 조회
	 */
	@Override
	public List<Bgm> getPurchasedBgmList(int memberNo) {
		return paymentDao.selectPurchasedBgmList(sqlSession, memberNo);
	}
	
	/**
	 * BGM 구매
	 */
	@Override
	@Transactional
	public boolean purchaseBgm(int memberNo, int bgmNo) {
		try {
			// 1. BGM 정보 조회
			Bgm bgm = paymentDao.selectBgmByNo(sqlSession, bgmNo);
			
			if (bgm == null) {
				log.error("BGM을 찾을 수 없습니다: bgmNo={}", bgmNo);
				throw new RuntimeException("존재하지 않는 BGM입니다.");
			}
			
			// 2. 이미 구매했는지 확인
			int purchased = paymentDao.checkPurchased(sqlSession, memberNo, bgmNo);
			
			if (purchased > 0) {
				log.error("이미 구매한 BGM입니다: memberNo={}, bgmNo={}", memberNo, bgmNo);
				throw new RuntimeException("이미 구매한 BGM입니다.");
			}
			
			// 3. 회원 포인트 확인
			int memberPoint = paymentDao.selectMemberPoint(sqlSession, memberNo);
			
			if (memberPoint < bgm.getPrice()) {
				log.error("포인트가 부족합니다: memberNo={}, point={}, price={}", memberNo, memberPoint, bgm.getPrice());
				throw new RuntimeException("포인트가 부족합니다.");
			}
			
			// 4. 포인트 차감
			int deductResult = paymentDao.deductMemberPoint(sqlSession, memberNo, bgm.getPrice());
			
			if (deductResult <= 0) {
				log.error("포인트 차감 실패");
				throw new RuntimeException("포인트 차감 처리에 실패했습니다.");
			}
			
			// 5. 구매 내역 저장
			Payment payment = new Payment();
			payment.setMemberNo(memberNo);
			payment.setBgmNo(bgmNo);
			payment.setPaymentAmount(bgm.getPrice());
			payment.setPaymentType("BGM");
			
			int paymentResult = paymentDao.insertBgmPayment(sqlSession, payment);
			
			if (paymentResult <= 0) {
				log.error("구매 내역 저장 실패");
				throw new RuntimeException("구매 내역 저장에 실패했습니다.");
			}
			
			log.info("BGM 구매 완료: memberNo={}, bgmNo={}, price={}", memberNo, bgmNo, bgm.getPrice());
			return true;
			
		} catch (RuntimeException e) {
			throw e;
		} catch (Exception e) {
			log.error("BGM 구매 중 오류 발생", e);
			throw new RuntimeException("BGM 구매 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 회원 포인트 조회
	 */
	@Override
	public int getMemberPoint(int memberNo) {
		return paymentDao.selectMemberPoint(sqlSession, memberNo);
	}
	
	/**
	 * 결제 내역 조회
	 */
	@Override
	public List<com.kh.memoryf.payment.model.dto.PaymentHistoryDto> getPaymentHistory(int memberNo) {
		return paymentDao.selectPaymentHistory(sqlSession, memberNo);
	}
}

