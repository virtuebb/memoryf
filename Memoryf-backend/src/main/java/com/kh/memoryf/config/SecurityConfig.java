package com.kh.memoryf.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
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

		// 명시적 Origin 지정
		config.addAllowedOrigin("http://localhost:5173");
		config.addAllowedOrigin("http://192.168.150.10:5173/*");
		config.addAllowedOrigin("http://192.168.150.183:5173");
		// 개발 환경에서 IP가 바뀔 수 있으므로 패턴도 허용
		config.addAllowedOriginPattern("http://192.168.*.*:5173");

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

			http
			.cors(Customizer.withDefaults())   
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(
					org.springframework.security.config.http.SessionCreationPolicy.STATELESS)) // JWT 인증방식임 - 세션 아님
			.authorizeHttpRequests(auth -> auth.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // 프리플라이트(OPTIONS) 요청 모두 허용
				    
					.requestMatchers(HttpMethod.POST, "/visitor/**", "/memoryf/visitor/**").authenticated()
					.requestMatchers(HttpMethod.GET,  "/visitor/**", "/memoryf/visitor/**").permitAll()

					.requestMatchers("/images/**", "/resources/**", "/css/**", "/js/**", "/feed_upfiles/**", "/profile_images/**").permitAll() // 정적 리소스 및 업로드 이미지 모두 허용
					.requestMatchers("/login/**", "/signup/**").permitAll() // 로그인, 회원가입 요청 허용 - @RequestMapping
					.requestMatchers("/ws/**").permitAll() // 🔌 WebSocket 엔드포인트 허용 (SockJS 포함)
					.requestMatchers("/messages/**").permitAll() // 🔌 WebSocket 엔드포인트 허용 (SockJS 포함)
					.requestMatchers(HttpMethod.GET, "/bgm/**", "/memoryf/bgm/**").permitAll() // 멜론 차트 공개 조회 허용
					
					// Story
					.requestMatchers(HttpMethod.GET, "/story/**", "/memoryf/story/**").permitAll()
					.requestMatchers(HttpMethod.POST, "/story/**", "/memoryf/story/**").authenticated()
					.requestMatchers(HttpMethod.DELETE, "/story/**", "/memoryf/story/**").authenticated()

				    // Home (조회는 공개)
				    .requestMatchers(HttpMethod.GET, "/guestbook/**").permitAll()
				    .requestMatchers(HttpMethod.POST, "/guestbook").authenticated()

				    // Feed (조회는 공개)
				    .requestMatchers(HttpMethod.GET, "/feeds/**").permitAll()
				    .requestMatchers(HttpMethod.POST, "/feeds/**").authenticated()
				    
				    // Diary (개인 데이터 → 로그인 필요)
				    .requestMatchers(HttpMethod.GET,    "/diaries/**", "/memoryf/diaries/**").authenticated()
				    .requestMatchers(HttpMethod.POST,   "/diaries/**", "/memoryf/diaries/**").authenticated()
				    .requestMatchers(HttpMethod.PUT,    "/diaries/**", "/memoryf/diaries/**").authenticated()
				    .requestMatchers(HttpMethod.DELETE, "/diaries/**", "/memoryf/diaries/**").authenticated()

					// admin
					.requestMatchers("/admin/**", "/memoryf/admin/**").authenticated()

				    
					// server.servlet.context-path=/memoryf 환경을 고려해 두 패턴을 모두 허용
					.requestMatchers(
							"/messages/**", "/memoryf/messages/**",
							"/images/**", "/memoryf/images/**",
							"/resources/**", "/memoryf/resources/**",
							"/css/**", "/memoryf/css/**",
							"/js/**", "/memoryf/js/**",
							"/feed_upfiles/**", "/memoryf/feed_upfiles/**",
							"/profile_images/**", "/memoryf/profile_images/**",
							"/admin/**", "/memoryf/admin/**"
					).permitAll() // 정적 리소스 및 업로드 이미지 모두 허용
					.requestMatchers("/login/**", "/memoryf/login/**", "/signup/**", "/memoryf/signup/**", "/find/**", "/memoryf/find/**").permitAll() // 로그인/회원가입 요청 허용
					.requestMatchers("/ws/**", "/memoryf/ws/**").permitAll() // 🔌 WebSocket 엔드포인트 허용 (SockJS 포함)

					.anyRequest().authenticated() // 나머지는 JWT 인증 필요함
				)
				.formLogin(form -> form.disable()) // 스프링 방식의 로그인 막기
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // JWT 검증 필터 추가
		
		return http.build();
	}
	
	
	

	
	
    
}