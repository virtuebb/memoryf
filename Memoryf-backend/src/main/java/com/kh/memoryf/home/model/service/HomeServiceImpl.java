package com.kh.memoryf.home.model.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.home.model.dao.HomeDao;
import com.kh.memoryf.home.model.vo.Home;

@Service
public class HomeServiceImpl implements HomeService {
	
	@Autowired
	private HomeDao homeDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;

	@Override
	public Home homeSelect(int memberId) {
		return null;
	}

}
