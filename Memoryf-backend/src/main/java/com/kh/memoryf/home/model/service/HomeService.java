package com.kh.memoryf.home.model.service;

import com.kh.memoryf.home.model.vo.Home;

public interface HomeService {
	
	// 홈피 조회 (한명)
	Home homeSelect(int memberId);
}
