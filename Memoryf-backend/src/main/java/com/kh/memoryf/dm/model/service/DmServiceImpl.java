package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.dm.model.dao.DmDao;
import com.kh.memoryf.dm.model.dao.DmRoomRequest;
import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

@Service
public class DmServiceImpl implements DmService {

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Autowired
    private DmDao dmDao;

    // dm 방 목록 조회
    @Override
    public ArrayList<DmRoom> selectDmRoomList(String userId) {

        return dmDao.selectDmRoomList(sqlSession, userId);

    }

    @Override
    @Transactional
    public int insertRoom(String targetUserId, String userId) {

        return dmDao.insertRoom(sqlSession, targetUserId, userId);

    }

    // 채팅방 발신자 저장
    @Override
    @Transactional
    public int insertParticipantSender(int roomNo, String targetUserId, String userId) {

        return dmDao.insertParticipantSender(sqlSession, roomNo, targetUserId, userId);
    }

    // 채팅방 수신자 저장
    @Override
    @Transactional
    public int insertParticipantReciever(int roomNo, String targetUserId, String userId) {
    
        return dmDao.insertParticipantReciever(sqlSession, roomNo, targetUserId, userId);
        
    }

    @Override
    @Transactional
    public int insertMessage(Map<String, Object> map) {

        return dmDao.insertMessage(sqlSession, map);
    }

    @Override
    public ArrayList<DmMessage> selectMessage(Map<String, Object> map) {

        return dmDao.selectMessage(sqlSession, map);

    }

    @Override
    @Transactional
    public int updateReadStatus(Map<String, Object> map) {
        return dmDao.updateReadStatus(sqlSession, map);
    }

    @Override
    public int getUnreadMessageCount(Map<String, Object> map) {
        return dmDao.getUnreadMessageCount(sqlSession, map);
    }

    @Override
    public int checkParticipantExists(Map<String, Object> map) {
        return dmDao.checkParticipantExists(sqlSession, map);
    }

    // DM 방 생성 및 참여자 추가 (중복 방지)
    @Override
    @Transactional
    public int createDmRoom(DmRoomRequest request) {
        String userId = request.getUserId();
        String targetUserId = request.getTargetUserId();

        // 기존 방 존재 확인 (같은 사용자 쌍의 방이 있는지 체크)
        ArrayList<DmRoom> existingRooms = dmDao.selectDmRoomList(sqlSession, userId);
        for (DmRoom room : existingRooms) {
            if (room.getTargetUserId().equals(targetUserId)) {
                return room.getRoomNo();  // 기존 방 반환
            }
        }

        // 새 방 생성
        int roomNo = dmDao.insertRoom(sqlSession, targetUserId, userId);

        // 발신자 참여자 체크 및 삽입
        Map<String, Object> senderParams = new HashMap<>();
        senderParams.put("roomNo", roomNo);
        senderParams.put("memberId", userId);
        if (dmDao.checkParticipantExists(sqlSession, senderParams) == 0) {
            dmDao.insertParticipantSender(sqlSession, roomNo, targetUserId, userId);
        }

        // 수신자 참여자 체크 및 삽입
        Map<String, Object> receiverParams = new HashMap<>();
        receiverParams.put("roomNo", roomNo);
        receiverParams.put("memberId", targetUserId);
        if (dmDao.checkParticipantExists(sqlSession, receiverParams) == 0) {
            dmDao.insertParticipantReciever(sqlSession, roomNo, targetUserId, userId);
        }

        return roomNo;
    }

}
