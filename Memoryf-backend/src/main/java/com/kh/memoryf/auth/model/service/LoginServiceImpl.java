package com.kh.memoryf.auth.model.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.memoryf.auth.model.dao.LoginDao;
import com.kh.memoryf.auth.model.vo.Login;

@Service
public class LoginServiceImpl implements LoginService {

	@Autowired
	private LoginDao loginDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	// 암호문
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	// 로그인 요청 처리
	@Override
	public Login loginMember(Login login) {
		
		// 회원 조회
		Login loginUser = loginDao.loginMember(login, sqlSession);
		
		// 아이디 없는 경우
		if(loginUser == null) {
			
			// 로그인 실패
			return null;
		}
		
		// 비밀번호 비교 (입력한 값 vs DB에 암호화된 값)
		if(!bCryptPasswordEncoder.matches(login.getMemberPwd(), loginUser.getMemberPwd())) {
			
			// 로그인 실패
			return null;
		}
		
		// 로그인 성공
		return loginUser;
	}
	

}
