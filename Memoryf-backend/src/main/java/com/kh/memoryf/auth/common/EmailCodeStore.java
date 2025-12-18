package com.kh.memoryf.auth.common;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class EmailCodeStore {
	
	// 내부 저장용 클래스( VO 역할 아니라서 여기서 생성)
	private static class CodeEntry {
		
		private String code;
		private long expireAt;
		
		public CodeEntry(String code, long expireAt) {
			
			this.code = code;
			this.expireAt = expireAt;
		}
		
		public String getCode() {
			
			return code;
		}
		
		public long getExpireAt() {
			
			return expireAt;
		}
	}
	
	// 이메일별 인증번호 저장
	private Map<String, CodeEntry> store = new ConcurrentHashMap<String, CodeEntry>();

	// 인증번호 저장
	public void save(String email, String code, long ttlMillis) {
		
		long expireAt = System.currentTimeMillis() + ttlMillis;
		
		store.put(email, new CodeEntry(code, expireAt));
	}
	
	// 인증번호 검증
	public boolean verify(String email, String code) {
		
		CodeEntry entry = store.get(email);
		
		if(entry == null) {
			
			return false;
		}
		
		// 만료 확인
		if(System.currentTimeMillis() > entry.getExpireAt()) {
			
			store.remove(email);
			
			return false;
		}
		
		return entry.getCode().equals(code);
	}
	
	// 인증 성공 시 제거
	public void remove(String email) {
		
		store.remove(email);
	}
	
}





