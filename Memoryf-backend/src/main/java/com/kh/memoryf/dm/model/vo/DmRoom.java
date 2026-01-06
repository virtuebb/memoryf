package com.kh.memoryf.dm.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * DM 대화방 VO
 * 테이블: TB_DM_ROOM
 */
@Alias("dmRoom")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmRoom {
    // === DB 컬럼 ===
    private int roomNo;              // ROOM_NO (PK)
    private String roomType;         // ROOM_TYPE ('P': 1:1, 'G': 그룹)
    private String roomName;         // ROOM_NAME
    private Date createdAt;          // CREATED_AT
    
    // === 채팅 목록 조회용 필드 (selectDmRoomList) ===
    private int targetMemberNo;      // 상대방 회원번호
    private String targetMemberId;   // 상대방 아이디 (표시용)
    private String targetMemberName; // 상대방 이름
    private String targetMemberNick; // 상대방 닉네임
    private String lastMessage;      // 마지막 메시지 (요약)
    private String lastMessageAt;    // 마지막 메시지 시간
    private int unreadCount;         // 읽지 않은 메시지 수
    private String profileImage;     // 상대방 프로필 이미지
    
    // === 하위 호환성을 위한 별칭 (Deprecated, 추후 제거 예정) ===
    @Deprecated
    public String getTargetUserId() {
        return targetMemberId;
    }
    @Deprecated
    public void setTargetUserId(String targetUserId) {
        this.targetMemberId = targetUserId;
    }
    @Deprecated
    public String getTargetUserName() {
        return targetMemberName;
    }
    @Deprecated
    public void setTargetUserName(String targetUserName) {
        this.targetMemberName = targetUserName;
    }
    @Deprecated
    public String getLastSendDate() {
        return lastMessageAt;
    }
    @Deprecated
    public void setLastSendDate(String lastSendDate) {
        this.lastMessageAt = lastSendDate;
    }
    @Deprecated
    public String getAvatar() {
        return profileImage;
    }
    @Deprecated
    public void setAvatar(String avatar) {
        this.profileImage = avatar;
    }
}
