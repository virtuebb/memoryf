package com.kh.memoryf.guestbook.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 방명록 VO
 * 테이블: TB_GUESTBOOK
 * 
 * V3 스키마: CONTENT, CREATED_AT, IS_DELETED, IS_SECRET
 */
@Alias("guestbook")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Guestbook {
	
	// === DB 컬럼 (V3 스키마) ===
	private int guestbookNo;           // GUESTBOOK_NO
	private int homeNo;                // HOME_NO
	private int memberNo;              // MEMBER_NO
	private String content;            // CONTENT (V3: GUESTBOOK_CONTENT → CONTENT)
	private String isSecret;           // IS_SECRET ('Y', 'N')
	private String isDeleted;          // IS_DELETED (V3: IS_DEL → IS_DELETED)
	private Date createdAt;            // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
	
	// === 조인을 위한 필드 ===
	private String memberNick;         // 작성자 닉네임
	private String profileSavedName;  // 작성자 프로필 이미지 (V3: PROFILE_CHANGE_NAME → PROFILE_SAVED_NAME)
	private String accountStatus;      // 회원 상태 (V3: STATUS → ACCOUNT_STATUS)
	private int likeCount;             // 좋아요 수
	private boolean isLiked;           // 현재 사용자가 좋아요 했는지 여부
	private boolean hasStory;          // 스토리 유무
	private boolean hasUnreadStory;    // 읽지 않은 스토리 존재 여부
}
