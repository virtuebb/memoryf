package com.kh.memoryf.dm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// 이 클래스는 웹소켓 채팅을 설정하는 클래스야.
// 웹소켓은 컴퓨터들이 실시간으로 메시지를 주고받는 방법이야.
// STOMP라는 규칙을 사용해서 메시지를 보내고 받아.
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    public WebSocketConfig(StompHandler stompHandler) {
        this.stompHandler = stompHandler;
    }

    // 이 메서드는 웹소켓 연결을 시작하는 곳을 설정해.
    // "/ws"라는 주소로 연결할 수 있어.
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    // 이 메서드는 메시지를 어떻게 보낼지 설정해.
    // "/pub"로 시작하는 메시지는 서버로 가고, "/sub"나 "/queue"로 서버에서 클라이언트로 가.
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/pub"); // 클라이언트 → 서버
        registry.enableSimpleBroker("/sub", "/queue");      // 서버 → 클라이언트
        registry.setUserDestinationPrefix("/user");         // 1:1 전용
    }

    // 이 메서드는 메시지가 들어올 때 뭔가 처리할 수 있게 해.
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }

    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/messages/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

}
