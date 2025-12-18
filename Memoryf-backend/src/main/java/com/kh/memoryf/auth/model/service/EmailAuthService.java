package com.kh.memoryf.auth.model.service;

public interface EmailAuthService {
	
	int sendCode(String email);
	
	int verifyCode(String email, String code);

}
