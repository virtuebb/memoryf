package com.kh.memoryf.auth.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Alias("login")
public class Login {
	
	private String memberId;
	private String memberPwd;
	
	private int memberNo;
	private String memberName;
	private String status;

}
