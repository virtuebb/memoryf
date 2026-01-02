package com.kh.memoryf.story.model.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.story.model.vo.Story;
import com.kh.memoryf.story.model.vo.StoryDetail;
import com.kh.memoryf.story.model.vo.StoryItem;
import com.kh.memoryf.story.model.vo.StoryVisitor;

@Repository
public class StoryDao {

	public StoryDetail selectStoryDetail(SqlSessionTemplate sqlSession, int storyNo) {

		return sqlSession.selectOne("storyMapper.selectStoryDetail", storyNo);
	}
	
	public int selectStoryNo(SqlSessionTemplate sqlSession) {
		
		return sqlSession.selectOne("storyMapper.selectStoryNo");
	}

	public int insertStory(SqlSessionTemplate sqlSession, Story story) {

		return sqlSession.insert("storyMapper.insertStory", story); 
		
	}
	
	public int insertStoryItems(SqlSessionTemplate sqlSession, ArrayList<StoryItem> items) {
		
		return sqlSession.insert("storyMapper.insertStoryItems", items);
	}

	public int deleteStoryItems(SqlSessionTemplate sqlSession, int storyNo) {

		return sqlSession.update("storyMapper.deleteStoryItems", storyNo);
		
	}

	public int deleteStory(SqlSessionTemplate sqlSession, int storyNo) {
		
		return sqlSession.update("storyMapper.deleteStory", storyNo);
	}

	public ArrayList<Story> selectStoryList(SqlSessionTemplate sqlSession, int memberNo) {
		
		return (ArrayList)sqlSession.selectList("storyMapper.selectStoryList", memberNo);
	}

	public ArrayList<Story> selectStoryListByMember(SqlSessionTemplate sqlSession, int memberNo) {
		return (ArrayList)sqlSession.selectList("storyMapper.selectStoryListByMember", memberNo);
	}

	public int insertStoryVisitor(SqlSessionTemplate sqlSession, StoryVisitor storyVisitor) {
		
		return sqlSession.insert("storyMapper.insertStoryVisitor", storyVisitor);
	}

	// 중복체크용
	public int selectStoryVisitorCount(SqlSessionTemplate sqlSession, StoryVisitor storyVisitor) {

	    return sqlSession.selectOne("storyMapper.selectStoryVisitorCount", storyVisitor);
	}

	
	

	
}
