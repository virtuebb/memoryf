package com.kh.memoryf.feed.model.vo;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("feed")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Feed {
	
	private int feedNo;              // 피드 번호
	private String content;          // 피드 내용
	private String tag;              // 태그
	private String latitude;          // 위도
	private String longitude;         // 경도
	private String locationName;		 // 위치명 
	private Date createdDate;         // 생성일 (시간 포함)
	private String isDel;             // 삭제 여부
	private int memberNo;             // 회원 번호
	
	// 조인을 위한 필드
	private String memberNick;        // 회원 닉네임
	private String profileImage;      // 프로필 이미지
	private int likeCount;            // 좋아요 수
	private int commentCount;         // 댓글 수
	private List<FeedFile> feedFiles; // 피드 파일 리스트
	private boolean isLiked;          // 현재 사용자가 좋아요 했는지 여부
	private boolean isBookmarked;     // 현재 사용자가 북마크 했는지 여부
}
