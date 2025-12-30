package com.kh.memoryf.story.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Alias("storyItem")
public class StoryItem {

    private int itemNo;         // ITEM_NO
    private int storyNo;        // STORY_NO (FK)
    private int itemOrder;      // ITEM_ORDER
    private String originName;  // ORIGIN_NAME
    private String changeName;  // CHANGE_NAME
    private String filePath;    // FILE_PATH
    private String storyText;   // STORY_TEXT
    private String isDel;       // IS_DEL
    private Date createDate;    // CREATE_DATE
}
