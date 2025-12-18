package com.kh.memoryf.dm.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.dm.model.vo.Dm;
import com.kh.memoryf.dm.model.vo.DmRoom;

// 이 클래스는 채팅 메시지를 처리하는 컨트롤러야.
// 메시지가 오면, 어디로 보낼지 결정해.
@RequestMapping("m") 
@RestController
public class DmController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    /*
    어노테이션을 사용하거나 직접 생성자 주입을 하거나
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    */

    // ===============================
    // 1️⃣ 단체 채팅 (채팅방)
    // ===============================
    // 이 메서드는 방에 있는 모든 사람에게 메시지를 보내.
    @MessageMapping("/chat/room/{roomId}")
    @SendTo("/sub/chat/room/{roomId}")
    public Dm roomChat(
            @DestinationVariable String roomId,
            Dm message) {

        return message;
    }

    // ===============================
    // 2️⃣ 1:1 채팅
    // ===============================
    // 이 메서드는 특정 사람에게만 메시지를 보내.
    @MessageMapping("/chat/private")
    public void privateChat(Dm message) {

        // 🔥 사용자 전용 채널로 직접 전송
        System.out.println("📨 메시지 수신: " + message.getContent() + " to " + message.getRoomId());
        messagingTemplate.convertAndSend(
                "/sub/private/" + message.getRoomId(), // 받는 사람 ID
                message
        );
    }

    // dm 방 목록 조회
    @GetMapping("/dm/rooms")
        public ArrayList<DmRoom> selectMyDmRooms() {
		return new ArrayList<>();
	}

    // dm 방 상세 조회

    // 읽음 처리

    // 새 메세지 저장

    // 새로운 채팅 추가



}
