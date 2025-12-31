package com.kh.memoryf.member.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("member")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Member {
	
	private int memberNo;
	private String memberId;
	private String memberPwd;
	private String memberName;
	private String memberNick;
	private String email;
	private String phone;
	private String gender;
	private Date birthday;
	private Date createDate;
	private String status;
	private int point; // 포인트 (BGM 구매용)
	
	// 조인용 필드
	private String profileImage;
}
