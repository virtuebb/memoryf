package com.kh.memoryf.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.EmailAuthService;
import com.kh.memoryf.auth.model.vo.EmailRequest;
import com.kh.memoryf.auth.model.vo.EmailVerifyRequest;
import com.kh.memoryf.common.response.ApiResponse;

@RestController
@RequestMapping("/auth")
public class EmailAuthController {

	@Autowired
	private EmailAuthService emailAuthService;
	
	/**
	 * 인증번호 전송
	 * POST /auth/send-code
	 */
	@PostMapping("/send-code")
	public ApiResponse<Integer> sendCode(@RequestBody EmailRequest req) {
		int result = emailAuthService.sendCode(req.getEmail());
		if (result > 0) {
			return ApiResponse.success("인증번호가 발송되었습니다.", result);
		} else {
			return ApiResponse.error("인증번호 발송에 실패했습니다.");
		}
	}
	
	/**
	 * 인증번호 검증
	 * POST /auth/verify-code
	 */
	@PostMapping("/verify-code")
	public ApiResponse<Integer> verifyCode(@RequestBody EmailVerifyRequest req) {
		int result = emailAuthService.verifyCode(req.getEmail(), req.getCode());
		if (result > 0) {
			return ApiResponse.success("인증이 완료되었습니다.", result);
		} else {
			return ApiResponse.error("인증번호가 일치하지 않습니다.");
		}
	}
}
