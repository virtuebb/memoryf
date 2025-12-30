package com.kh.memoryf.search.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.member.model.vo.Member;

@Repository
public class SearchDao {

	public List<Member> searchMembers(SqlSessionTemplate sqlSession, String keyword) {
		return sqlSession.selectList("searchMapper.searchMembers", keyword);
	}

	public List<Feed> searchFeedsByTag(SqlSessionTemplate sqlSession, String keyword) {
		return sqlSession.selectList("searchMapper.searchFeedsByTag", keyword);
	}

}
