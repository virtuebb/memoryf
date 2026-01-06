package com.kh.memoryf.story.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 스토리 아이템 VO
 * 테이블: TB_STORY_ITEM
 * 
 * V3 스키마: SAVED_NAME, FILE_TYPE, CREATED_AT, IS_DELETED
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Alias("storyItem")
public class StoryItem {

    // === DB 컬럼 (V3 스키마) ===
    private int itemNo;         // ITEM_NO
    private int storyNo;        // STORY_NO (FK)
    private int itemOrder;      // ITEM_ORDER
    private String originName;  // ORIGIN_NAME
    private String savedName;   // SAVED_NAME (V3: CHANGE_NAME → SAVED_NAME)
    private String filePath;    // FILE_PATH
    private String fileType;    // FILE_TYPE ('IMAGE', 'VIDEO')
    private String storyText;   // STORY_TEXT
    private int durationSec;   // DURATION_SEC
    private String isDeleted;   // IS_DELETED (V3: IS_DEL → IS_DELETED)
    private Date createdAt;     // CREATED_AT (V3: CREATE_DATE → CREATED_AT)
}
