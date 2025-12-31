package com.kh.memoryf.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

// SecurityConfig에서 CORS를 이미 처리하고 있으므로 중복 설정을 방지하기 위해 비활성화합니다.
@Configuration
public class CorsConfig {

    // ✅ CORS 설정 활성화
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 허용할 Origin 설정
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:5174");
        config.addAllowedOrigin("http://192.168.150.10:5173");
        
        // 허용할 HTTP 메서드 설정
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        
        // 허용할 헤더 설정
        config.addAllowedHeader("*");
        
        // 노출할 헤더 설정
        config.addExposedHeader("*");
        
        // 인증 정보 허용
        config.setAllowCredentials(true);
        
        // Preflight 요청 캐시 시간
        config.setMaxAge(3600L);
        
        // 모든 경로에 적용
        source.registerCorsConfiguration("/**", config);
        
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        // 최우선 순위로 설정 (다른 필터보다 먼저 실행)
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        
        return bean;
    }
}
