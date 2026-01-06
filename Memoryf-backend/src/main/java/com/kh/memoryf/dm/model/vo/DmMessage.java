package com.kh.memoryf.dm.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * DM 메시지 VO
 * 테이블: TB_DM_MESSAGE
 */
@Alias("dmMessage")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmMessage {
    // === DB 컬럼 ===
    private int messageNo;           // MESSAGE_NO (PK)
    private int roomNo;              // ROOM_NO (FK)
    private int senderNo;            // SENDER_NO (FK) - V3에서 SENDER_ID → SENDER_NO로 변경
    private String content;          // CONTENT
    private String messageType;      // MESSAGE_TYPE ('TEXT', 'IMAGE', 'FILE', 'SYSTEM')
    private String filePath;         // FILE_PATH
    private String isDeleted;        // IS_DELETED ('Y', 'N')
    private Date createdAt;          // CREATED_AT
    
    // === 조회용 필드 ===
    private String senderId;         // 보낸 사람 아이디 (JOIN)
    private String senderName;       // 보낸 사람 이름 (JOIN)
    private String senderNick;       // 보낸 사람 닉네임 (JOIN)
    private String createdAtStr;     // 생성일시 문자열 (포맷팅)
    private int readCheck;           // 읽음 여부 (0: 읽음, 1: 안읽음)
    private boolean isMine;          // 내가 보낸 메시지인지
}
