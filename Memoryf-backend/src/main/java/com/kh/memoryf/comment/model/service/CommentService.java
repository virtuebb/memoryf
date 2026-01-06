package com.kh.memoryf.comment.model.service;

import java.util.ArrayList;

import com.kh.memoryf.comment.model.vo.Comment;

/**
 * 댓글 서비스 인터페이스
 * V3 스키마: 대댓글 지원 (PARENT_COMMENT_NO, DEPTH)
 */
public interface CommentService {
	
	// ===========================
	// 댓글 조회
	// ===========================
	
	/**
	 * 특정 피드의 원댓글 목록 조회 (depth=0)
	 */
	ArrayList<Comment> selectCommentList(int feedNo, Integer memberNo);
	
	/**
	 * 특정 원댓글의 대댓글 목록 조회
	 */
	ArrayList<Comment> selectReplyList(int parentCommentNo, Integer memberNo);
	
	/**
	 * 피드의 모든 댓글 조회 (계층 구조)
	 */
	ArrayList<Comment> selectAllComments(int feedNo, Integer memberNo);
	
	/**
	 * 댓글 상세 조회
	 */
	Comment getComment(int commentNo);
	
	// ===========================
	// 댓글 생성/삭제
	// ===========================
	
	/**
	 * 원댓글 생성
	 */
	int insertComment(Comment comment);
	
	/**
	 * 대댓글 생성
	 */
	int insertReply(Comment comment);
	
	/**
	 * 댓글 삭제
	 * @param commentNo 댓글 번호
	 * @param deleteReplies 대댓글도 함께 삭제할지 여부
	 */
	int deleteComment(int commentNo, boolean deleteReplies);
	
	/**
	 * 댓글 삭제 (레거시 호환)
	 */
	int deleteComment(int commentNo);
	
	// ===========================
	// 댓글 좋아요
	// ===========================
	
	/**
	 * 댓글 좋아요 토글
	 * @return true: 좋아요 추가, false: 좋아요 삭제
	 */
	boolean toggleCommentLike(int commentNo, int memberNo);
	
	// ===========================
	// 통계
	// ===========================
	
	/**
	 * 피드의 총 댓글 수
	 */
	int countComments(int feedNo);
}
