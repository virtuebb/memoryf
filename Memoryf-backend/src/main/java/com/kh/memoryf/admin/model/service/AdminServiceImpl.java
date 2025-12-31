package com.kh.memoryf.admin.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.admin.model.dao.AdminDao;
import com.kh.memoryf.member.model.vo.Member;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Autowired 
    private AdminDao adminDao;

    // 회원 전체 조회
    @Override
    public ArrayList<Member> selectUsers() {
        return adminDao.selectUsers(sqlSession);
    }

    // 회원 탈퇴
    @Override
    @Transactional
    public int deleteUser(String userId) {
        return adminDao.deleteUser(sqlSession, userId);
    }

}
