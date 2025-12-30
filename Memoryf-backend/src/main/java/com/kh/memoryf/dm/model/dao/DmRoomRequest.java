package com.kh.memoryf.dm.model.dao;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmRoomRequest {

    // 채팅 조회
    private String targetUserId;
    private String userId;

    // 메세지 저장
    private int roomId;
    private int roomNo;
    private String senderId;
    private String content;

}
