package com.kh.memoryf.dm.config;

import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

// 이 클래스는 웹소켓 연결을 처리하는 클래스야.
// 누가 연결할 때, 그 사람의 이름을 기억해.
@Component
public class StompHandler implements ChannelInterceptor {

    // 메시지가 오기 전에 뭔가 할 수 있어.
    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // 누가 연결하려고 할 때 (CONNECT 명령)
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String login = accessor.getFirstNativeHeader("login");
            System.out.println("🔥 CONNECT login = " + login);

            // 로그인 이름이 있으면, 그 사람으로 설정해.
            if (login != null) {
                accessor.setUser(() -> login);
            }
        }
        return message;
    }
}

