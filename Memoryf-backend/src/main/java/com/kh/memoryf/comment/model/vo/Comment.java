package com.kh.memoryf.comment.model.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 댓글 VO
 * 테이블: TB_COMMENT
 * 
 * V3 스키마: 대댓글 지원 (PARENT_COMMENT_NO, DEPTH)
 */
@Alias("comment")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Comment {
	
	// === DB 컬럼 (V3 스키마) ===
	private int commentNo;           // COMMENT_NO (PK)
	private int feedNo;              // FEED_NO (FK)
	private int memberNo;            // MEMBER_NO (FK) - V3: WRITER → MEMBER_NO
	private String content;          // CONTENT
	private String isDeleted;        // IS_DELETED (V3: IS_DEL → IS_DELETED)
	private Date createdAt;          // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
	private Date updatedAt;          // UPDATED_AT
	
	// === V3: 대댓글 지원 ===
	private Integer parentCommentNo; // PARENT_COMMENT_NO (FK, NULL이면 원댓글)
	private int depth;               // DEPTH (0: 원댓글, 1: 대댓글)
	
	// === 조회용 필드 ===
	private String memberNick;       // 작성자 닉네임 (JOIN)
	private String memberStatus;     // 작성자 상태 (ACTIVE, WITHDRAWN 등)
	private String memberProfileImage; // 작성자 프로필 이미지
	private int likeCount;           // 댓글 좋아요 수
	private boolean isLiked;         // 현재 사용자가 좋아요 했는지
	private String feedImage;        // 피드 썸네일 이미지
	private boolean hasStory;        // 작성자의 유효한 스토리 존재 여부
	private boolean hasUnreadStory;  // 작성자의 읽지 않은 스토리 존재 여부
	
	// === 대댓글 목록 (계층 구조용) ===
	private List<Comment> replies = new ArrayList<>();
	private int replyCount;          // 대댓글 수
	
	// === 부모 댓글 정보 (대댓글 알림용) ===
	private String parentWriterNick; // 부모 댓글 작성자 닉네임
}
