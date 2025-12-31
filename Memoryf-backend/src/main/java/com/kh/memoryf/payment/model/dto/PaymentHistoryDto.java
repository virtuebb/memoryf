package com.kh.memoryf.payment.model.dto;

import java.util.Date;

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
public class PaymentHistoryDto {
	private String type; // 'CHARGE' or 'USE'
	private int amount;
	private Date date;
	private String description;
	private String status; // 'COMPLETED', etc.
}
