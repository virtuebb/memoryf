package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;
import java.util.Map;

import com.kh.memoryf.dm.model.dao.DmRoomRequest;
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

    // 참여자 존재 여부 확인
    int checkParticipantExists(Map<String, Object> map);

    // DM 방 생성 및 참여자 추가 (중복 방지)
    int createDmRoom(DmRoomRequest request);

    // 메세지 삭제
    int deleteMessage(int messageId);

    // 메시지 ID로 ROOM_NO 조회
    Integer getRoomNoByMessageId(int messageId);

    // 채팅방 참가자 목록 조회
    ArrayList<String> getParticipantsByRoomNo(int roomNo);

    // 채팅방 삭제
    int deleteDmRoom(int roomNo);

}
