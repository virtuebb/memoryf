package com.kh.memoryf.search.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.member.model.vo.Member;
import com.kh.memoryf.search.model.service.SearchService;

@RestController
@RequestMapping("search")
public class SearchController {

	@Autowired
	private SearchService searchService;
	
	/**
	 * 닉네임으로 회원 검색
	 * @param keyword 검색어
	 * @return 회원 목록
	 */
	@GetMapping("/member")
	public Map<String, Object> searchMembers(@RequestParam("keyword") String keyword) {
		Map<String, Object> response = new HashMap<>();
		try {
			List<Member> members = searchService.searchMembers(keyword);
			response.put("success", true);
			response.put("data", members);
		} catch (Exception e) {
			e.printStackTrace();
			response.put("success", false);
			response.put("message", "회원 검색 실패");
		}
		return response;
	}
	
	/**
	 * 태그로 피드 검색
	 * @param keyword 검색어 (해시태그 제외한 순수 키워드 권장, 혹은 포함해도 처리)
	 * @return 피드 목록
	 */
	@GetMapping("/tag")
	public Map<String, Object> searchFeedsByTag(@RequestParam("keyword") String keyword) {
		Map<String, Object> response = new HashMap<>();
		try {
			List<Feed> feeds = searchService.searchFeedsByTag(keyword);
			response.put("success", true);
			response.put("data", feeds);
		} catch (Exception e) {
			e.printStackTrace();
			response.put("success", false);
			response.put("message", "태그 검색 실패");
		}
		return response;
	}
}
