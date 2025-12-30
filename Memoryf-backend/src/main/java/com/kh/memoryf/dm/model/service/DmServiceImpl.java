package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.dm.model.dao.DmDao;
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




}
