package com.kh.retrogram;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class RetrogramBackendApplication   {

	public static void main(String[] args) {
		SpringApplication.run(RetrogramBackendApplication.class, args);
	
		System.out.println("잘되나?");
	}

	// war로 배포하겠다고 코드 작성
	// 추후 삽입
}
