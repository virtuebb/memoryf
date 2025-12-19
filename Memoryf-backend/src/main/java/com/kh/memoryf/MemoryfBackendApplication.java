package com.kh.memoryf;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.kh.memoryf.**.dao")
@SpringBootApplication
public class MemoryfBackendApplication   {

	public static void main(String[] args) {
		SpringApplication.run(MemoryfBackendApplication.class, args);
	
		System.out.println("잘되나?");
	}

}
