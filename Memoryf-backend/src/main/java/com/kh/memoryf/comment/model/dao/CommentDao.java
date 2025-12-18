package com.kh.memoryf.comment.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.comment.model.vo.Comment;

@Repository
public class CommentDao {
	
	/**
	 * 특정 피드의 댓글 목록 조회
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호 (좋아요 여부 확인용)
	 * @return 댓글 목록
	 */
	public ArrayList<Comment> selectCommentList(SqlSession sqlSession, int feedNo, Integer memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return new ArrayList<>(sqlSession.selectList("commentMapper.selectCommentList", params));
	}
	
	/**
	 * 댓글 생성
	 * @param sqlSession
	 * @param comment 댓글 정보
	 * @return 성공 여부
	 */
	public int insertComment(SqlSession sqlSession, Comment comment) {
		return sqlSession.insert("commentMapper.insertComment", comment);
	}
	
	/**
	 * 댓글 삭제 (IS_DEL = 'Y')
	 * @param sqlSession
	 * @param commentNo 댓글 번호
	 * @return 성공 여부
	 */
	public int deleteComment(SqlSession sqlSession, int commentNo) {
		return sqlSession.update("commentMapper.deleteComment", commentNo);
	}
	
	/**
	 * 댓글 좋아요 추가
	 * @param sqlSession
	 * @param commentNo 댓글 번호
	 * @param memberNo 회원 번호
	 * @return 성공 여부
	 */
	public int insertCommentLike(SqlSession sqlSession, int commentNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("commentNo", commentNo);
		params.put("memberNo", memberNo);
		return sqlSession.insert("commentMapper.insertCommentLike", params);
	}
	
	/**
	 * 댓글 좋아요 삭제
	 * @param sqlSession
	 * @param commentNo 댓글 번호
	 * @param memberNo 회원 번호
	 * @return 성공 여부
	 */
	public int deleteCommentLike(SqlSession sqlSession, int commentNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("commentNo", commentNo);
		params.put("memberNo", memberNo);
		return sqlSession.delete("commentMapper.deleteCommentLike", params);
	}
	
	/**
	 * 댓글 좋아요 여부 확인
	 * @param sqlSession
	 * @param commentNo 댓글 번호
	 * @param memberNo 회원 번호
	 * @return 좋아요 여부
	 */
	public int checkCommentLike(SqlSession sqlSession, int commentNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("commentNo", commentNo);
		params.put("memberNo", memberNo);
		return sqlSession.selectOne("commentMapper.checkCommentLike", params);
	}
}
