package com.kh.memoryf.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.SignupService;
import com.kh.memoryf.auth.model.vo.Signup;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("signup")
public class SignupController {
	
	@Autowired
	private SignupService signupService;
	
	// 회원추가
	@PostMapping
	public int insertMember(@RequestBody Signup signup) {
		
		return signupService.insertMember(signup);
		
	}
	
	// 아이디 중복 체크
	@PostMapping("check-id")
	public int checkMemberId(@RequestBody String memberId) {
		
		return signupService.checkMemberId(memberId);
	}

}
