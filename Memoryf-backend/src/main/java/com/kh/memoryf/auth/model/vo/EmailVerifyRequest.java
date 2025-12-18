package com.kh.memoryf.auth.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerifyRequest {
	
	// 인증할 이메일
	private String email;
	
	// 입력한 인증번호
	private String code;
	
	public EmailVerifyRequest() {}
	

}
