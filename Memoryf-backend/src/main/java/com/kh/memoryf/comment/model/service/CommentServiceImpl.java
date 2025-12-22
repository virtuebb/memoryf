package com.kh.memoryf.comment.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.comment.model.dao.CommentDao;
import com.kh.memoryf.comment.model.vo.Comment;
import com.kh.memoryf.feed.model.dao.FeedDao;
import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.notification.model.service.NotificationService;
import com.kh.memoryf.notification.model.vo.Notification;

@Service
public class CommentServiceImpl implements CommentService {
	
	@Autowired
	private CommentDao commentDao;
	
	@Autowired
	private FeedDao feedDao;
	
	@Autowired
	private NotificationService notificationService;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Override
	public ArrayList<Comment> selectCommentList(int feedNo, Integer memberNo) {
		return commentDao.selectCommentList(sqlSession, feedNo, memberNo);
	}
	
	@Override
	@Transactional
	public int insertComment(Comment comment) {
		int result = commentDao.insertComment(sqlSession, comment);
		
		if (result > 0) {
			// 알림 생성
			Feed feed = feedDao.selectFeed(sqlSession, comment.getFeedNo(), comment.getWriter());
			if (feed != null && feed.getMemberNo() != comment.getWriter()) { // 자기 자신 게시물 댓글은 알림 제외
				Notification noti = new Notification();
				noti.setReceiverNo(feed.getMemberNo());
				noti.setSenderNo(comment.getWriter());
				noti.setType("COMMENT_FEED");
				noti.setTargetId(comment.getFeedNo());
				notificationService.createNotification(noti);
			}
		}
		
		return result;
	}
	
	@Override
	public int deleteComment(int commentNo) {
		return commentDao.deleteComment(sqlSession, commentNo);
	}
	
	@Override
	@Transactional
	public boolean toggleCommentLike(int commentNo, int memberNo) {
		// 이미 좋아요 했는지 확인
		int likeCount = commentDao.checkCommentLike(sqlSession, commentNo, memberNo);
		
		if (likeCount > 0) {
			// 좋아요 삭제
			commentDao.deleteCommentLike(sqlSession, commentNo, memberNo);
			return false;
		} else {
			// 좋아요 추가
			commentDao.insertCommentLike(sqlSession, commentNo, memberNo);
			return true;
		}
	}
}
