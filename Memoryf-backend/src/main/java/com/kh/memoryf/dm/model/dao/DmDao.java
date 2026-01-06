package com.kh.memoryf.dm.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

/**
 * DM DAO
 * V3 스키마 기준: MEMBER_NO 사용
 */
@Repository
public class DmDao {

    // ===========================
    // 채팅방 관련
    // ===========================

    /**
     * 채팅방 목록 조회 (회원번호 기준)
     */
    public ArrayList<DmRoom> selectDmRoomList(SqlSessionTemplate sqlSession, int memberNo) {
        return new ArrayList<>(sqlSession.selectList("dmMapper.selectDmRoomList", memberNo));
    }

    /**
     * 채팅방 목록 조회 (회원 아이디 기준 - 레거시 호환)
     */
    public ArrayList<DmRoom> selectDmRoomListByMemberId(SqlSessionTemplate sqlSession, String memberId) {
        return new ArrayList<>(sqlSession.selectList("dmMapper.selectDmRoomListByMemberId", memberId));
    }

    /**
     * 기존 1:1 채팅방 존재 여부 확인
     */
    public Integer findExistingRoom(SqlSessionTemplate sqlSession, int memberNo, int targetMemberNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("targetMemberNo", targetMemberNo);
        return sqlSession.selectOne("dmMapper.findExistingRoom", map);
    }

    /**
     * 새 채팅방 생성
     */
    public int insertRoom(SqlSessionTemplate sqlSession, String roomType) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomType", roomType);
        sqlSession.insert("dmMapper.insertRoom", map);
        Object roomNo = map.get("roomNo");
        return roomNo != null ? ((Number) roomNo).intValue() : 0;
    }

    /**
     * 참여자 추가
     */
    public int insertParticipant(SqlSessionTemplate sqlSession, int roomNo, int memberNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("memberNo", memberNo);
        return sqlSession.insert("dmMapper.insertParticipant", map);
    }

    /**
     * 참여자 존재 여부 확인
     */
    public int checkParticipantExists(SqlSessionTemplate sqlSession, int roomNo, int memberNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("memberNo", memberNo);
        Integer result = sqlSession.selectOne("dmMapper.checkParticipantExists", map);
        return result != null ? result : 0;
    }

    /**
     * 채팅방 나가기
     */
    public int leaveRoom(SqlSessionTemplate sqlSession, int roomNo, int memberNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("memberNo", memberNo);
        return sqlSession.update("dmMapper.leaveRoom", map);
    }

    /**
     * 채팅방 삭제 (참여자 모두 삭제)
     */
    public int deleteDmRoom(SqlSessionTemplate sqlSession, int roomNo) {
        return sqlSession.delete("dmMapper.deleteDmRoom", roomNo);
    }

    /**
     * 채팅방 참여자 목록 조회 (회원번호 반환)
     */
    public List<Integer> getParticipantsByRoomNo(SqlSessionTemplate sqlSession, int roomNo) {
        return sqlSession.selectList("dmMapper.getParticipantsByRoomNo", roomNo);
    }

    /**
     * 채팅방 참여자 목록 조회 (회원 아이디 반환 - 레거시)
     */
    public List<String> getParticipantIdsByRoomNo(SqlSessionTemplate sqlSession, int roomNo) {
        return sqlSession.selectList("dmMapper.getParticipantIdsByRoomNo", roomNo);
    }

    // ===========================
    // 메시지 관련
    // ===========================

    /**
     * 메시지 저장
     */
    public int insertMessage(SqlSessionTemplate sqlSession, Map<String, Object> map) {
        return sqlSession.insert("dmMapper.insertMessage", map);
    }

    /**
     * 메시지 목록 조회
     */
    public ArrayList<DmMessage> selectMessage(SqlSessionTemplate sqlSession, Map<String, Object> map) {
        return new ArrayList<>(sqlSession.selectList("dmMapper.selectMessage", map));
    }

    /**
     * 메시지 삭제 (소프트 삭제)
     */
    public int deleteMessage(SqlSessionTemplate sqlSession, int messageNo) {
        return sqlSession.update("dmMapper.deleteMessage", messageNo);
    }

    /**
     * 메시지 ID로 ROOM_NO 조회
     */
    public Integer getRoomNoByMessageId(SqlSessionTemplate sqlSession, int messageNo) {
        return sqlSession.selectOne("dmMapper.getRoomNoByMessageId", messageNo);
    }

    // ===========================
    // 읽음 처리 관련
    // ===========================

    /**
     * 읽음 처리 (마지막 읽은 메시지 번호 업데이트)
     */
    public int updateReadStatus(SqlSessionTemplate sqlSession, int roomNo, int memberNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("memberNo", memberNo);
        return sqlSession.update("dmMapper.updateReadStatus", map);
    }

    /**
     * 미읽은 메시지 개수 조회
     */
    public int getUnreadMessageCount(SqlSessionTemplate sqlSession, int roomNo, int memberNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("memberNo", memberNo);
        Integer result = sqlSession.selectOne("dmMapper.getUnreadMessageCount", map);
        return result != null ? result : 0;
    }

    /**
     * 알림 음소거 설정
     */
    public int updateMuteStatus(SqlSessionTemplate sqlSession, int roomNo, int memberNo, String isMuted) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("memberNo", memberNo);
        map.put("isMuted", isMuted);
        return sqlSession.update("dmMapper.updateMuteStatus", map);
    }
}
