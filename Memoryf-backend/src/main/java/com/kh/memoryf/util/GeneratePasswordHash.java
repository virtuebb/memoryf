package com.kh.memoryf.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordHash {
	public static void main(String[] args) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
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

