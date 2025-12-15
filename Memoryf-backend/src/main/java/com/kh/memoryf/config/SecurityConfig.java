package com.kh.memoryf.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public static BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 사진파일 허용하기
                .requestMatchers("/images/**").permitAll()
                .requestMatchers("/resources/**").permitAll()
                .requestMatchers("/css/**", "/js/**").permitAll()
                // 일단 전체 허용했음
                .anyRequest().permitAll()
            )
            // 로그인폼 삭제
            .formLogin(form -> form.disable());

        return http.build();
    }
}
