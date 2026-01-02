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
public class BgmPurchaseRequestDto {
	private int bgmNo;
	private String title;
	private String artist;
	private String videoId;
	private String thumbnail;
}
