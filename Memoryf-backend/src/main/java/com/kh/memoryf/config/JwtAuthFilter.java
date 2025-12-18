package com.kh.memoryf.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    // JWT 비밀키 (application.properties에서 주입)
    @Value("${jwt.secret}")
    private String secretKey;

    // 로그인, 정적리소스는 토큰 검사 제외
    private boolean isSkipPath(String path) {

        // 로그인/회원가입 요청은 인증 없이 허용이므로 필터 검사 제외
        if (path.startsWith("/login")) return true;
        if (path.startsWith("/signup")) return true;

        // 정적 리소스 제외 (필요한 경우만)
        if (path.startsWith("/images")
            || path.startsWith("/resources")
            || path.startsWith("/css")
            || path.startsWith("/js")
            || path.startsWith("/feed_upfiles")) return true; // 업로드된 피드 이미지도 JWT 검사 제외

        return false;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 경로 확인
        String path = request.getRequestURI();

        // OPTIONS(프리플라이트) 요청은 통과
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 로그인/정적 리소스는 토큰 검사 제외
        if (isSkipPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authorization 헤더에서 Bearer 토큰 추출
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 토큰이 없으면 그냥 통과 (SecurityConfig에서 authenticated가 막아줌)
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // "Bearer " 이후 부분

        try {
            // 서명에 사용할 Key 객체 생성
            Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

            // 토큰 파싱 + 서명 검증 + 만료 검증(자동)
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 만료 시간 추가 안전 체크
            Date exp = claims.getExpiration();
            if (exp != null && exp.before(new Date())) {
                filterChain.doFilter(request, response);
                return;
            }

            // subject(로그인 아이디) 꺼내기
            String memberId = claims.getSubject();

            // 이미 인증이 세팅되어 있으면 중복 세팅 방지
            if (StringUtils.hasText(memberId) && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 권한(roles) 아직 없으니 빈 권한으로 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(memberId, null, java.util.Collections.emptyList());

                // 요청 정보 세팅(선택)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 인증 등록 (=> authenticated 통과)
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e) {
            // 토큰 위조/만료/파싱 실패 등 -> 인증 세팅 안 하고 통과
            // (SecurityConfig의 authenticated에서 최종 차단됨)
        }

        filterChain.doFilter(request, response);
    }
}
