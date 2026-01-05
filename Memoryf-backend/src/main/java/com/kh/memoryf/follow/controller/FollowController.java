package com.kh.memoryf.follow.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.follow.model.service.FollowService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/follows")
public class FollowController {

	@Autowired
	private FollowService followService;

	/**
	 * 팔로우 (POST /follow/{targetMemberNo})
	 */
	@PostMapping("/{targetMemberNo}")
	public ApiResponse<HashMap<String, Object>> follow(
			@PathVariable("targetMemberNo") int targetMemberNo,
			@RequestBody HashMap<String, Object> body) {

		Object memberNoObj = body.get("memberNo");
		if (memberNoObj == null) {
			return ApiResponse.error("memberNo가 필요합니다.");
		}

		int memberNo = (Integer) memberNoObj;
		followService.follow(memberNo, targetMemberNo);
		
		String status = followService.checkFollowStatus(memberNo, targetMemberNo);
		boolean isFollowing = "Y".equals(status);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("isFollowing", isFollowing);
		data.put("status", status);
		
		String message = "Y".equals(status) ? "팔로우했습니다." 
				: "P".equals(status) ? "팔로우 요청을 보냈습니다." 
				: "언팔로우했습니다.";
		
		return ApiResponse.success(message, data);
	}

	/**
	 * 언팔로우 (DELETE /follow/{targetMemberNo})
	 */
	@DeleteMapping("/{targetMemberNo}")
	public ApiResponse<HashMap<String, Object>> unfollow(
			@PathVariable("targetMemberNo") int targetMemberNo,
			@RequestBody HashMap<String, Object> body) {

		Object memberNoObj = body.get("memberNo");
		if (memberNoObj == null) {
			return ApiResponse.error("memberNo가 필요합니다.");
		}

		int memberNo = (Integer) memberNoObj;
		followService.unfollow(memberNo, targetMemberNo);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("isFollowing", false);
		data.put("status", null);
		
		return ApiResponse.success("언팔로우했습니다.", data);
	}

	/**
	 * 팔로워 목록 (GET /follow/followers/{memberNo})
	 */
	@GetMapping("/followers/{memberNo}")
	public ApiResponse<HashMap<String, Object>> followers(
			@PathVariable("memberNo") int memberNo,
			@RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size) {
		
		if (page < 0) page = 0;
		if (size < 1) size = 1;
		if (size > 50) size = 50;

		var list = followService.getFollowers(memberNo, currentMemberNo, keyword, page, size);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("list", list);
		data.put("hasMore", list != null && list.size() == size);
		data.put("page", page);
		
		return ApiResponse.success(data);
	}

	/**
	 * 팔로잉 목록 (GET /follow/following/{memberNo})
	 */
	@GetMapping("/following/{memberNo}")
	public ApiResponse<HashMap<String, Object>> following(
			@PathVariable("memberNo") int memberNo,
			@RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size) {
		
		if (page < 0) page = 0;
		if (size < 1) size = 1;
		if (size > 50) size = 50;

		var list = followService.getFollowing(memberNo, currentMemberNo, keyword, page, size);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("list", list);
		data.put("hasMore", list != null && list.size() == size);
		data.put("page", page);
		
		return ApiResponse.success(data);
	}

	/**
	 * 팔로우 요청 수락 (POST /follow/accept/{requesterNo})
	 */
	@PostMapping("/accept/{requesterNo}")
	public ApiResponse<Void> acceptFollow(
			@PathVariable("requesterNo") int requesterNo,
			@RequestBody HashMap<String, Object> body) {

		int memberNo = (Integer) body.get("memberNo");
		boolean result = followService.acceptFollowRequest(memberNo, requesterNo);
		
		if (result) {
			return ApiResponse.success("팔로우 요청을 수락했습니다.", null);
		} else {
			return ApiResponse.error("팔로우 요청 수락 실패");
		}
	}

	/**
	 * 팔로우 요청 거절 (POST /follow/reject/{requesterNo})
	 */
	@PostMapping("/reject/{requesterNo}")
	public ApiResponse<Void> rejectFollow(
			@PathVariable("requesterNo") int requesterNo,
			@RequestBody HashMap<String, Object> body) {

		int memberNo = (Integer) body.get("memberNo");
		boolean result = followService.rejectFollowRequest(memberNo, requesterNo);
		
		if (result) {
			return ApiResponse.success("팔로우 요청을 거절했습니다.", null);
		} else {
			return ApiResponse.error("팔로우 요청 거절 실패");
		}
	}
}
