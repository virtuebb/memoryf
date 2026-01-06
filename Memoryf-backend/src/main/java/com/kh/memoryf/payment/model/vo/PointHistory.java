package com.kh.memoryf.payment.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 포인트 이력 VO
 * 테이블: TB_POINT_HISTORY
 * 
 * V3 스키마: TRANSACTION_TYPE ('CHARGE', 'USE', 'REFUND', 'BONUS', 'PENALTY')
 */
@Alias("pointHistory")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class PointHistory {
    private int historyNo;          // HISTORY_NO (PK)
    private int memberNo;           // MEMBER_NO (FK)
    private int amount;             // AMOUNT (양수:적립, 음수:차감)
    private String transactionType; // TRANSACTION_TYPE ('CHARGE', 'USE', 'REFUND', 'BONUS', 'PENALTY')
    private String referenceType;   // REFERENCE_TYPE (관련 타입)
    private Integer referenceNo;    // REFERENCE_NO (관련 번호)
    private int balanceAfter;       // BALANCE_AFTER (변동 후 잔액)
    private String description;     // DESCRIPTION (설명)
    private Date createdAt;         // CREATED_AT (생성일)
    
    // 조회용
    private String memberName;      // 회원명 (JOIN)
    private String memberNick;      // 회원 닉네임 (JOIN)
}
