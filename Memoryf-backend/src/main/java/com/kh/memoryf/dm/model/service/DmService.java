package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;
import java.util.Map;

import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

public interface DmService {

    // 채빙탕 목록 조회
    ArrayList<DmRoom> selectDmRoomList(String userId);

    // 채팅방 저장
    int insertRoom(String targetUserId, String userId);

    // 채팅방 발신자 저장
    int insertParticipantSender(int roomNo, String targetUserId, String userId);
    
    // 채팅방 수신자 저장
    int insertParticipantReciever(int roomNo, String targetUserId, String userId);


    // 메세지 저장
    int insertMessage(Map<String, Object> map);

    // 메세지 조회
    ArrayList<DmMessage> selectMessage(Map<String, Object> map);
    
    // 읽음 처리 - 마지막으로 읽은 시간 업데이트
    int updateReadStatus(Map<String, Object> map);
    
    // 미읽은 메시지 개수 조회
    int getUnreadMessageCount(Map<String, Object> map);

}
