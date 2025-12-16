package com.kh.memoryf.dm.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// 이 클래스는 채팅 메시지를 담는 상자야.
// 누가 보냈고, 무슨 내용인지 저장해.
@Alias("dm")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Dm {
    private String type;    // 메시지 타입: "message" (일반 메시지) / "read" (읽음 이벤트)
    private String roomId;  // 받는 사람의 ID (1:1 채팅에서)
    private String sender;  // 보낸 사람의 이름
    private String content; // 메시지 내용

}
