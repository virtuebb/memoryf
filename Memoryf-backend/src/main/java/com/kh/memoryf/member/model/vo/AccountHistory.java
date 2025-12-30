package com.kh.memoryf.member.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("accountHistory")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class AccountHistory {
	private int historyNo;
	private int memberNo;
	private String eventType;
	private String eventDesc;
	private Date eventDate;
}
