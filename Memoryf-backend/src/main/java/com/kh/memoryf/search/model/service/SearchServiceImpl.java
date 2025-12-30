package com.kh.memoryf.search.model.service;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.member.model.vo.Member;
import com.kh.memoryf.search.model.dao.SearchDao;

@Service
public class SearchServiceImpl implements SearchService {

	@Autowired
	private SearchDao searchDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Override
	public List<Member> searchMembers(String keyword) {
		return searchDao.searchMembers(sqlSession, keyword);
	}

	@Override
	public List<Feed> searchFeedsByTag(String keyword) {
		// 해시태그 처리를 위해 #이 없으면 붙여서 검색하거나, 
		// DB에 저장된 방식에 따라 유연하게 처리.
		// 여기서는 입력된 키워드를 그대로 넘기고 Mapper에서 LIKE 처리
		return searchDao.searchFeedsByTag(sqlSession, keyword);
	}

}
