package com.kh.memoryf.dm.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("dmRoomMember")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmRoomMember {
    // DB 컬럼
    private int roomMemberNo;   // ROOM_MEMBER_NO NUMBER (PK)
    private int roomNo;         // ROOM_NO NUMBER (FK)
    private int memberNo;       // MEMBER_NO NUMBER (FK)
    private Date joinedDate;    // JOINED_DATE DATE
    private int lastReadNo;     // LAST_READ_NO NUMBER (마지막 읽은 메시지 번호)
    private String isActive;    // IS_ACTIVE CHAR(1 BYTE)
    
    // 조회용 추가 필드
    private String memberId;    // 회원 ID (JOIN)
    private String memberName;  // 회원 이름 (JOIN)
}

