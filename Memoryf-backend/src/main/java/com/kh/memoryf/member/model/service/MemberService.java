package com.kh.memoryf.member.model.service;

import java.util.ArrayList;

import com.kh.memoryf.member.model.vo.Member;

public interface MemberService {
	
	// 회원 목록 조회용 서비스
	ArrayList<Member> selectMemberList();
	
	// 회원 상세 조회용 서비스
	Member selectMember(String memberId);
	
	// 회원 정보 수정용 서비스
	int updateMember(Member m);
	
	// 회원 탈퇴용 서비스
	int deleteMember(String memberId);
	
	// 회원 비밀번호 변경 서비스
	int updatePwd(Member m);
	
	// 내 댓글 조회 서비스
	
	
	// 내 좋아요 조회 서비스
	
	
	// 팔로워 팔로우 조회 서비스
	
	// 회원 닉네임 수정 서비스
	int updateMemberNick(Member m);

	// 닉네임으로 회원번호 조회 서비스
	Integer selectMemberNoByNick(String memberNick);
	
}
