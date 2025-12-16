package com.kh.memoryf.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.LoginService;
import com.kh.memoryf.auth.model.vo.Login;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("login")
public class LoginController {
	
	@Autowired
	private LoginService loginService;
	
	// 로그인 요청 처리
	// React에서 전달한 JSON 형식의 아이디/비번을 VO로 변환해서 전달받음
	// POST 방식으로 처리
	@PostMapping()
	public String loginMember(@RequestBody Login login) {
		
		
		return loginService.loginMember(login);
		
		
	}
	
	

}
