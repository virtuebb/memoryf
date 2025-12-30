package com.kh.memoryf.story.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Alias("storyVisitor")
public class StoryVisitor {

	private int memberNo;
	private int storyNo;
}
