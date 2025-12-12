package com.kh.retrogram.home.model.service;

import com.kh.retrogram.home.model.vo.Home;

public interface HomeService {
	
	// 홈피 조회 (한명)
	Home homeSelect(int memberId);
}
