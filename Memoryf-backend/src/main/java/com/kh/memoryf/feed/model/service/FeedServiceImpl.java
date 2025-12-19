package com.kh.memoryf.feed.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.feed.model.dao.FeedDao;
import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.feed.model.vo.FeedFile;

@Service
public class FeedServiceImpl implements FeedService {
	
	@Autowired
	private FeedDao feedDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Override
	public ArrayList<Feed> selectFeedList(String sortBy, Integer memberNo) {
		return feedDao.selectFeedList(sqlSession, sortBy, memberNo);
	}

	@Override
	public ArrayList<Feed> selectFeedList(String sortBy, Integer memberNo, int page, int size) {
		if (page < 0) {
			page = 0;
		}
		if (size <= 0) {
			size = 18;
		}
		return feedDao.selectFeedList(sqlSession, sortBy, memberNo, page, size);
	}
	
	@Override
	public Feed selectFeed(int feedNo, Integer memberNo) {
		// SQL에서 LEFT JOIN으로 isLiked와 isBookmarked를 직접 조회하므로
		// 별도의 checkFeedLike, checkFeedBookmark 호출 불필요
		return feedDao.selectFeed(sqlSession, feedNo, memberNo);
	}
	
	@Override
	@Transactional
	public int insertFeed(Feed feed) {
		// 피드 생성
		int result = feedDao.insertFeed(sqlSession, feed);
		
		// 피드 파일이 있으면 등록
		if (result > 0 && feed.getFeedFiles() != null && !feed.getFeedFiles().isEmpty()) {
			for (FeedFile feedFile : feed.getFeedFiles()) {
				feedFile.setFeedNo(feed.getFeedNo());
				feedDao.insertFeedFile(sqlSession, feedFile);
			}
		}
		
		return result;
	}
	
	@Override
	@Transactional
	public boolean toggleFeedLike(int feedNo, int memberNo) {
		// 이미 좋아요 했는지 확인
		int likeCount = feedDao.checkFeedLike(sqlSession, feedNo, memberNo);
		
		if (likeCount > 0) {
			// 좋아요 삭제
			feedDao.deleteFeedLike(sqlSession, feedNo, memberNo);
			return false;
		} else {
			// 좋아요 추가
			feedDao.insertFeedLike(sqlSession, feedNo, memberNo);
			return true;
		}
	}
	
	@Override
	public int deleteFeed(int feedNo) {
		return feedDao.deleteFeed(sqlSession, feedNo);
	}
	
	@Override
	public int updateFeed(Feed feed) {
		return feedDao.updateFeed(sqlSession, feed);
	}
	
	@Override
	@Transactional
	public boolean toggleFeedBookmark(int feedNo, int memberNo) {
		// 이미 북마크 했는지 확인
		int bookmarkCount = feedDao.checkFeedBookmark(sqlSession, feedNo, memberNo);
		
		if (bookmarkCount > 0) {
			// 북마크 삭제
			feedDao.deleteFeedBookmark(sqlSession, feedNo, memberNo);
			return false;
		} else {
			// 북마크 추가
			feedDao.insertFeedBookmark(sqlSession, feedNo, memberNo);
			return true;
		}
	}
	
	@Override
	public ArrayList<Feed> selectBookmarkedFeedList(int memberNo) {
		return feedDao.selectBookmarkedFeedList(sqlSession, memberNo);
	}

	@Override
	public ArrayList<Feed> selectProfileFeedList(int targetMemberNo, Integer viewerMemberNo, int page, int size) {
		if (page < 0) {
			page = 0;
		}
		if (size <= 0) {
			size = 18;
		}
		return feedDao.selectFeedListByTargetMember(sqlSession, targetMemberNo, viewerMemberNo, page, size);
	}
}
