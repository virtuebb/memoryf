package com.kh.memoryf.follow.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 팔로우 VO
 * 테이블: TB_FOLLOW (V3 스키마)
 * 
 * V3: TB_FOLLOWS → TB_FOLLOW, 컬럼명 변경
 */
@Alias("follow")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Follow {

    // === DB 컬럼 (V3 스키마) ===
    private int followerNo;            // FOLLOWER_NO (팔로우 하는 회원)
    private int followingHomeNo;       // FOLLOWING_HOME_NO (팔로우 대상 홈)
    private String followStatus;       // FOLLOW_STATUS ('ACCEPTED', 'PENDING', 'REJECTED')
    private Date requestedAt;          // REQUESTED_AT
    private Date acceptedAt;           // ACCEPTED_AT
    
    // === 조인용 필드 ===
    private String followerNick;       // 팔로워 닉네임
    private String followingNick;      // 팔로잉 대상 닉네임
    private String profileSavedName;   // 프로필 이미지
}
