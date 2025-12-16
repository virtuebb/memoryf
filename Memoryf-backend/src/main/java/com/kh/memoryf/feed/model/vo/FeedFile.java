package com.kh.memoryf.feed.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("feedFile")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class FeedFile {
	
	private int imageNo;          // 이미지 번호
	private String originName;     // 원본 파일명
	private String changeName;     // 변경된 파일명
	private String filePath;       // 파일 경로
	private Date uploadDate;       // 업로드 날짜
	private String isDel;          // 삭제 여부
	private int feedNo;            // 피드 번호
}

