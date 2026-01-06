package com.kh.memoryf.notification.model.vo;

import java.sql.Timestamp;
import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("notification")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Notification {
    private int notificationNo;
    private int receiverNo;
    private int senderNo;
    private String type; // 'FOLLOW_REQUEST', 'FOLLOW_ACCEPT', 'LIKE_FEED', 'COMMENT_FEED', 'COMMENT_REPLY', 'LIKE_COMMENT'
    private Integer targetId; // FEED_NO, etc.
    private Integer targetSubId; // COMMENT_NO (대댓글, 댓글좋아요 등 보조 ID)
    private String isRead;
    private Timestamp createDate;
    
    // Join fields
    private String senderNick;
    private String senderProfile; // profileChangeName
    private String senderStatus; // 회원 상태 (N: 정상, Y: 탈퇴)
    private String feedImage; // For LIKE/COMMENT notifications (thumbnail)
}
