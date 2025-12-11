package com.kh.retrogram.member.model.service;

import java.util.ArrayList;

import com.kh.retrogram.member.model.vo.Member;

public interface MemberService {
	
	// 회원 목록 조회용 서비스
	ArrayList<Member> selectMemberList();
	
	// 회원 상세 조회용 서비스
	Member selectMember(String memberId);
	
	// 회원 정보 수정용 서비스
	int updateMember(Member m);
	
	// 회원 탈퇴용 서비스
	int deleteMember(String memberId);
}
