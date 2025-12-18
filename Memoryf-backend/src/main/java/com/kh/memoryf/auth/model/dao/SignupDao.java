package com.kh.memoryf.auth.model.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.auth.model.vo.Signup;

@Repository
public class SignupDao {

	// 회원 추가 DB 연결
	public int insertMember(SqlSessionTemplate sqlSession, Signup signup) {
		
		return sqlSession.insert("signupMapper.insertMember", signup);
	}
	
	// 홈 생성 DB 연결
	public int insertHome(SqlSessionTemplate sqlSession, Signup signup) {
		return sqlSession.insert("signupMapper.insertHome", signup);
	}

	// 아이디 중복확인 DB 연결
	public int checkMemberId(SqlSessionTemplate sqlSession, String memberId) {
		
		return sqlSession.selectOne("signupMapper.checkMemberId", memberId);
	}

	public int checkMemberNick(SqlSessionTemplate sqlSession, String memberNick) {
		
		return sqlSession.selectOne("signupMapper.checkMemberNick", memberNick);
	}

}
