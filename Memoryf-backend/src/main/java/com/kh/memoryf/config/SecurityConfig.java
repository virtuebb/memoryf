package com.kh.memoryf.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	private JwtAuthFilter jwtAuthFilter;

	// 암호화
    @Bean
    public static BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    // 로그인 CORS 설정 ( cors 활성화 + OPTIONS 허용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    	
    		CorsConfiguration config = new CorsConfiguration();
    		
    		// 🌐 네트워크 내 모든 Origin 허용 (개발/테스트용)
    		// setAllowedOriginPatterns: 와일드카드 패턴 지원 + allowCredentials(true) 호환
    		config.addAllowedOriginPattern("http://localhost:*");
    		config.addAllowedOriginPattern("http://192.168.*.*:*");
    		config.addAllowedOriginPattern("http://127.0.0.1:*");
        	
    		config.addAllowedHeader("*");
    		config.addAllowedMethod("*");
    		config.setAllowCredentials(true);
    		config.setMaxAge(3600L);
    		
    		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    		source.registerCorsConfiguration("/**", config);
    		
    		return source;
    }
    
    // Spring Security 보안 규칙과 필터 체인 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	
    		http.cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용 - 리액트 요청 허용
    			.csrf(csrf -> csrf.disable()) // CSRF 방어가 필요 없음 - 쿠키 기반 세션 안 씀, JWT 방식이라서

    			.sessionManagement(session -> session.sessionCreationPolicy(
    					org.springframework.security.config.http.SessionCreationPolicy.STATELESS)) // JWT 인증방식임 - 세션 아님
    			.authorizeHttpRequests(auth -> auth.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // 프리플라이트(OPTIONS) 요청 모두 허용
    					.requestMatchers("/images/**", "/resources/**", "/css/**", "/js/**", "/feed_upfiles/**").permitAll() // 정적 리소스 및 업로드 이미지 모두 허용
    					.requestMatchers("/login/**").permitAll() // 로그인 요청 허용 - @RequestMapping("login") 관련
    					.requestMatchers("/ws/**").permitAll() // 🔌 WebSocket 엔드포인트 허용 (SockJS 포함)
    					.anyRequest().authenticated() // 나머지는 JWT 인증 필요함
    				)
    				.formLogin(form -> form.disable()) // 스프링 방식의 로그인 막기
    				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // JWT 검증 필터 추가
    		
    		return http.build();
    	
    }
    
    
}














