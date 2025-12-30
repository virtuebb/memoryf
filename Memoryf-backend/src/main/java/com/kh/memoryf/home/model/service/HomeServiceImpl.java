package com.kh.memoryf.home.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.guestbook.model.vo.Guestbook;
import com.kh.memoryf.home.model.dao.HomeDao;
import com.kh.memoryf.home.model.vo.Home;

@Service
public class HomeServiceImpl implements HomeService {
	
	@Autowired
	private HomeDao homeDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;

	@Override
	public Home getHomeByMemberNo(int memberNo, Integer currentMemberNo) {
		Home home = homeDao.selectHomeByMemberNo(sqlSession, memberNo, currentMemberNo);
		return home;
	}

	@Override
	public Home getHome(int homeNo, Integer currentMemberNo) {
		return homeDao.selectHomeByHomeNo(sqlSession, homeNo, currentMemberNo);
	}

	@Override
	public ArrayList<Guestbook> getGuestbookList(int homeNo, Integer currentMemberNo, int offset, int limit) {
		return homeDao.selectGuestbookList(sqlSession, homeNo, currentMemberNo, offset, limit);
	}

	@Override
	@Transactional
	public int createGuestbook(Guestbook guestbook) {
		return homeDao.insertGuestbook(sqlSession, guestbook);
	}

	@Override
	public int deleteGuestbook(int guestbookNo) {
		return homeDao.deleteGuestbook(sqlSession, guestbookNo);
	}

	@Override
	@Transactional
	public boolean toggleGuestbookLike(int guestbookNo, int memberNo) {
		// 이미 좋아요 했는지 확인
		int likeCount = homeDao.checkGuestbookLike(sqlSession, guestbookNo, memberNo);
		
		if (likeCount > 0) {
			// 좋아요 삭제
			homeDao.deleteGuestbookLike(sqlSession, guestbookNo, memberNo);
			return false;
		} else {
			// 좋아요 추가
			homeDao.insertGuestbookLike(sqlSession, guestbookNo, memberNo);
			return true;
		}
	}

	@Override
	public int updateProfileImage(Home home) {
		return homeDao.updateProfileImage(sqlSession, home);
	}

	@Override
	public int updateStatusMsg(Home home) {
		return homeDao.updateStatusMsg(sqlSession, home);
	}

	@Override
	public int updatePrivacy(Home home) {
		return homeDao.updatePrivacy(sqlSession, home);
	}
}
