package com.kh.memoryf.story.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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
import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.story.model.service.StoryService;
import com.kh.memoryf.story.model.vo.Story;
import com.kh.memoryf.story.model.vo.StoryDetail;
import com.kh.memoryf.story.model.vo.StoryVisitor;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/stories")
public class StoryController {
	
	@Autowired
	private StoryService storyService;
	
	/**
	 * 스토리 상세 조회
	 */
	@GetMapping("/{storyNo}")
	public ApiResponse<StoryDetail> selectStoryDetail(@PathVariable int storyNo) {
		StoryDetail detail = storyService.selectStoryDetail(storyNo);
		if (detail != null) {
			return ApiResponse.success(detail);
		} else {
			return ApiResponse.error("스토리를 찾을 수 없습니다.");
		}
	}
	
	/**
	 * 스토리 추가
	 */
	@PostMapping(consumes = "multipart/form-data")
	public ApiResponse<HashMap<String, Object>> insertStory(
	    @RequestPart("detail") String detailJson,
	    @RequestPart("files") ArrayList<MultipartFile> files,
	    HttpSession session
	) throws Exception {

	    ObjectMapper om = new ObjectMapper();
	    StoryDetail storyDetail = om.readValue(detailJson, StoryDetail.class);

	    int result = storyService.insertStory(storyDetail, files, session);
	    if (result > 0) {
	    	HashMap<String, Object> data = new HashMap<>();
	    	data.put("storyNo", result);
	    	return ApiResponse.success("스토리가 등록되었습니다.", data);
	    } else {
	    	return ApiResponse.error("스토리 등록에 실패했습니다.");
	    }
	}

	/**
	 * 스토리 삭제
	 */
	@DeleteMapping("/{storyNo}")
	public ApiResponse<Void> deleteStory(@PathVariable int storyNo) {
		int result = storyService.deleteStory(storyNo);
		if (result > 0) {
			return ApiResponse.success("스토리가 삭제되었습니다.", null);
		} else {
			return ApiResponse.error("스토리 삭제에 실패했습니다.");
		}
	}

	/**
	 * 스토리 목록 조회 (특정 회원 홈피 스토리바)
	 * GET /stories/members/{memberNo}
	 */
    @GetMapping("/members/{memberNo}")
    public ApiResponse<List<Story>> selectStoryList(@PathVariable int memberNo) {
        ArrayList<Story> list = storyService.selectStoryList(memberNo);
        return ApiResponse.success(list);
    }

	/**
	 * 특정 회원의 스토리 목록 (프로필/피드 클릭 시)
	 * GET /stories/members/{memberNo}/all
	 */
    @GetMapping("/members/{memberNo}/all")
    public ApiResponse<List<Story>> selectStoryListByMember(@PathVariable int memberNo) {
        ArrayList<Story> list = storyService.selectStoryListByMember(memberNo);
        return ApiResponse.success(list);
    }

	/**
	 * 스토리 방문기록 저장
	 * POST /stories/{storyNo}/visits
	 */
    @PostMapping("/{storyNo}/visits")
    public ApiResponse<Void> insertStoryVisitor(@PathVariable int storyNo, @RequestBody StoryVisitor storyVisitor) {
        storyVisitor.setStoryNo(storyNo);
        int result = storyService.insertStoryVisitor(storyVisitor);
        if (result > 0) {
        	return ApiResponse.success("방문 기록이 저장되었습니다.", null);
        } else {
        	return ApiResponse.success(null); // 중복 방문은 무시
        }
    }
}
