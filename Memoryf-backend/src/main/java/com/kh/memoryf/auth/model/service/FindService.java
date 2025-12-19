package com.kh.memoryf.auth.model.service;

import com.kh.memoryf.member.model.vo.Member;

public interface FindService {
	
	String findId(Member member);
	
	boolean findPwd(Member member);
	
	int resetPwd(String memberId, String encPwd);

}
