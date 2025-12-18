package com.kh.memoryf.comment.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.comment.model.dao.CommentDao;
import com.kh.memoryf.comment.model.vo.Comment;

@Service
public class CommentServiceImpl implements CommentService {
	
	@Autowired
	private CommentDao commentDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Override
	public ArrayList<Comment> selectCommentList(int feedNo, Integer memberNo) {
		return commentDao.selectCommentList(sqlSession, feedNo, memberNo);
	}
	
	@Override
	public int insertComment(Comment comment) {
		return commentDao.insertComment(sqlSession, comment);
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
