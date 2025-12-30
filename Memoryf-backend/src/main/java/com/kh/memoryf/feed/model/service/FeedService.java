package com.kh.memoryf.feed.model.service;

import java.util.ArrayList;

import com.kh.memoryf.feed.model.vo.Feed;

public interface FeedService {
	
	/**
	 * 피드 목록 조회 (정렬 옵션 포함)
	 * @param sortBy 정렬 기준 (popular, following, recent)
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 피드 목록
	 */
	ArrayList<Feed> selectFeedList(String sortBy, Integer memberNo);

	/**
	 * 피드 목록 조회 (페이지네이션)
	 * @param sortBy 정렬 기준 (popular, following, recent)
	 * @param memberNo 현재 로그인한 회원 번호
	 * @param page 0-based 페이지
	 * @param size 페이지 크기
	 */
	ArrayList<Feed> selectFeedList(String sortBy, Integer memberNo, int page, int size);
	
	/**
	 * 피드 상세 조회
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호 (좋아요 여부 확인용)
	 * @return 피드 상세 정보
	 */
	Feed selectFeed(int feedNo, Integer memberNo);
	
	/**
	 * 피드 생성
	 * @param feed 피드 정보
	 * @return 생성된 피드 번호
	 */
	int insertFeed(Feed feed);
	
	/**
	 * 피드 수정
	 * @param feed 수정할 피드 정보 (feedNo 필수)
	 * @return 수정 건수
	 */
	int updateFeed(Feed feed);
	
	/**
	 * 피드 좋아요 토글 (좋아요 추가/삭제)
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 좋아요 여부 (true: 좋아요 추가, false: 좋아요 삭제)
	 */
	boolean toggleFeedLike(int feedNo, int memberNo);
	
	/**
	 * 피드 북마크 토글 (북마크 추가/삭제)
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호
	 * @return 북마크 여부 (true: 북마크 추가, false: 북마크 삭제)
	 */
	boolean toggleFeedBookmark(int feedNo, int memberNo);
	
	/**
	 * 북마크한 피드 목록 조회
	 * @param memberNo 회원 번호
	 * @return 북마크한 피드 목록
	 */
	ArrayList<Feed> selectBookmarkedFeedList(int memberNo);

	/**
	 * 프로필용(작성자 기준) 피드 목록 조회 (페이지네이션)
	 * @param targetMemberNo 프로필 주인 회원 번호(작성자)
	 * @param viewerMemberNo 현재 로그인한 회원 번호(좋아요 여부 확인용, optional)
	 * @param page 0-based 페이지
	 * @param size 페이지 크기
	 */
	ArrayList<Feed> selectProfileFeedList(int targetMemberNo, Integer viewerMemberNo, int page, int size);
	
	/**
	 * 피드 삭제
	 * @param feedNo 피드 번호
	 * @return 성공 여부
	 */
	int deleteFeed(int feedNo);

	/**
	 * 내가 좋아요한 피드 목록 조회
	 * @param map 검색 조건 (memberNo, sortBy, startDate, endDate)
	 * @return 피드 목록
	 */
	ArrayList<Feed> selectLikedFeedList(java.util.HashMap<String, Object> map);

	/**
	 * 내가 댓글 단 목록 조회
	 * @param map 검색 조건 (memberNo, sortBy, startDate, endDate)
	 * @return 댓글 목록
	 */
	ArrayList<com.kh.memoryf.comment.model.vo.Comment> selectCommentedFeedList(java.util.HashMap<String, Object> map);
}
