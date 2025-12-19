package com.kh.memoryf.follow.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.follow.model.dao.FollowDao;
import com.kh.memoryf.home.model.dao.HomeDao;
import com.kh.memoryf.home.model.vo.Home;

@Service
public class FollowServiceImpl implements FollowService {

	@Autowired
	private SqlSessionTemplate sqlSession;

	@Autowired
	private FollowDao followDao;

	@Autowired
	private HomeDao homeDao;

	@Override
	public boolean follow(int memberNo, int targetMemberNo) {
		if (memberNo <= 0 || targetMemberNo <= 0) {
			throw new IllegalArgumentException("memberNo/targetMemberNo가 올바르지 않습니다.");
		}
		if (memberNo == targetMemberNo) {
			throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
		}

		Home targetHome = homeDao.selectHomeByMemberNo(sqlSession, targetMemberNo, null);
		if (targetHome == null) {
			throw new IllegalArgumentException("대상 홈을 찾을 수 없습니다.");
		}

		int homeNo = targetHome.getHomeNo();
		int existing = followDao.checkFollow(sqlSession, memberNo, homeNo);
		if (existing > 0) {
			return true;
		}

		int result = followDao.insertFollow(sqlSession, memberNo, homeNo);
		return result > 0;
	}

	@Override
	public boolean unfollow(int memberNo, int targetMemberNo) {
		if (memberNo <= 0 || targetMemberNo <= 0) {
			throw new IllegalArgumentException("memberNo/targetMemberNo가 올바르지 않습니다.");
		}
		if (memberNo == targetMemberNo) {
			return false;
		}

		Home targetHome = homeDao.selectHomeByMemberNo(sqlSession, targetMemberNo, null);
		if (targetHome == null) {
			throw new IllegalArgumentException("대상 홈을 찾을 수 없습니다.");
		}

		int homeNo = targetHome.getHomeNo();
		followDao.deleteFollow(sqlSession, memberNo, homeNo);
		return false;
	}

	@Override
	public ArrayList<HashMap<String, Object>> getFollowers(int memberNo, Integer currentMemberNo, String keyword, int page, int size) {
		if (memberNo <= 0) {
			throw new IllegalArgumentException("memberNo가 올바르지 않습니다.");
		}
		if (page < 0) page = 0;
		if (size < 1) size = 1;
		if (size > 50) size = 50;

		return followDao.selectFollowers(sqlSession, memberNo, currentMemberNo, keyword, page, size);
	}

	@Override
	public ArrayList<HashMap<String, Object>> getFollowing(int memberNo, Integer currentMemberNo, String keyword, int page, int size) {
		if (memberNo <= 0) {
			throw new IllegalArgumentException("memberNo가 올바르지 않습니다.");
		}
		if (page < 0) page = 0;
		if (size < 1) size = 1;
		if (size > 50) size = 50;

		return followDao.selectFollowing(sqlSession, memberNo, currentMemberNo, keyword, page, size);
	}

}
