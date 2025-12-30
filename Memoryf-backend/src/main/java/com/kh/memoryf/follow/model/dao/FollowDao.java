package com.kh.memoryf.follow.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FollowDao {

	public int checkFollow(SqlSessionTemplate sqlSession, int memberNo, int homeNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("homeNo", homeNo);
		Integer count = sqlSession.selectOne("followMapper.checkFollow", params);
		return count == null ? 0 : count;
	}

	public int insertFollow(SqlSessionTemplate sqlSession, int memberNo, int homeNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("homeNo", homeNo);
		params.put("status", "Y");
		return sqlSession.insert("followMapper.insertFollow", params);
	}
	
	public String checkFollowStatus(SqlSessionTemplate sqlSession, int memberNo, int homeNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("homeNo", homeNo);
		return sqlSession.selectOne("followMapper.checkFollowStatus", params);
	}

	public int insertFollow(SqlSessionTemplate sqlSession, int memberNo, int homeNo, String status) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("homeNo", homeNo);
		params.put("status", status);
		return sqlSession.insert("followMapper.insertFollow", params);
	}

	public int deleteFollow(SqlSessionTemplate sqlSession, int memberNo, int homeNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("homeNo", homeNo);
		return sqlSession.delete("followMapper.deleteFollow", params);
	}

	public int updateFollowStatus(SqlSessionTemplate sqlSession, int memberNo, int homeNo, String status) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("homeNo", homeNo);
		params.put("status", status);
		return sqlSession.update("followMapper.updateFollowStatus", params);
	}

	public ArrayList<HashMap<String, Object>> selectFollowers(
			SqlSessionTemplate sqlSession,
			int memberNo,
			Integer currentMemberNo,
			String keyword,
			int page,
			int size) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("currentMemberNo", currentMemberNo);
		params.put("keyword", keyword);
		params.put("startRow", page * size + 1);
		params.put("endRow", (page + 1) * size);
		return new ArrayList<>(sqlSession.selectList("followMapper.selectFollowers", params));
	}

	public ArrayList<HashMap<String, Object>> selectFollowing(
			SqlSessionTemplate sqlSession,
			int memberNo,
			Integer currentMemberNo,
			String keyword,
			int page,
			int size) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("currentMemberNo", currentMemberNo);
		params.put("keyword", keyword);
		params.put("startRow", page * size + 1);
		params.put("endRow", (page + 1) * size);
		return new ArrayList<>(sqlSession.selectList("followMapper.selectFollowing", params));
	}

}
