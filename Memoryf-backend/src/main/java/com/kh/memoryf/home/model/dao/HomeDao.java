package com.kh.memoryf.home.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.guestbook.model.vo.Guestbook;
import com.kh.memoryf.home.model.vo.Home;

@Repository
public class HomeDao {
	
	/**
	 * 회원 번호로 홈 조회 (통계 포함)
	 * @param sqlSession
	 * @param memberNo
	 * @param currentMemberNo 현재 로그인한 회원 번호 (팔로우 여부 확인용)
	 * @return Home
	 */
	public Home selectHomeByMemberNo(SqlSessionTemplate sqlSession, int memberNo, Integer currentMemberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("currentMemberNo", currentMemberNo);
		return sqlSession.selectOne("homeMapper.selectHomeByMemberNo", params);
	}
	
	/**
	 * 홈 번호로 홈 조회
	 * @param sqlSession
	 * @param homeNo
	 * @param currentMemberNo 현재 로그인한 회원 번호
	 * @return Home
	 */
	public Home selectHomeByHomeNo(SqlSessionTemplate sqlSession, int homeNo, Integer currentMemberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("homeNo", homeNo);
		params.put("currentMemberNo", currentMemberNo);
		return sqlSession.selectOne("homeMapper.selectHomeByHomeNo", params);
	}
	
	/**
	 * 홈 번호로 방명록 목록 조회
	 * @param sqlSession
	 * @param homeNo
	 * @param currentMemberNo 현재 로그인한 회원 번호 (좋아요 여부 확인용)
	 * @return ArrayList<Guestbook>
	 */
	public ArrayList<Guestbook> selectGuestbookList(SqlSessionTemplate sqlSession, int homeNo, Integer currentMemberNo, int offset, int limit) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("homeNo", homeNo);
		params.put("currentMemberNo", currentMemberNo);
		params.put("offset", offset);
		params.put("limit", limit);
		return new ArrayList<>(sqlSession.selectList("homeMapper.selectGuestbookList", params));
	}
	
	/**
	 * 방명록 생성
	 * @param sqlSession
	 * @param guestbook
	 * @return int
	 */
	public int insertGuestbook(SqlSessionTemplate sqlSession, Guestbook guestbook) {
		return sqlSession.insert("homeMapper.insertGuestbook", guestbook);
	}
	
	/**
	 * 방명록 삭제
	 * @param sqlSession
	 * @param guestbookNo
	 * @return int
	 */
	public int deleteGuestbook(SqlSessionTemplate sqlSession, int guestbookNo) {
		return sqlSession.update("homeMapper.deleteGuestbook", guestbookNo);
	}
	
	/**
	 * 방명록 좋아요 추가
	 * @param sqlSession
	 * @param guestbookNo
	 * @param memberNo
	 * @return int
	 */
	public int insertGuestbookLike(SqlSessionTemplate sqlSession, int guestbookNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("guestbookNo", guestbookNo);
		params.put("memberNo", memberNo);
		return sqlSession.insert("homeMapper.insertGuestbookLike", params);
	}
	
	/**
	 * 방명록 좋아요 삭제
	 * @param sqlSession
	 * @param guestbookNo
	 * @param memberNo
	 * @return int
	 */
	public int deleteGuestbookLike(SqlSessionTemplate sqlSession, int guestbookNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("guestbookNo", guestbookNo);
		params.put("memberNo", memberNo);
		return sqlSession.delete("homeMapper.deleteGuestbookLike", params);
	}
	
	/**
	 * 방명록 좋아요 여부 확인
	 * @param sqlSession
	 * @param guestbookNo
	 * @param memberNo
	 * @return int
	 */
	public int checkGuestbookLike(SqlSessionTemplate sqlSession, int guestbookNo, int memberNo) {
		HashMap<String, Object> params = new HashMap<>();
		params.put("guestbookNo", guestbookNo);
		params.put("memberNo", memberNo);
		return sqlSession.selectOne("homeMapper.checkGuestbookLike", params);
	}
	
	/**
	 * 프로필 이미지 업데이트
	 * @param sqlSession
	 * @param home
	 * @return int
	 */
	public int updateProfileImage(SqlSessionTemplate sqlSession, Home home) {
		return sqlSession.update("homeMapper.updateProfileImage", home);
	}
	
	/**
	 * 상태메시지 업데이트
	 * @param sqlSession
	 * @param home
	 * @return int
	 */
	public int updateStatusMsg(SqlSessionTemplate sqlSession, Home home) {
		return sqlSession.update("homeMapper.updateStatusMsg", home);
	}

	/**
	 * 계정 공개 범위 업데이트
	 * @param sqlSession
	 * @param home
	 * @return int
	 */
	public int updatePrivacy(SqlSessionTemplate sqlSession, Home home) {
		return sqlSession.update("homeMapper.updatePrivacy", home);
	}
}
