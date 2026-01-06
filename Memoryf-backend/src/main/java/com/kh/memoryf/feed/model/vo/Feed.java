package com.kh.memoryf.feed.model.vo;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 피드 VO
 * 테이블: TB_FEED
 * 
 * V3 스키마: CREATED_AT, IS_DELETED
 */
@Alias("feed")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Feed {
	
	// === DB 컬럼 (V3 스키마) ===
	private int feedNo;              // FEED_NO
	private String content;          // CONTENT
	private String tag;              // TAG
	private Double latitude;         // LATITUDE (V3: NUMBER)
	private Double longitude;       // LONGITUDE (V3: NUMBER)
	private String placeName;       // PLACE_NAME
	private String kakaoPlaceId;     // KAKAO_PLACE_ID
	private String addressName;      // ADDRESS_NAME
	private String roadAddress;      // ROAD_ADDRESS
	private String locationName;    // LOCATION_NAME
	private int viewCount;           // VIEW_COUNT
	private String isDeleted;        // IS_DELETED (V3: IS_DEL → IS_DELETED)
	private Date createdAt;          // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
	private Date updatedAt;          // UPDATED_AT
	private Date deletedAt;          // DELETED_AT
	private int memberNo;            // MEMBER_NO
	
	// === 조인을 위한 필드 ===
	private String memberNick;        // 회원 닉네임
	private String memberStatus;      // 회원 상태 (ACCOUNT_STATUS)
	private String profileImage;      // 프로필 이미지
	private int likeCount;            // 좋아요 수
	private int commentCount;         // 댓글 수
	private List<FeedFile> feedFiles; // 피드 파일 리스트
	private boolean isLiked;          // 현재 사용자가 좋아요 했는지 여부
	private boolean isBookmarked;     // 현재 사용자가 북마크 했는지 여부
	private boolean hasStory;         // 작성자의 유효한 스토리 존재 여부
	private boolean hasUnreadStory;   // 작성자의 읽지 않은 스토리 존재 여부
}
