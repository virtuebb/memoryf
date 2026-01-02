package com.kh.memoryf.story.model.service;

import java.util.ArrayList;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kh.memoryf.story.model.vo.Story;
import com.kh.memoryf.story.model.vo.StoryDetail;
import com.kh.memoryf.story.model.vo.StoryVisitor;

import jakarta.servlet.http.HttpSession;

public interface StoryService {

	StoryDetail selectStoryDetail(int storyNo);
	
	
	int insertStory(
	    StoryDetail storyDetail,
	    ArrayList<MultipartFile> files,
	    HttpSession session
	);

	
	int deleteStory(int StoryNo);
	
    // ✅ 스토리 목록 (회원 기준)
    ArrayList<Story> selectStoryList(int memberNo);

    // ✅ 특정 회원의 스토리 목록
    ArrayList<Story> selectStoryListByMember(int memberNo);

    // ✅ 스토리 방문 기록
    int insertStoryVisitor(StoryVisitor storyVisitor);	
	
}
