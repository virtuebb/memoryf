package com.kh.memoryf.payment.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("bgm")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Bgm {
	private int bgmNo;
	private String bgmTitle;
	private String filePath;
	private String artist;
	private int price;
	private Date regDate;
	
	// 조인용 필드 (구매 여부)
	private boolean purchased;
}
