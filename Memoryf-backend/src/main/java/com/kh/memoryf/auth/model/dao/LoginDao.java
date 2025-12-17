package com.kh.memoryf.auth.model.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.auth.model.vo.Login;

@Repository
public class LoginDao {

	public Login loginMember(Login login, SqlSessionTemplate sqlSession) {
		
		return (Login)sqlSession.selectOne("loginMapper.loginMember", login);
	}

}
