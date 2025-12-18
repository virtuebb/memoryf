package com.kh.memoryf.auth.model.service;

import com.kh.memoryf.auth.model.vo.Signup;

public interface SignupService {
	
	int insertMember(Signup signup);
	
	int checkMemberId(String memberId);
	
	int checkMemberNick(String memberNick);

}
