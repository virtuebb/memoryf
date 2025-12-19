package com.kh.memoryf.auth.model.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.member.model.vo.Member;

@Repository
public class FindDao {

	// 아이디 찾기
	public String findId(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.selectOne("findMapper.findId", member);
	}

	// 비번 찾기(count로)
	public int findPwd(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.selectOne("findMapper.findPwd", member);
	}

	// 비밀번호 재설정
	public int resetPwd(SqlSessionTemplate sqlSession, String memberId, String encPwd) {
		
		Member m = new Member();
		m.setMemberId(memberId);
		m.setMemberPwd(encPwd);
		
		return sqlSession.update("findMapper.resetPwd", m);
	}

}
