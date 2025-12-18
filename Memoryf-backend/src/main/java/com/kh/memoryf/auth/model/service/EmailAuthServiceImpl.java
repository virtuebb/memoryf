package com.kh.memoryf.auth.model.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.kh.memoryf.auth.common.EmailCodeStore;

import jakarta.mail.internet.MimeMessage;


@Service
public class EmailAuthServiceImpl implements EmailAuthService {
	
	@Autowired
	private JavaMailSender mailSender;
	
	@Autowired
	private EmailCodeStore emailCodeStore;
	
	// application.properties 설정한 메일 계정
	@Value("${spring.mail.username}")
	private String fromEmail;
	
	// 인증번호 유효시간 설정
	private static final long EXPIRE_TIME = 5 * 60 * 1000;
	
	// 인증번호 생성 메소드
	private String createCode() {
		
		Random random = new Random();
		String code = "";
		
		for(int i = 0; i < 6; i++) {
			
			code += random.nextInt(10);
		}
		
		return code;
	}

	@Override
	public int sendCode(String email) {

		try {
			
			// 인증번호 생성 6자리
			String code = createCode();
			
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			
			helper.setFrom(fromEmail);
			helper.setTo(email);
			helper.setSubject("MemoryF 이메일 인증번호");
			helper.setText("인증번호: <b>" + code + "</b> <br> 5분 내 입력해주세요.", true);
			
			// 메일 전송
			mailSender.send(message);
			
			// 인증번호 저장
			emailCodeStore.save(email, code, EXPIRE_TIME);
			
			// 성공
			return 1;
		} catch(Exception e) {
			
			e.printStackTrace();
			
			// 실패
			return 0;
		}
		
	}

	@Override
	public int verifyCode(String email, String code) {
		
		boolean result = emailCodeStore.verify(email, code);
		
		if(result) {
			
			// 인증 성공 시 제거
			emailCodeStore.remove(email);
			
			return 1;
		}
		
		return 0;
	}

}
