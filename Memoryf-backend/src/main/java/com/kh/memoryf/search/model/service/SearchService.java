package com.kh.memoryf.search.model.service;

import java.util.List;

import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.member.model.vo.Member;

public interface SearchService {

	// 회원 검색 (닉네임)
	List<Member> searchMembers(String keyword);

	// 태그 검색 (피드)
	List<Feed> searchFeedsByTag(String keyword);

}
