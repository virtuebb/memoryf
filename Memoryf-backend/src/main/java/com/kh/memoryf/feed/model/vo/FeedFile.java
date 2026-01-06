package com.kh.memoryf.feed.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 피드 첨부파일 VO
 * 테이블: TB_FEED_FILE
 * 
 * V3 스키마: FILE_NO, SAVED_NAME, FILE_TYPE, CREATED_AT, IS_DELETED
 */
@Alias("feedFile")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class FeedFile {
	
	// === DB 컬럼 (V3 스키마) ===
	private int fileNo;              // FILE_NO (V3: IMAGE_NO → FILE_NO)
	private int feedNo;              // FEED_NO
	private int fileOrder;           // FILE_ORDER
	private String originName;       // ORIGIN_NAME
	private String savedName;        // SAVED_NAME (V3: CHANGE_NAME → SAVED_NAME)
	private String filePath;         // FILE_PATH
	private String fileType;         // FILE_TYPE ('IMAGE', 'VIDEO')
	private Long fileSize;           // FILE_SIZE
	private String isDeleted;        // IS_DELETED (V3: IS_DEL → IS_DELETED)
	private Date createdAt;          // CREATED_AT (V3: UPLOAD_DATE → CREATED_AT)
}
