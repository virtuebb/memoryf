package com.kh.memoryf.payment.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 포인트 지갑 VO
 * 테이블: TB_POINT_WALLET
 * 
 * V3 스키마: WALLET_NO가 PK, MEMBER_NO는 UNIQUE FK
 */
@Alias("pointWallet")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class PointWallet {
    private int walletNo;           // WALLET_NO (PK)
    private int memberNo;           // MEMBER_NO (UNIQUE, FK)
    private int balance;            // BALANCE (현재 잔액, >= 0)
    private Date updatedAt;         // UPDATED_AT (마지막 업데이트)
    
    // 레거시 호환
    @Deprecated
    public int getTotalEarned() { return 0; }
    @Deprecated
    public int getTotalSpent() { return 0; }
}
