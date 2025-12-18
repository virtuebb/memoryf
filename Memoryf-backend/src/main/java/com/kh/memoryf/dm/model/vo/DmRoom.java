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
    private int roomNo;         // ROOM_NO	NUMBER
    private String roomType;    // ROOM_TYPE	VARCHAR2(10 BYTE)
    private String roomName;    // ROOM_NAME	VARCHAR2(100 BYTE)
    private Date createDate;    // CREATE_DATE	DATE
    private Date lastSendDate;  // LAST_SEND_DATE	DATE
    private String isDel;       // IS_DEL	CHAR(1 BYTE)
    private int memberNo;      // 현재 사용자 번호 (나)
    private String memberId;   // 현재 사용자 ID (나)
    private String memberName; // 현재 사용자 이름 (나)

    private String targetUserId;
    private String targetUserName;
    private String lastMessage;
    private int unreadCount;
}
