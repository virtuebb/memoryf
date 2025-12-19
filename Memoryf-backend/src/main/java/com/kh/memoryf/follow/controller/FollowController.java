package com.kh.memoryf.follow.controller;

import java.util.HashMap;

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

import com.kh.memoryf.follow.model.service.FollowService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("follow")
public class FollowController {

	@Autowired
	private FollowService followService;

	/**
	 * 팔로우 (POST /follow/{targetMemberNo})
	 * 요청 본문: { memberNo: number }
	 */
	@PostMapping("/{targetMemberNo}")
	public HashMap<String, Object> follow(
			@PathVariable("targetMemberNo") int targetMemberNo,
			@RequestBody HashMap<String, Object> body) {

		HashMap<String, Object> response = new HashMap<>();
		try {
			Object memberNoObj = body.get("memberNo");
			if (memberNoObj == null) {
				response.put("success", false);
				response.put("message", "memberNo가 필요합니다.");
				return response;
			}

			int memberNo = (Integer) memberNoObj;
			boolean isFollowing = followService.follow(memberNo, targetMemberNo);
			response.put("success", true);
			response.put("isFollowing", isFollowing);
			response.put("message", "팔로우했습니다.");
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "팔로우 실패: " + e.getMessage());
		}
		return response;
	}

	/**
	 * 언팔로우 (DELETE /follow/{targetMemberNo})
	 * 요청 본문: { memberNo: number }
	 */
	@DeleteMapping("/{targetMemberNo}")
	public HashMap<String, Object> unfollow(
			@PathVariable("targetMemberNo") int targetMemberNo,
			@RequestBody HashMap<String, Object> body) {

		HashMap<String, Object> response = new HashMap<>();
		try {
			Object memberNoObj = body.get("memberNo");
			if (memberNoObj == null) {
				response.put("success", false);
				response.put("message", "memberNo가 필요합니다.");
				return response;
			}

			int memberNo = (Integer) memberNoObj;
			boolean isFollowing = followService.unfollow(memberNo, targetMemberNo);
			response.put("success", true);
			response.put("isFollowing", isFollowing);
			response.put("message", "언팔로우했습니다.");
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "언팔로우 실패: " + e.getMessage());
		}
		return response;
	}

	/**
	 * 팔로워 목록 (GET /follow/followers/{memberNo})
	 * - memberNo: 프로필 주인
	 * - currentMemberNo(옵션): 각 항목에 isFollowing 계산용(현재 로그인 사용자)
	 */
	@GetMapping("/followers/{memberNo}")
	public HashMap<String, Object> followers(
			@PathVariable("memberNo") int memberNo,
			@RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size) {
		HashMap<String, Object> response = new HashMap<>();
		try {
			if (page < 0) page = 0;
			if (size < 1) size = 1;
			if (size > 50) size = 50;

			var list = followService.getFollowers(memberNo, currentMemberNo, keyword, page, size);
			response.put("success", true);
			response.put("data", list);
			response.put("hasMore", list != null && list.size() == size);
			response.put("page", page);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "팔로워 목록 조회 실패: " + e.getMessage());
		}
		return response;
	}

	/**
	 * 팔로잉 목록 (GET /follow/following/{memberNo})
	 * - memberNo: 프로필 주인
	 * - currentMemberNo(옵션): 각 항목에 isFollowing 계산용(현재 로그인 사용자)
	 */
	@GetMapping("/following/{memberNo}")
	public HashMap<String, Object> following(
			@PathVariable("memberNo") int memberNo,
			@RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size) {
		HashMap<String, Object> response = new HashMap<>();
		try {
			if (page < 0) page = 0;
			if (size < 1) size = 1;
			if (size > 50) size = 50;

			var list = followService.getFollowing(memberNo, currentMemberNo, keyword, page, size);
			response.put("success", true);
			response.put("data", list);
			response.put("hasMore", list != null && list.size() == size);
			response.put("page", page);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "팔로잉 목록 조회 실패: " + e.getMessage());
		}
		return response;
	}

}
