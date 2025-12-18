package com.kh.memoryf.dm.model.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.dm.model.vo.DmRoom;

@Repository
public class DmDao {

    // dm 방 목록 조회
    public ArrayList<DmRoom> selectDmRoomList(SqlSessionTemplate sqlSession, String userId) {

        // MyBatis 매퍼 id와 반환형에 맞게 selectList 사용
        // 매퍼에 정의된 id는 "selectDmRoomList" 입니다.
        return new ArrayList<>(sqlSession.selectList("dmMapper.selectDmRoomList", userId));

    }

    public int insertRoom(SqlSessionTemplate sqlSession, String targetId) {

        return 1;

    }

    

}
