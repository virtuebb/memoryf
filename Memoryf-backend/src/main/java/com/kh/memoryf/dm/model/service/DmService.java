package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;

import com.kh.memoryf.dm.model.vo.DmRoom;

public interface DmService {

    ArrayList<DmRoom> selectDmRoomList(String userId);

    int insertRoom(String targetId);
}
