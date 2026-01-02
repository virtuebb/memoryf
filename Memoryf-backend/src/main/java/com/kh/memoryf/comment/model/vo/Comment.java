package com.kh.memoryf.comment.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("comment")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Comment {
	
	private int commentNo;        // 댓글 번호
	private String content;       // 댓글 내용
	private java.util.Date createDate;     // 작성일
	private String isDel;         // 삭제 여부
	private int writer;           // 작성자 번호
	private int feedNo;           // 피드 번호
	
	// 조인을 위한 필드
	private String writerNick;    // 작성자 닉네임
	private String writerStatus;  // 작성자 상태 (Y: 탈퇴)
	private String writerProfileImage; // 작성자 프로필 이미지
	private int likeCount;        // 댓글 좋아요 수
	private boolean isLiked;      // 현재 사용자가 좋아요 했는지 여부
	
	private String feedImage;     // 피드 썸네일 이미지 (내 활동 - 댓글 목록용)
	private boolean hasStory;     // 작성자의 유효한 스토리 존재 여부
	private boolean hasUnreadStory; // 작성자의 읽지 않은 스토리 존재 여부
}
