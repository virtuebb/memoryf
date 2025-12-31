package com.kh.memoryf.payment.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("pointCharge")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class PointCharge {
	private int chargeNo;
	private int memberNo;
	private int chargeAmount;
	private String impUid; // 포트원 거래 고유번호
	private String merchantUid; // 가맹점 주문번호
	private String paymentMethod;
	private Date chargeDate;
	private String status; // COMPLETED, FAILED, CANCELLED
}
