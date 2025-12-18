package com.kh.memoryf.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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
    		
    		// ✅ 명시적 Origin 지정 (패턴보다 정확함)
    		config.addAllowedOrigin("http://localhost:5173");
    		config.addAllowedOrigin("http://192.168.150.10:5173");
        	
    		config.addAllowedHeader("*");
    		config.addAllowedMethod("*");
    		config.setAllowCredentials(true);
    		config.setMaxAge(3600L);
    		
    		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    		source.registerCorsConfiguration("/**", config);
    		
			package com.kh.memoryf.config;

			import org.springframework.beans.factory.annotation.Autowired;
			import org.springframework.context.annotation.Bean;
			import org.springframework.context.annotation.Configuration;
			import org.springframework.http.HttpMethod;
			import org.springframework.security.config.Customizer;
			import org.springframework.security.config.annotation.web.builders.HttpSecurity;
			import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
			import org.springframework.security.config.http.SessionCreationPolicy;
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

					// ✅ 명시적 Origin 지정 (패턴보다 정확함)
					config.addAllowedOrigin("http://localhost:5173");
					config.addAllowedOrigin("http://192.168.150.10:5173");

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
						.cors(Customizer.withDefaults())   // ⭐ 반드시 필요
						.csrf(csrf -> csrf.disable())
						.sessionManagement(session ->
							session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
						)
						.authorizeHttpRequests(auth -> auth
							.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
							.requestMatchers("/ws/**").permitAll()
							.requestMatchers("/messages/**").permitAll()
							.requestMatchers("/images/**", "/resources/**", "/css/**", "/js/**", "/feed_upfiles/**", "/profile_images/**").permitAll()
							.requestMatchers("/login/**", "/signup/**").permitAll()
							.anyRequest().authenticated()
						)
						.formLogin(form -> form.disable())
						.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

					return http.build();
				}

			}














