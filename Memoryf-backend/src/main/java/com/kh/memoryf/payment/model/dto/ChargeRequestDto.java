package com.kh.memoryf.payment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class ChargeRequestDto {
	private String impUid; // 포트원 거래 고유번호
	private String merchantUid; // 가맹점 주문번호
	private int amount; // 결제 금액
}
