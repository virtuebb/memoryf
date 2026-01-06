package com.kh.memoryf.member.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 회원 VO
 * 테이블: TB_MEMBER
 * 
 * V3 스키마: CREATED_AT, ACCOUNT_STATUS (포인트는 TB_POINT_WALLET로 분리)
 */
@Alias("member")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Member {
	
	// === DB 컬럼 (V3 스키마) ===
	private int memberNo;              // MEMBER_NO
	private String memberId;           // MEMBER_ID
	private String memberPwd;          // MEMBER_PWD
	private String memberName;         // MEMBER_NAME
	private String memberNick;         // MEMBER_NICK
	private String email;              // EMAIL
	private String phone;              // PHONE
	private String gender;             // GENDER ('M', 'F', 'N')
	private Date birthday;             // BIRTHDAY
	private String accountStatus;      // ACCOUNT_STATUS (V3: STATUS → ACCOUNT_STATUS, ACTIVE/INACTIVE/SUSPENDED/WITHDRAWN)
	private Date createdAt;           // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
	private Date updatedAt;           // UPDATED_AT
	private Date lastLoginAt;          // LAST_LOGIN_AT
	
	// === 조인용 필드 ===
	private String profileImage;       // 프로필 이미지 (TB_MEMBER_HOME.PROFILE_SAVED_NAME)
}
