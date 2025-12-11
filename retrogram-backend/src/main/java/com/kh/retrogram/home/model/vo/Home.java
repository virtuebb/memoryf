package com.kh.retrogram.home.model.vo;

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
}
