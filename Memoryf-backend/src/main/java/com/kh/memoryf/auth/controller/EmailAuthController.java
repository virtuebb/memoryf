package com.kh.memoryf.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.EmailAuthService;
import com.kh.memoryf.auth.model.vo.EmailRequest;
import com.kh.memoryf.auth.model.vo.EmailVerifyRequest;

@RestController
@RequestMapping("/signup")
public class EmailAuthController {

	@Autowired
	private EmailAuthService emailAuthService;
	
	// 인증번호 전송
	@PostMapping("/send-code")
	public int sendCode(@RequestBody EmailRequest req) {
		
		return emailAuthService.sendCode(req.getEmail());
	}
	
	// 인증번호 검증
	@PostMapping("/verify-code")
	public int verifyCode(@RequestBody EmailVerifyRequest req) {
		
		return emailAuthService.verifyCode(req.getEmail(), req.getCode());
	}
}
