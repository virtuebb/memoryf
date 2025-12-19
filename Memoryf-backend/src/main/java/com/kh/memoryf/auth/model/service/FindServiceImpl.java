package com.kh.memoryf.auth.model.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.memoryf.auth.model.dao.FindDao;
import com.kh.memoryf.member.model.vo.Member;

@Service
public class FindServiceImpl implements FindService {
	
	@Autowired
	private FindDao findDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Override
	public String findId(Member member) {
		return findDao.findId(sqlSession, member);
	}

	@Override
	public boolean findPwd(Member member) {
		
		int count = findDao.findPwd(sqlSession, member);
		
		return count > 0;
	}

	@Override
	public int resetPwd(String memberId, String encPwd) {
		
		String encodedPwd = bCryptPasswordEncoder.encode(encPwd);
		
		return findDao.resetPwd(sqlSession, memberId, encodedPwd);
	}

	
}
