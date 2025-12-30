package com.kh.memoryf.story.model.vo;

import java.util.ArrayList;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("storyDetail")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class StoryDetail {

    private Story story;
    private ArrayList<StoryItem> items; 
}
