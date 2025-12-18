package com.kh.memoryf.auth.model.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.auth.model.dao.SignupDao;
import com.kh.memoryf.auth.model.vo.Signup;

@Service
public class SignupServiceImpl implements SignupService {
	
	@Autowired
	private SignupDao signupDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	// 회원추가
	@Override
	@Transactional
	public int insertMember(Signup signup) {

		// 검증 필요한 것들 불러오기
		String memberId = signup.getMemberId();
		String memberPwd = signup.getMemberPwd();
		String memberName = signup.getMemberName();
		String memberNick = signup.getMemberNick();
		
		// 공백 제거
		if(memberId == null || memberPwd == null || memberName == null || memberNick == null
			|| memberId.trim().isEmpty()
			|| memberPwd.trim().isEmpty()
			|| memberName.trim().isEmpty()
			|| memberNick.trim().isEmpty()) {
			
			return 0;
		}
		
		// 아이디, 비번, 닉네임 형식 설정
		if(!memberId.matches("^[a-z0-9]{4,12}$")
			|| !memberPwd.matches("^(?=.*[A-Za-z])(?=.*\\d).{8,16}$")
			|| !memberNick.matches("^[A-Za-z0-9가-힣_.]{2,10}$")) {
			
			return 0;
		}
		
		// 아이디 중복확인 체크
		int count = signupDao.checkMemberId(sqlSession, memberId);
		
		if(count > 0) {
			
			return 0;
		}
		
		// 암호화
		signup.setMemberPwd(bCryptPasswordEncoder.encode(memberPwd));
		
		int result = signupDao.insertMember(sqlSession, signup);
		
		if(result > 0) {
			// 홈 생성
			signupDao.insertHome(sqlSession, signup);
		}
		
		return result;
	}

}
