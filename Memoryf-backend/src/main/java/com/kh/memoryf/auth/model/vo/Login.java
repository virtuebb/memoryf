package com.kh.memoryf.auth.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 로그인 VO
 * 테이블: TB_MEMBER
 * 
 * V3 스키마: ACCOUNT_STATUS
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Alias("login")
public class Login {
	
	private String memberId;
	private String memberPwd;
	
	// === 조회 결과 필드 ===
	private int memberNo;
	private String memberName;
	private String accountStatus;  // V3: STATUS → ACCOUNT_STATUS
}
