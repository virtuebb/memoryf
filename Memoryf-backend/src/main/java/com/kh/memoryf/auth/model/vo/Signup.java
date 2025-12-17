package com.kh.memoryf.auth.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("signup")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Signup {
	
	private String memberId;
	private String memberPwd;
	private String memberName;
	private String memberNick;
	private String email;
	private String phone;
	private String gender;
	private Date birthday;

}
