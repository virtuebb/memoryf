package com.kh.memoryf.home.model.service;

import java.util.ArrayList;

import com.kh.memoryf.guestbook.model.vo.Guestbook;
import com.kh.memoryf.home.model.vo.Home;

public interface HomeService {
	
	/**
	 * 회원 번호로 홈 조회 (통계 포함)
	 * @param memberNo 조회할 회원 번호
	 * @param currentMemberNo 현재 로그인한 회원 번호
	 * @return Home
	 */
	Home getHomeByMemberNo(int memberNo, Integer currentMemberNo);
	
	/**
	 * 홈 번호로 방명록 목록 조회
	 * @param homeNo 홈 번호
	 * @param currentMemberNo 현재 로그인한 회원 번호
	 * @return ArrayList<Guestbook>
	 */
	ArrayList<Guestbook> getGuestbookList(int homeNo, Integer currentMemberNo, int offset, int limit);
	
	/**
	 * 방명록 생성
	 * @param guestbook
	 * @return int
	 */
	int createGuestbook(Guestbook guestbook);
	
	/**
	 * 방명록 삭제
	 * @param guestbookNo
	 * @return int
	 */
	int deleteGuestbook(int guestbookNo);
	
	/**
	 * 방명록 좋아요 토글
	 * @param guestbookNo
	 * @param memberNo
	 * @return boolean
	 */
	boolean toggleGuestbookLike(int guestbookNo, int memberNo);
	
	/**
	 * 홈 번호로 홈 조회
	 * @param homeNo 홈 번호
	 * @param currentMemberNo 현재 로그인한 회원 번호
	 * @return Home
	 */
	Home getHome(int homeNo, Integer currentMemberNo);
	
	/**
	 * 프로필 이미지 업데이트
	 * @param home
	 * @return int
	 */
	int updateProfileImage(Home home);
	
	/**
	 * 상태메시지 업데이트
	 * @param home
	 * @return int
	 */
	int updateStatusMsg(Home home);

	/**
	 * 계정 공개 범위 업데이트
	 * @param home
	 * @return int
	 */
	int updatePrivacy(Home home);
}
