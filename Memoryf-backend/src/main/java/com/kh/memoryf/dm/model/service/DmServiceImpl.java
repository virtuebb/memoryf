package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.dm.model.dao.DmDao;
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
    public int insertRoom(String targetId) {

        return dmDao.insertRoom(sqlSession, targetId);

    }

}
