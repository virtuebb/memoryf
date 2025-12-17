package com.kh.memoryf.auth.model.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.auth.model.dao.SignupDao;
import com.kh.memoryf.auth.model.vo.Signup;

@Service
public class SignupServiceImpl implements SignupService {
	
	@Autowired
	private SignupDao signupDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;

	@Override
	public int insertMember(Signup signup) {

		return 0;
	}

}
