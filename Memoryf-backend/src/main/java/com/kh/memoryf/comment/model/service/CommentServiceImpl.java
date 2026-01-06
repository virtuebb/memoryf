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

/**
 * 댓글 서비스 구현
 * V3 스키마: 대댓글 지원 (PARENT_COMMENT_NO, DEPTH)
 */
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
	
	// ===========================
	// 댓글 조회
	// ===========================
	
	@Override
	public ArrayList<Comment> selectCommentList(int feedNo, Integer memberNo) {
		return commentDao.selectCommentList(sqlSession, feedNo, memberNo);
	}
	
	@Override
	public ArrayList<Comment> selectReplyList(int parentCommentNo, Integer memberNo) {
		return commentDao.selectReplyList(sqlSession, parentCommentNo, memberNo);
	}
	
	@Override
	public ArrayList<Comment> selectAllComments(int feedNo, Integer memberNo) {
		return commentDao.selectAllCommentsByFeed(sqlSession, feedNo, memberNo);
	}
	
	@Override
	public Comment getComment(int commentNo) {
		return commentDao.selectCommentByNo(sqlSession, commentNo);
	}
	
	// ===========================
	// 댓글 생성/삭제
	// ===========================
	
	@Override
	@Transactional
	public int insertComment(Comment comment) {
		// depth와 parentCommentNo 설정
		if (comment.getParentCommentNo() == null) {
			comment.setDepth(0);
		} else {
			comment.setDepth(1);
		}
		
		int result = commentDao.insertComment(sqlSession, comment);
		
		if (result > 0) {
			// 원댓글인 경우: 피드 작성자에게 알림
			if (comment.getParentCommentNo() == null) {
				Feed feed = feedDao.selectFeed(sqlSession, comment.getFeedNo(), comment.getMemberNo());
				if (feed != null && feed.getMemberNo() != comment.getMemberNo()) {
					Notification noti = new Notification();
					noti.setReceiverNo(feed.getMemberNo());
					noti.setSenderNo(comment.getMemberNo());
					noti.setType("COMMENT_FEED");
					noti.setTargetId(comment.getFeedNo());
					notificationService.createNotification(noti);
				}
			} else {
				// 대댓글인 경우: 부모 댓글 작성자에게 알림
				Comment parentComment = commentDao.selectCommentByNo(sqlSession, comment.getParentCommentNo());
				if (parentComment != null && parentComment.getMemberNo() != comment.getMemberNo()) {
					Notification noti = new Notification();
					noti.setReceiverNo(parentComment.getMemberNo());
					noti.setSenderNo(comment.getMemberNo());
					noti.setType("COMMENT_REPLY");
					noti.setTargetId(comment.getFeedNo());
					noti.setTargetSubId(comment.getParentCommentNo());
					notificationService.createNotification(noti);
				}
			}
		}
		
		return result;
	}
	
	@Override
	@Transactional
	public int insertReply(Comment comment) {
		comment.setDepth(1);
		int result = commentDao.insertReply(sqlSession, comment);
		
		if (result > 0 && comment.getParentCommentNo() != null) {
			// 부모 댓글 작성자에게 알림
			Comment parentComment = commentDao.selectCommentByNo(sqlSession, comment.getParentCommentNo());
			if (parentComment != null && parentComment.getMemberNo() != comment.getMemberNo()) {
				Notification noti = new Notification();
				noti.setReceiverNo(parentComment.getMemberNo());
				noti.setSenderNo(comment.getMemberNo());
				noti.setType("COMMENT_REPLY");
				noti.setTargetId(comment.getFeedNo());
				noti.setTargetSubId(comment.getParentCommentNo());
				notificationService.createNotification(noti);
			}
		}
		
		return result;
	}
	
	@Override
	public int deleteComment(int commentNo, boolean deleteReplies) {
		if (deleteReplies) {
			return commentDao.deleteCommentWithReplies(sqlSession, commentNo);
		}
		return commentDao.deleteComment(sqlSession, commentNo);
	}
	
	@Override
	public int deleteComment(int commentNo) {
		return commentDao.deleteComment(sqlSession, commentNo);
	}
	
	// ===========================
	// 댓글 좋아요
	// ===========================
	
	@Override
	@Transactional
	public boolean toggleCommentLike(int commentNo, int memberNo) {
		int likeCount = commentDao.checkCommentLike(sqlSession, commentNo, memberNo);
		
		if (likeCount > 0) {
			commentDao.deleteCommentLike(sqlSession, commentNo, memberNo);
			return false;
		} else {
			commentDao.insertCommentLike(sqlSession, commentNo, memberNo);
			
			// 좋아요 알림 생성
			Comment comment = commentDao.selectCommentByNo(sqlSession, commentNo);
			if (comment != null && comment.getMemberNo() != memberNo) {
				Notification noti = new Notification();
				noti.setReceiverNo(comment.getMemberNo());
				noti.setSenderNo(memberNo);
				noti.setType("LIKE_COMMENT");
				noti.setTargetId(comment.getFeedNo());
				noti.setTargetSubId(commentNo);
				notificationService.createNotification(noti);
			}
			
			return true;
		}
	}
	
	// ===========================
	// 통계
	// ===========================
	
	@Override
	public int countComments(int feedNo) {
		return commentDao.countCommentsByFeed(sqlSession, feedNo);
	}
}
