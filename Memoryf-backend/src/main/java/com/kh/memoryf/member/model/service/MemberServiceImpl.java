package com.kh.memoryf.member.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.member.model.dao.MemberDao;
import com.kh.memoryf.member.model.vo.Member;

@Service
public class MemberServiceImpl implements MemberService {
	
	@Autowired
	@SuppressWarnings("unused")
	private MemberDao memberDao;

	@Autowired
	@SuppressWarnings("unused")
	private SqlSessionTemplate sqlSession;
	
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

	@Override
	public int updateMemberNick(Member m) {
		return memberDao.updateMemberNick(sqlSession, m);
	}

}
