package com.kh.memoryf.story.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.memoryf.story.model.service.StoryService;
import com.kh.memoryf.story.model.vo.Story;
import com.kh.memoryf.story.model.vo.StoryDetail;
import com.kh.memoryf.story.model.vo.StoryVisitor;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("story")
public class StoryController {
	
	@Autowired
	private StoryService storyService;
	
	// 조회
	@GetMapping("/{storyNo}")
	public StoryDetail selectStoryDetail(@PathVariable int storyNo) {
		
		return storyService.selectStoryDetail(storyNo);
		
	}
	
	// 추가
	@PostMapping(consumes = "multipart/form-data")
	public int insertStory(
	    @RequestPart("detail") String detailJson,
	    @RequestPart("files") ArrayList<MultipartFile> files,
	    HttpSession session
	) throws Exception {

	    ObjectMapper om = new ObjectMapper();
	    StoryDetail storyDetail = om.readValue(detailJson, StoryDetail.class);

	    return storyService.insertStory(storyDetail, files, session);
	}

	
	// 삭제
	@DeleteMapping("/{storyNo}")
	public int deleteStory(@PathVariable int storyNo) {
		
		return storyService.deleteStory(storyNo);
	}

    // ✅ 스토리 목록 (예: 특정 회원 홈피 스토리바)
    @GetMapping("/list/{memberNo}")
    public ArrayList<Story> selectStoryList(@PathVariable int memberNo) {
        return storyService.selectStoryList(memberNo);
    }

    // ✅ 스토리 방문기록 저장 (중복이면 무시/0 처리 등은 서비스에서)
    @PostMapping("/visit")
    public int insertStoryVisitor(@RequestBody StoryVisitor storyVisitor) {
        return storyService.insertStoryVisitor(storyVisitor);
    }
	

}
