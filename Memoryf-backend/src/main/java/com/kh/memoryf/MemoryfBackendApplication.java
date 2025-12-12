package com.kh.memoryf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class MemoryfBackendApplication   {

	public static void main(String[] args) {
		SpringApplication.run(MemoryfBackendApplication.class, args);
	
		System.out.println("잘되나?");
	}

}
