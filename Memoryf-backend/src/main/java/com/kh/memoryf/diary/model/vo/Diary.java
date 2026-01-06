package com.kh.memoryf.diary.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 다이어리 VO
 * 테이블: TB_DIARY
 * 
 * V3 스키마: CREATED_AT, IS_DELETED, SAVED_NAME
 */
@Alias("diary")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Diary {
	
	// === DB 컬럼 (V3 스키마) ===
	private int diaryNo;              // DIARY_NO
	private int memberNo;             // MEMBER_NO
	private String title;             // TITLE
	private String content;           // CONTENT
	private Date diaryDate;           // DIARY_DATE
	private String mood;              // MOOD
	private String weather;           // WEATHER
	private String originName;        // ORIGIN_NAME
	private String savedName;         // SAVED_NAME (V3: CHANGE_NAME → SAVED_NAME)
	private String filePath;          // FILE_PATH
	private String isDeleted;         // IS_DELETED (V3: IS_DEL → IS_DELETED)
	private Date createdAt;           // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
	private Date updatedAt;           // UPDATED_AT
}
