package com.kh.memoryf.comment.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.comment.model.vo.Comment;

/**
 * 댓글 DAO
 * V3 스키마: 대댓글 지원 (PARENT_COMMENT_NO, DEPTH)
 */
@Repository
public class CommentDao {
	
	// ===========================
	// 댓글 조회
	// ===========================
	
	/**
	 * 특정 피드의 원댓글 목록 조회 (depth=0)
	 */
	public ArrayList<Comment> selectCommentList(SqlSession sqlSession, int feedNo, Integer memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return new ArrayList<>(sqlSession.selectList("commentMapper.selectCommentList", params));
	}
	
	/**
	 * 특정 원댓글의 대댓글 목록 조회
	 */
	public ArrayList<Comment> selectReplyList(SqlSession sqlSession, int parentCommentNo, Integer memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("parentCommentNo", parentCommentNo);
		params.put("memberNo", memberNo);
		return new ArrayList<>(sqlSession.selectList("commentMapper.selectReplyList", params));
	}
	
	/**
	 * 피드의 모든 댓글 조회 (계층 구조 정렬)
	 */
	public ArrayList<Comment> selectAllCommentsByFeed(SqlSession sqlSession, int feedNo, Integer memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return new ArrayList<>(sqlSession.selectList("commentMapper.selectAllCommentsByFeed", params));
	}
	
	/**
	 * 댓글 상세 조회
	 */
	public Comment selectCommentByNo(SqlSession sqlSession, int commentNo) {
		return sqlSession.selectOne("commentMapper.selectCommentByNo", commentNo);
	}
	
	// ===========================
	// 댓글 생성/수정/삭제
	// ===========================
	
	/**
	 * 댓글 생성 (원댓글 또는 대댓글)
	 */
	public int insertComment(SqlSession sqlSession, Comment comment) {
		return sqlSession.insert("commentMapper.insertComment", comment);
	}
	
	/**
	 * 대댓글 생성
	 */
	public int insertReply(SqlSession sqlSession, Comment comment) {
		return sqlSession.insert("commentMapper.insertReply", comment);
	}
	
	/**
	 * 댓글 삭제 (IS_DEL = 'Y')
	 */
	public int deleteComment(SqlSession sqlSession, int commentNo) {
		return sqlSession.update("commentMapper.deleteComment", commentNo);
	}
	
	/**
	 * 댓글 및 대댓글 모두 삭제
	 */
	public int deleteCommentWithReplies(SqlSession sqlSession, int commentNo) {
		return sqlSession.update("commentMapper.deleteCommentWithReplies", commentNo);
	}
	
	// ===========================
	// 댓글 좋아요
	// ===========================
	
	/**
	 * 댓글 좋아요 추가
	 */
	public int insertCommentLike(SqlSession sqlSession, int commentNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("commentNo", commentNo);
		params.put("memberNo", memberNo);
		return sqlSession.insert("commentMapper.insertCommentLike", params);
	}
	
	/**
	 * 댓글 좋아요 삭제
	 */
	public int deleteCommentLike(SqlSession sqlSession, int commentNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("commentNo", commentNo);
		params.put("memberNo", memberNo);
		return sqlSession.delete("commentMapper.deleteCommentLike", params);
	}
	
	/**
	 * 댓글 좋아요 여부 확인
	 */
	public int checkCommentLike(SqlSession sqlSession, int commentNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("commentNo", commentNo);
		params.put("memberNo", memberNo);
		return sqlSession.selectOne("commentMapper.checkCommentLike", params);
	}
	
	// ===========================
	// 통계
	// ===========================
	
	/**
	 * 피드의 총 댓글 수 (대댓글 포함)
	 */
	public int countCommentsByFeed(SqlSession sqlSession, int feedNo) {
		Integer count = sqlSession.selectOne("commentMapper.countCommentsByFeed", feedNo);
		return count != null ? count : 0;
	}
}
