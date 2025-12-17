package com.kh.memoryf.dm.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("dmMessage")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmMessage {
    // DB 컬럼
    private int messageNo;      // MESSAGE_NO NUMBER (PK)
    private int roomNo;         // ROOM_NO NUMBER (FK)
    private int senderNo;       // SENDER_NO NUMBER
    private String content;     // CONTENT VARCHAR2(4000 BYTE)
    private Date createDate;    // CREATE_DATE DATE
    private String isDel;       // IS_DEL CHAR(1 BYTE)
    
    // 조회용 추가 필드
    private String senderId;    // 보낸 사람 ID (JOIN)
    private String senderName;  // 보낸 사람 이름 (JOIN)
    private boolean isMine;     // 내가 보낸 메시지인지 (프론트 표시용)
}
