package com.kh.memoryf.diary.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("diary")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Diary {
	
	private int diaryNo;
    private String title;
    private String content;
    private String originName;
    private String changeName;
    private String filePath;
    private String createDate;
    private String isDel;
    private int memberNo;

}
