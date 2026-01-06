package com.kh.memoryf.home.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 회원 홈 VO
 * 테이블: TB_MEMBER_HOME
 * 
 * V3 스키마: 컬럼명 통일 (STATUS_MESSAGE, PROFILE_SAVED_NAME, IS_PROFILE_PRIVATE 등)
 */
@Alias("home")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Home {
	
	// === DB 컬럼 (V3 스키마) ===
	private int homeNo;                    // HOME_NO
	private String homeTitle;               // HOME_TITLE
	private String statusMessage;          // STATUS_MESSAGE (V3: STATUS_MSG → STATUS_MESSAGE)
	private String profileOriginName;      // PROFILE_ORIGIN_NAME
	private String profileSavedName;        // PROFILE_SAVED_NAME (V3: PROFILE_CHANGE_NAME → PROFILE_SAVED_NAME)
	private String isProfilePrivate;       // IS_PROFILE_PRIVATE (V3: IS_PRIVATE_PROFILE → IS_PROFILE_PRIVATE)
	private String isVisitorPrivate;       // IS_VISITOR_PRIVATE (V3: IS_PRIVATE_VISIT → IS_VISITOR_PRIVATE)
	private String isFollowPrivate;        // IS_FOLLOW_PRIVATE (V3: IS_PRIVATE_FOLLOW → IS_FOLLOW_PRIVATE)
	private int memberNo;                  // MEMBER_NO
	
	// === 조인 및 통계를 위한 필드 ===
	private String memberId;                // 회원 아이디 (DM용)
	private String memberNick;              // 회원 닉네임
	private String memberName;              // 회원 이름
	private String accountStatus;           // 회원 상태 (V3: STATUS → ACCOUNT_STATUS, ACTIVE/INACTIVE/SUSPENDED/WITHDRAWN)
	private int feedCount;                  // 게시물 수
	private int followerCount;              // 팔로워 수
	private int followingCount;             // 팔로잉 수
	private boolean isFollowing;            // 현재 사용자가 팔로우 했는지 여부
	private String followStatus;            // 팔로우 상태 (V3: ACCEPTED/PENDING/REJECTED)
	private boolean hasStory;               // 유효한 스토리 존재 여부
	private boolean hasUnreadStory;         // 읽지 않은 스토리 존재 여부
}
