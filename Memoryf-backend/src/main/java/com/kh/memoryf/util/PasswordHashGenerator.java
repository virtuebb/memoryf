package com.kh.memoryf.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 비밀번호 해시 생성 유틸리티
 * 
 * 사용법:
 * 1. 이 클래스를 실행하여 "1234"의 BCrypt 해시를 생성
 * 2. 생성된 해시를 DB에 업데이트
 * 
 * 실행: main 메서드를 실행하면 콘솔에 해시가 출력됩니다.
 */
public class PasswordHashGenerator {
	
	public static void main(String[] args) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		
		// "1234" 비밀번호 해시 생성
		String password = "1234";
		String hash = encoder.encode(password);
		
		System.out.println("=========================================");
		System.out.println("비밀번호: " + password);
		System.out.println("BCrypt 해시: " + hash);
		System.out.println("=========================================");
		System.out.println();
		System.out.println("DB 업데이트 SQL:");
		System.out.println("UPDATE TB_MEMBER");
		System.out.println("SET MEMBER_PWD = '" + hash + "'");
		System.out.println("WHERE MEMBER_ID = 'testuser';");
		System.out.println();
		System.out.println("COMMIT;");
		System.out.println("=========================================");
		
		// 검증
		boolean matches = encoder.matches(password, hash);
		System.out.println("검증 결과: " + (matches ? "✓ 일치" : "✗ 불일치"));
	}
}

