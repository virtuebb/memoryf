package com.kh.memoryf.auth.model.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.memoryf.auth.model.dao.LoginDao;
import com.kh.memoryf.auth.model.vo.Login;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class LoginServiceImpl implements LoginService {

	@Autowired
	private LoginDao loginDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	// 암호문
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	// JWT 설정 (보안 - application.properties 이동)
	@Value("${jwt.secret}")
	private String secretKey;

	// JWT 설정 (보안 - application.properties 이동) - 만료시간
	@Value("${jwt.expiration}")
	private long expiration;

	
	// 로그인 요청 처리
	@Override
	public String loginMember(Login login) {
		
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
		// JWT 서명(Signature)에 사용할 비밀 키 생성
		// properties 파일에 정의한 jwt.secret 값 기반임.
		// HMAC-SHA256(HS256) 알고리즘에 맞는 Key 객체로 변환
		Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
		
		String jwt = Jwts.builder()
				.setSubject(loginUser.getMemberId()) // JWT subject 값 설정(로그인 식별자)
				.claim("memberNo", loginUser.getMemberNo()) // 회원번호 pk를 claim에 저장
				.claim("memberName", loginUser.getMemberName()) // 회원이름을 claim에 저장
				.setIssuedAt(new Date()) // 토큰 발급시간 설정
				.setExpiration(new Date(System.currentTimeMillis() + expiration)) // 토큰 만료시간 설정
				.signWith(key, SignatureAlgorithm.HS256) // 위에서 생성한 Key와 HS256 알고리즘으로 서명
				.compact(); // JWT 문자열 생성

		
		// 로그인 성공
		return jwt;
	}
	

}
