package com.kh.memoryf.feed.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.feed.model.vo.Feed;

@Repository
public class FeedDao {
	
	/**
	 * 피드 목록 조회 (정렬 옵션 포함)
	 * @param sqlSession
	 * @param sortBy 정렬 기준 (popular, following, recent)
	 * @param memberNo 현재 로그인한 회원 번호 (팔로잉 필터링용)
	 * @return 피드 목록
	 */
	public ArrayList<Feed> selectFeedList(SqlSession sqlSession, String sortBy, Integer memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("sortBy", sortBy);
		params.put("memberNo", memberNo);
		
		return new ArrayList<>(sqlSession.selectList("feedMapper.selectFeedList", params));
	}
	
	/**
	 * 피드 상세 조회
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호 (좋아요/북마크 여부 확인용)
	 * @return 피드 상세 정보
	 */
	public Feed selectFeed(SqlSession sqlSession, int feedNo, Integer memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.selectOne("feedMapper.selectFeed", params);
	}
	
	/**
	 * 피드 생성
	 * @param sqlSession
	 * @param feed 피드 정보
	 * @return 생성된 피드 번호
	 */
	public int insertFeed(SqlSession sqlSession, Feed feed) {
		return sqlSession.insert("feedMapper.insertFeed", feed);
	}
	
	/**
	 * 피드 파일 등록
	 * @param sqlSession
	 * @param feedFile 피드 파일 정보
	 * @return 성공 여부
	 */
	public int insertFeedFile(SqlSession sqlSession, com.kh.memoryf.feed.model.vo.FeedFile feedFile) {
		return sqlSession.insert("feedMapper.insertFeedFile", feedFile);
	}
	
	/**
	 * 피드 좋아요 추가
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 성공 여부
	 */
	public int insertFeedLike(SqlSession sqlSession, int feedNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.insert("feedMapper.insertFeedLike", params);
	}
	
	/**
	 * 피드 좋아요 삭제
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 성공 여부
	 */
	public int deleteFeedLike(SqlSession sqlSession, int feedNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.delete("feedMapper.deleteFeedLike", params);
	}
	
	/**
	 * 피드 좋아요 여부 확인
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 좋아요 여부
	 */
	public int checkFeedLike(SqlSession sqlSession, int feedNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.selectOne("feedMapper.checkFeedLike", params);
	}
	
	/**
	 * 피드 삭제 (IS_DEL = 'Y')
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @return 성공 여부
	 */
	public int deleteFeed(SqlSession sqlSession, int feedNo) {
		return sqlSession.update("feedMapper.deleteFeed", feedNo);
	}
	
	/**
	 * 피드 수정
	 * @param sqlSession
	 * @param feed 수정할 피드 정보
	 * @return 수정 건수
	 */
	public int updateFeed(SqlSession sqlSession, Feed feed) {
		return sqlSession.update("feedMapper.updateFeed", feed);
	}
	
	/**
	 * 피드 북마크 추가
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 성공 여부
	 */
	public int insertFeedBookmark(SqlSession sqlSession, int feedNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.insert("feedMapper.insertFeedBookmark", params);
	}
	
	/**
	 * 피드 북마크 삭제
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 성공 여부
	 */
	public int deleteFeedBookmark(SqlSession sqlSession, int feedNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.delete("feedMapper.deleteFeedBookmark", params);
	}
	
	/**
	 * 피드 북마크 여부 확인
	 * @param sqlSession
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 북마크 여부
	 */
	public int checkFeedBookmark(SqlSession sqlSession, int feedNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("feedNo", feedNo);
		params.put("memberNo", memberNo);
		return sqlSession.selectOne("feedMapper.checkFeedBookmark", params);
	}
	
	/**
	 * 북마크한 피드 목록 조회
	 * @param sqlSession
	 * @param memberNo 회원 번호
	 * @return 북마크한 피드 목록
	 */
	public ArrayList<Feed> selectBookmarkedFeedList(SqlSession sqlSession, int memberNo) {
		return new ArrayList<>(sqlSession.selectList("feedMapper.selectBookmarkedFeedList", memberNo));
	}
}
