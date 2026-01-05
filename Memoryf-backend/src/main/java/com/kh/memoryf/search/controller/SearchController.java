package com.kh.memoryf.search.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.member.model.vo.Member;
import com.kh.memoryf.search.model.service.SearchService;

@RestController
@RequestMapping("/search")
public class SearchController {

	@Autowired
	private SearchService searchService;
	
	/**
	 * 닉네임으로 회원 검색
	 * GET /search/members?keyword=xxx
	 */
	@GetMapping("/members")
	public ApiResponse<List<Member>> searchMembers(@RequestParam("keyword") String keyword) {
		List<Member> members = searchService.searchMembers(keyword);
		return ApiResponse.success(members);
	}
	
	/**
	 * 태그로 피드 검색
	 * GET /search/feeds?tag=xxx
	 */
	@GetMapping("/feeds")
	public ApiResponse<List<Feed>> searchFeedsByTag(@RequestParam("tag") String keyword) {
		List<Feed> feeds = searchService.searchFeedsByTag(keyword);
		return ApiResponse.success(feeds);
	}
}
