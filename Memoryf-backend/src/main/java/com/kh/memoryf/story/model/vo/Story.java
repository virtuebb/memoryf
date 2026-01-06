package com.kh.memoryf.story.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 스토리 VO
 * 테이블: TB_STORY
 * 
 * V3 스키마: CREATED_AT, EXPIRED_AT, IS_DELETED
 */
@Alias("story")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Story {

    // === DB 컬럼 (V3 스키마) ===
    private int storyNo;        // STORY_NO
    private int memberNo;       // MEMBER_NO
    private int viewCount;      // VIEW_COUNT
    private String isDeleted;   // IS_DELETED (V3: IS_DEL → IS_DELETED)
    private Date createdAt;     // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
    private Date expiredAt;     // EXPIRED_AT (V3: EXPIRE_DATE → EXPIRED_AT)
    
    // === 조인 결과를 담기 위한 필드 ===
    private String memberNick;  // 닉네임
    private String profileImg;  // 프로필 이미지 경로 (PROFILE_SAVED_NAME)
    private Boolean isRead;     // 읽음 여부
}
