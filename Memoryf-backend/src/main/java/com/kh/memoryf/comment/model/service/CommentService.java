package com.kh.memoryf.comment.model.service;

import java.util.ArrayList;

import com.kh.memoryf.comment.model.vo.Comment;

public interface CommentService {
	
	/**
	 * 특정 피드의 댓글 목록 조회
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 댓글 목록
	 */
	ArrayList<Comment> selectCommentList(int feedNo, Integer memberNo);
	
	/**
	 * 댓글 생성
	 * @param comment 댓글 정보
	 * @return 성공 여부
	 */
	int insertComment(Comment comment);
	
	/**
	 * 댓글 삭제
	 * @param commentNo 댓글 번호
	 * @return 성공 여부
	 */
	int deleteComment(int commentNo);
	
	/**
	 * 댓글 좋아요 토글
	 * @param commentNo 댓글 번호
	 * @param memberNo 회원 번호
	 * @return 좋아요 여부 (true: 좋아요 추가, false: 좋아요 삭제)
	 */
	boolean toggleCommentLike(int commentNo, int memberNo);
}
