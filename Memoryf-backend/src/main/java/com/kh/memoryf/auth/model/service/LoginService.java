package com.kh.memoryf.auth.model.service;

import com.kh.memoryf.auth.model.vo.Login;

public interface LoginService {
	
	// 로그인 처리
	String loginMember(Login login);

}
