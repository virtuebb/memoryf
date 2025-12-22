package com.kh.memoryf.home.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("home")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Home {
	
	private int homeNo;
	private String homeTitle;
	private String statusMsg;
	private String profileOriginName;
	private String profileChangeName;
	private String isPrivateProfile;
	private String isPrivateVisit;
	private String isPrivateFollow;
	private int memberNo;	// 회원 번호 - MEMBER 테이블의 memberNo를 외래키로 받음
	
	// 조인 및 통계를 위한 필드
	private String memberNick;          // 회원 닉네임
	private String memberName;          // 회원 이름
	private int feedCount;              // 게시물 수
	private int followerCount;          // 팔로워 수
	private int followingCount;         // 팔로잉 수
	private boolean isFollowing;        // 현재 사용자가 팔로우 했는지 여부
	private String followStatus;        // 팔로우 상태 (Y: 팔로우 중, P: 요청 중, N: 팔로우 안함)
}
