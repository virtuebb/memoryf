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

    // 메세지 저장
    int insertMessage(Map<String, Object> map);

    // 메세지 조회
    ArrayList<DmMessage> selectMessage(Map<String, Object> map);
}
