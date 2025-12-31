package com.kh.memoryf.payment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
	
	@Autowired
	private final PaymentService paymentService;
	
	/**
	 * 포인트 충전 (포트원 결제 검증 후 충전)
	 * POST /payment/charge
	 */
	@PostMapping("/charge")
	public ResponseEntity<Map<String, Object>> chargePoint(
			@RequestBody ChargeRequestDto chargeRequest,
			@RequestParam("memberNo") int memberNo) {
		
		Map<String, Object> response = new HashMap<>();
		
		try {
			boolean result = paymentService.verifyAndChargePoint(memberNo, chargeRequest);
			
			if (result) {
				int currentPoint = paymentService.getMemberPoint(memberNo);
				response.put("success", true);
				response.put("message", "포인트가 충전되었습니다.");
				response.put("currentPoint", currentPoint);
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "포인트 충전에 실패했습니다.");
				return ResponseEntity.badRequest().body(response);
			}
			
		} catch (RuntimeException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "포인트 충전 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.internalServerError().body(response);
		}
	}
	
	/**
	 * BGM 전체 목록 조회
	 * GET /payment/bgm/list
	 */
	@GetMapping("/bgm/list")
	public ResponseEntity<Map<String, Object>> getBgmList() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			List<Bgm> bgmList = paymentService.getAllBgmList();
			response.put("success", true);
			response.put("data", bgmList);
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "BGM 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.internalServerError().body(response);
		}
	}
	
	/**
	 * 회원이 구매한 BGM 목록 조회
	 * GET /payment/bgm/purchased/{memberNo}
	 */
	@GetMapping("/bgm/purchased/{memberNo}")
	public ResponseEntity<Map<String, Object>> getPurchasedBgmList(@PathVariable("memberNo") int memberNo) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			List<Bgm> bgmList = paymentService.getPurchasedBgmList(memberNo);
			response.put("success", true);
			response.put("data", bgmList);
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "구매한 BGM 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.internalServerError().body(response);
		}
	}
	
	/**
	 * BGM 구매
	 * POST /payment/bgm/purchase
	 */
	@PostMapping("/bgm/purchase")
	public ResponseEntity<Map<String, Object>> purchaseBgm(
			@RequestBody BgmPurchaseRequestDto purchaseRequest,
			@RequestParam("memberNo") int memberNo) {
		
		Map<String, Object> response = new HashMap<>();
		
		try {
			boolean result = paymentService.purchaseBgm(memberNo, purchaseRequest.getBgmNo());
			
			if (result) {
				int currentPoint = paymentService.getMemberPoint(memberNo);
				response.put("success", true);
				response.put("message", "BGM을 구매했습니다.");
				response.put("currentPoint", currentPoint);
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "BGM 구매에 실패했습니다.");
				return ResponseEntity.badRequest().body(response);
			}
			
		} catch (RuntimeException e) {
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "BGM 구매 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.internalServerError().body(response);
		}
	}
	
	/**
	 * 회원 포인트 조회
	 * GET /payment/point/{memberNo}
	 */
	@GetMapping("/point/{memberNo}")
	public ResponseEntity<Map<String, Object>> getMemberPoint(@PathVariable("memberNo") int memberNo) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			int point = paymentService.getMemberPoint(memberNo);
			response.put("success", true);
			response.put("point", point);
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "포인트 조회 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.internalServerError().body(response);
		}
	}
	
	/**
	 * 결제 내역 조회
	 * GET /payment/history/{memberNo}
	 */
	@GetMapping("/history/{memberNo}")
	public ResponseEntity<Map<String, Object>> getPaymentHistory(@PathVariable("memberNo") int memberNo) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			List<com.kh.memoryf.payment.model.dto.PaymentHistoryDto> history = paymentService.getPaymentHistory(memberNo);
			response.put("success", true);
			response.put("data", history);
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "결제 내역 조회 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.internalServerError().body(response);
		}
	}
}

