package com.kh.memoryf.dm.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("dmRoom")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmRoom {
    private int roomNo;              // ROOM_NO (채팅방 ID)
    private String roomName;         // ROOM_NAME
    private Date createDate;         // CREATE_DATE
    
    // 🔽 채팅 목록 조회용 필드들 (selectDmRoomList)
    private String targetUserId;     // 상대방 사용자 ID
    private String targetUserName;   // 상대방 사용자 이름
    private String lastMessage;      // 마지막 메시지 (요약)
    private String lastSendDate;       // 마지막 메시지 시간
    private int unreadCount;         // 읽지 않은 메시지 수
    private String avatar;           // 상대방 프로필 이미지 URL
}
