package com.kh.memoryf.dm.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

@Repository
public class DmDao {

    // dm 방 목록 조회
    public ArrayList<DmRoom> selectDmRoomList(SqlSessionTemplate sqlSession, String userId) {

        // MyBatis 매퍼 id와 반환형에 맞게 selectList 사용
        // 매퍼에 정의된 id는 "selectDmRoomList" 입니다.
        return new ArrayList<>(sqlSession.selectList("dmMapper.selectDmRoomList", userId));

    }

    public int insertRoom(SqlSessionTemplate sqlSession, String targetUserId, String userId) {

        Map<String, String> map = new HashMap<String,String>();

        map.put("targetUserId", targetUserId);
        map.put("userId", userId);

        return sqlSession.insert("dmMapper.insertRoom", map);

    }

    public int insertMessage(SqlSessionTemplate sqlSession, Map<String,Object> map) {
    
        return sqlSession.insert("dmMapper.insertMessage", map);

    }

    public ArrayList<DmMessage> selectMessage(SqlSessionTemplate sqlSession, Map<String,Object> map) {
    
        return (ArrayList)sqlSession.selectList("dmMapper.selectMessage", map);
    
    }

    

}
