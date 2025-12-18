package com.kh.memoryf.guestbook.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("guestbook")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Guestbook {
	
	private int guestbookNo;           // 방명록 번호
	private String guestbookContent;   // 방명록 내용
	private Date createDate;           // 작성일
	private String isDel;              // 삭제 여부
	private int memberNo;              // 작성자 회원 번호
	private int homeNo;                // 홈피 번호
	
	// 조인을 위한 필드
	private String memberNick;         // 작성자 닉네임
	private String profileChangeName;  // 작성자 프로필 이미지
	private int likeCount;             // 좋아요 수
	private boolean isLiked;           // 현재 사용자가 좋아요 했는지 여부
}
