package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.dm.model.dao.DmDao;
import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

/**
 * DM Service Implementation
 * V3 스키마 기준: MEMBER_NO 사용
 */
@Service
public class DmServiceImpl implements DmService {

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Autowired
    private DmDao dmDao;

    // ===========================
    // 채팅방 관련
    // ===========================

    @Override
    public ArrayList<DmRoom> selectDmRoomList(int memberNo) {
        return dmDao.selectDmRoomList(sqlSession, memberNo);
    }

    @Override
    public ArrayList<DmRoom> selectDmRoomListByMemberId(String memberId) {
        return dmDao.selectDmRoomListByMemberId(sqlSession, memberId);
    }

    @Override
    @Transactional
    public int createOrGetDmRoom(int memberNo, int targetMemberNo) {
        // 기존 1:1 채팅방 존재 여부 확인
        Integer existingRoomNo = dmDao.findExistingRoom(sqlSession, memberNo, targetMemberNo);
        if (existingRoomNo != null) {
            return existingRoomNo;
        }

        // 새 채팅방 생성
        int roomNo = dmDao.insertRoom(sqlSession, "P");  // P: Private (1:1)

        // 참여자 추가
        dmDao.insertParticipant(sqlSession, roomNo, memberNo);
        dmDao.insertParticipant(sqlSession, roomNo, targetMemberNo);

        return roomNo;
    }

    @Override
    @Transactional
    public int leaveRoom(int roomNo, int memberNo) {
        return dmDao.leaveRoom(sqlSession, roomNo, memberNo);
    }

    @Override
    @Transactional
    public int deleteDmRoom(int roomNo) {
        return dmDao.deleteDmRoom(sqlSession, roomNo);
    }

    @Override
    public List<Integer> getParticipantsByRoomNo(int roomNo) {
        return dmDao.getParticipantsByRoomNo(sqlSession, roomNo);
    }

    @Override
    public List<String> getParticipantIdsByRoomNo(int roomNo) {
        return dmDao.getParticipantIdsByRoomNo(sqlSession, roomNo);
    }

    // ===========================
    // 메시지 관련
    // ===========================

    @Override
    @Transactional
    public int insertMessage(int roomNo, int senderNo, String content, String messageType) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("senderNo", senderNo);
        map.put("content", content);
        map.put("messageType", messageType != null ? messageType : "TEXT");
        return dmDao.insertMessage(sqlSession, map);
    }

    @Override
    public ArrayList<DmMessage> selectMessage(int roomNo, int senderNo) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("senderNo", senderNo);
        return dmDao.selectMessage(sqlSession, map);
    }

    @Override
    @Transactional
    public int deleteMessage(int messageNo) {
        return dmDao.deleteMessage(sqlSession, messageNo);
    }

    @Override
    public Integer getRoomNoByMessageId(int messageNo) {
        return dmDao.getRoomNoByMessageId(sqlSession, messageNo);
    }

    // ===========================
    // 읽음 처리 관련
    // ===========================

    @Override
    @Transactional
    public int updateReadStatus(int roomNo, int memberNo) {
        return dmDao.updateReadStatus(sqlSession, roomNo, memberNo);
    }

    @Override
    public int getUnreadMessageCount(int roomNo, int memberNo) {
        return dmDao.getUnreadMessageCount(sqlSession, roomNo, memberNo);
    }

    @Override
    @Transactional
    public int updateMuteStatus(int roomNo, int memberNo, String isMuted) {
        return dmDao.updateMuteStatus(sqlSession, roomNo, memberNo, isMuted);
    }

    // ===========================
    // 레거시 호환 메서드 (Deprecated)
    // ===========================

    @Override
    @Deprecated
    @Transactional
    public int insertMessage(Map<String, Object> map) {
        return dmDao.insertMessage(sqlSession, map);
    }

    @Override
    @Deprecated
    public ArrayList<DmMessage> selectMessage(Map<String, Object> map) {
        return dmDao.selectMessage(sqlSession, map);
    }

    @Override
    @Deprecated
    @Transactional
    public int updateReadStatus(Map<String, Object> map) {
        int roomNo = ((Number) map.get("roomNo")).intValue();
        int memberNo = ((Number) map.get("memberNo")).intValue();
        return dmDao.updateReadStatus(sqlSession, roomNo, memberNo);
    }

    @Override
    @Deprecated
    public int getUnreadMessageCount(Map<String, Object> map) {
        int roomNo = ((Number) map.get("roomNo")).intValue();
        int memberNo = ((Number) map.get("memberNo")).intValue();
        return dmDao.getUnreadMessageCount(sqlSession, roomNo, memberNo);
    }
}
