package com.kh.memoryf.dm.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * DM 참여자 VO
 * 테이블: TB_DM_PARTICIPANT
 */
@Alias("dmParticipant")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmParticipant {
    // === DB 컬럼 ===
    private int roomNo;              // ROOM_NO (PK, FK)
    private int memberNo;            // MEMBER_NO (PK, FK) - V3에서 MEMBER_ID → MEMBER_NO로 변경
    private int lastReadMsgNo;       // LAST_READ_MSG_NO
    private String isMuted;          // IS_MUTED ('Y', 'N')
    private Date joinedAt;           // JOINED_AT
    private Date leftAt;             // LEFT_AT (NULL이면 참여중)
    
    // === 조회용 필드 ===
    private String memberId;         // 회원 아이디 (JOIN)
    private String memberName;       // 회원 이름 (JOIN)
    private String memberNick;       // 회원 닉네임 (JOIN)
}
