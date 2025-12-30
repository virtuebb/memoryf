package com.kh.memoryf.dm.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("dmParticipant")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmParticipant {
    private int roomNo;             // ROOM_NO	NUMBER
    private String memberId;        // MEMBER_ID	VARCHAR2(50 BYTE)
    private int lastReadMessageNo;  // LAST_READ_MESSAGE_NO	NUMBER
    private String joinDate;          // JOINED_AT	DATE
}

