package com.kh.memoryf.payment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class PortOneVerificationDto {
	private int amount;
	private String impUid;
	private String merchantUid;
	private String status;
	private String payMethod;
}
