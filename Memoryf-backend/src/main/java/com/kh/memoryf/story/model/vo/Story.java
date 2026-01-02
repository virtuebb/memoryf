package com.kh.memoryf.story.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("story")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Story {

    private int storyNo;        // STORY_NO
    private int memberNo;       // MEMBER_NO
    private Date createDate;    // CREATE_DATE
    private Date expireDate;    // EXPIRE_DATE
    private String isDel;       // IS_DEL
    
    // ✅ 추가: JOIN 결과를 담기 위한 필드
    private String memberNick;  // 닉네임
    private String profileImg;  // 프로필 이미지 경로
    
    private Boolean isRead;     // 읽음 여부
}
