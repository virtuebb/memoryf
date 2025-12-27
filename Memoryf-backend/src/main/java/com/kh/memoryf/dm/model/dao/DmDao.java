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

        Map<String, Object> map = new HashMap<String,Object>();

        map.put("targetUserId", targetUserId);
        map.put("userId", userId);

        int rows = sqlSession.insert("dmMapper.insertRoom", map);

        // selectKey로 채번된 값이 parameter map의 "roomNo"에 설정되어 돌아옵니다.
        Object rn = map.get("roomNo");
        if (rn instanceof Number) {
            return ((Number) rn).intValue();
        } else if (rn != null) {
            try {
                return Integer.parseInt(rn.toString());
            } catch (NumberFormatException e) {
                // fallback
            }
        }

        return rows;

    }

    public int insertMessage(SqlSessionTemplate sqlSession, Map<String,Object> map) {
    
        return sqlSession.insert("dmMapper.insertMessage", map);

    }

    public ArrayList<DmMessage> selectMessage(SqlSessionTemplate sqlSession, Map<String,Object> map) {
    
        return (ArrayList)sqlSession.selectList("dmMapper.selectMessage", map);
    
    }

    // 채팅방 발신자 정보 삽입용 
    public int insertParticipantSender(SqlSessionTemplate sqlSession, int roomNo, String targetUserId, String userId) {
        
        Map<String, Object> map = new HashMap<String, Object>();

        map.put("roomNo", roomNo);
        map.put("targetUserId", targetUserId);
        map.put("userId", userId);

        return sqlSession.insert("dmMapper.insertParticipantSender", map);

    }

    // 채팅방 수신자 정보 삽입용 
    public int insertParticipantReciever(SqlSessionTemplate sqlSession, int roomNo, String targetUserId, String userId) {

        Map<String, Object> map = new HashMap<String, Object>();

        map.put("roomNo", roomNo);
        map.put("targetUserId", targetUserId);
        map.put("userId", userId);

        return sqlSession.insert("dmMapper.insertParticipantReciever", map);

    }
    
    // 읽음 처리 - 마지막으로 읽은 메시지 번호 업데이트
    public int updateReadStatus(SqlSessionTemplate sqlSession, Map<String, Object> map) {
        return sqlSession.update("dmMapper.updateReadStatus", map);
    }
    
    // 미읽은 메시지 개수 조회
    public int getUnreadMessageCount(SqlSessionTemplate sqlSession, Map<String, Object> map) {
        Integer result = sqlSession.selectOne("dmMapper.getUnreadMessageCount", map);
        return result != null ? result : 0;
    }

    

}

