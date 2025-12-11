package com.kh.retrogram.member.model.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.kh.retrogram.member.model.vo.Member;

@Service
public class MemberServiceImpl implements MemberService {

	@Override
	public ArrayList<Member> selectMemberList() {
		return null;
	}

	@Override
	public Member selectMember(String memberId) {
		return null;
	}

	@Override
	public int updateMember(Member m) {
		return 0;
	}

	@Override
	public int deleteMember(String memberId) {
		return 0;
	}

	@Override
	public int updatePwd(Member m) {
		return 0;
	}

}
