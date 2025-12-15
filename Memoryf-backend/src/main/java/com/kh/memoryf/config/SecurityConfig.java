package com.kh.memoryf.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public static BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.addAllowedOrigin("http://localhost:5173");
		configuration.addAllowedOrigin("http://localhost:5174");
		configuration.addAllowedMethod("*");
		configuration.addAllowedHeader("*");
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
			.csrf(csrf -> csrf.disable()) // CSRF 비활성화 (REST API이므로)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)) // 세션 사용 (필요시)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/feeds/**").permitAll() // 피드 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/member/**").permitAll() // 회원 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/home/**").permitAll() // 홈 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/guestbook/**").permitAll() // 방명록 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/comment/**").permitAll() // 댓글 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/story/**").permitAll() // 스토리 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/diary/**").permitAll() // 다이어리 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/dm/**").permitAll() // DM 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/follow/**").permitAll() // 팔로우 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/payment/**").permitAll() // 결제 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/report/**").permitAll() // 신고 관련 경로는 인증 없이 접근 가능
				.requestMatchers("/admin/**").authenticated() // 관리자 경로는 인증 필요
				.anyRequest().permitAll() // 나머지 모든 요청은 인증 없이 접근 가능 (개발 단계)
			);
		
		return http.build();
	}
}
