package com.kh.memoryf.payment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.payment.model.dto.BgmPurchaseRequestDto;
import com.kh.memoryf.payment.model.dto.ChargeRequestDto;
import com.kh.memoryf.payment.model.service.PaymentService;
import com.kh.memoryf.payment.model.vo.Bgm;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("payment")
@RequiredArgsConstructor
public class PaymentController {
	
	private final PaymentService paymentService;
	
	/**
	 * 포인트 충전 (포트원 결제 검증 후 충전)
	 * POST /payment/charge
	 */
	@PostMapping("/charge")
	public ResponseEntity<ApiResponse<Map<String, Object>>> chargePoint(
			@RequestBody ChargeRequestDto chargeRequest,
			@RequestParam("memberNo") int memberNo) {
		
		try {
			boolean result = paymentService.verifyAndChargePoint(memberNo, chargeRequest);
			
			if (result) {
				int currentPoint = paymentService.getMemberPoint(memberNo);
				Map<String, Object> data = new HashMap<>();
				data.put("currentPoint", currentPoint);
				return ResponseEntity.ok(ApiResponse.success("포인트가 충전되었습니다.", data));
			} else {
				return ResponseEntity.badRequest().body(ApiResponse.error("포인트 충전에 실패했습니다."));
			}
			
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("포인트 충전 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
	
	/**
	 * BGM 전체 목록 조회
	 * GET /payment/bgm/list
	 */
	@GetMapping("/bgm/list")
	public ResponseEntity<ApiResponse<List<Bgm>>> getBgmList() {
		try {
			List<Bgm> bgmList = paymentService.getAllBgmList();
			return ResponseEntity.ok(ApiResponse.success(bgmList));
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("BGM 목록 조회 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
	
	/**
	 * 회원이 구매한 BGM 목록 조회
	 * GET /payment/bgm/purchased/{memberNo}
	 */
	@GetMapping("/bgm/purchased/{memberNo}")
	public ResponseEntity<ApiResponse<List<Bgm>>> getPurchasedBgmList(@PathVariable("memberNo") int memberNo) {
		try {
			List<Bgm> bgmList = paymentService.getPurchasedBgmList(memberNo);
			return ResponseEntity.ok(ApiResponse.success(bgmList));
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("구매한 BGM 목록 조회 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
	
	/**
	 * BGM 구매
	 * POST /payment/bgm/purchase
	 */
	@PostMapping("/bgm/purchase")
	public ResponseEntity<ApiResponse<Map<String, Object>>> purchaseBgm(
			@RequestBody BgmPurchaseRequestDto purchaseRequest,
			@RequestParam("memberNo") int memberNo) {
		
		try {
			boolean result = paymentService.purchaseBgm(memberNo, purchaseRequest);
			
			if (result) {
				int currentPoint = paymentService.getMemberPoint(memberNo);
				Map<String, Object> data = new HashMap<>();
				data.put("currentPoint", currentPoint);
				return ResponseEntity.ok(ApiResponse.success("BGM을 구매했습니다.", data));
			} else {
				return ResponseEntity.badRequest().body(ApiResponse.error("BGM 구매에 실패했습니다."));
			}
			
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("BGM 구매 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
	
	/**
	 * 회원 포인트 조회
	 * GET /payment/point/{memberNo}
	 */
	@GetMapping("/point/{memberNo}")
	public ResponseEntity<ApiResponse<Map<String, Integer>>> getMemberPoint(@PathVariable("memberNo") int memberNo) {
		try {
			int point = paymentService.getMemberPoint(memberNo);
			Map<String, Integer> data = new HashMap<>();
			data.put("point", point);
			return ResponseEntity.ok(ApiResponse.success(data));
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("포인트 조회 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
	
	/**
	 * 결제 내역 조회
	 * GET /payment/history/{memberNo}
	 */
	@GetMapping("/history/{memberNo}")
	public ResponseEntity<ApiResponse<List<com.kh.memoryf.payment.model.dto.PaymentHistoryDto>>> getPaymentHistory(@PathVariable("memberNo") int memberNo) {
		try {
			List<com.kh.memoryf.payment.model.dto.PaymentHistoryDto> history = paymentService.getPaymentHistory(memberNo);
			return ResponseEntity.ok(ApiResponse.success(history));
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("결제 내역 조회 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
}

