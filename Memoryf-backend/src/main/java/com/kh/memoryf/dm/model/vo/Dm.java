package com.kh.memoryf.dm.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * WebSocket 메시지 VO
 * 채팅 메시지 전송/수신용
 */
@Alias("dm")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Dm {
    // === V3 필드 ===
    private String type;          // 메시지 타입: "message", "read", "delete", "typing"
    private Integer roomNo;       // 채팅방 번호 (DB ROOM_NO)
    private Integer senderNo;     // 발신자 회원번호 (DB MEMBER_NO)
    private Integer recipientNo;  // 수신자 회원번호 (1:1 채팅용)
    private String content;       // 메시지 내용
    private String messageType;   // TEXT, IMAGE, FILE, SYSTEM
    private String createdAt;     // 생성일시 (서버에서 설정)

    // === 레거시 필드 (하위 호환성) ===
    @Deprecated
    private String roomId;        // 기존 받는 사람의 ID
    @Deprecated
    private String recipientId;   // 받는 사람의 사용자 ID
    @Deprecated
    private String sender;        // 보낸 사람의 이름 (레거시)
}
