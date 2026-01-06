package com.kh.memoryf.dm.model.dao;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * DM API 요청 DTO
 * 프론트엔드와의 통신용
 */
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmRoomRequest {

    // === 방 생성/조회 ===
    private int memberNo;            // 현재 사용자 회원번호
    private int targetMemberNo;      // 상대방 회원번호
    
    // === 메시지 관련 ===
    private int roomNo;              // 채팅방 번호
    private int senderNo;            // 발신자 회원번호
    private String content;          // 메시지 내용
    private String messageType;      // 메시지 타입 (TEXT, IMAGE, FILE)
    
    // === 하위 호환성 (레거시, 추후 제거 예정) ===
    @Deprecated
    private String targetUserId;     // → targetMemberNo로 대체
    @Deprecated
    private String userId;           // → memberNo로 대체
    @Deprecated
    private String senderId;         // → senderNo로 대체
    @Deprecated
    private int roomId;              // → roomNo로 대체
}
