package com.kh.memoryf.common.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("pageInfo")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class PageInfo {
	
	// 페이징처리에 필요한 변수 세팅
	private int listCount;		
	private int currentPage; 	
	private int pageLimit;		
	private int boardLimit;		
	
	private int maxPage;	
	private int startPage;	
	private int endPage;	
}
