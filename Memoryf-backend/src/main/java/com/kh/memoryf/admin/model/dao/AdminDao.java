package com.kh.memoryf.admin.model.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.member.model.vo.Member;

@Repository
public class AdminDao {

    // 전체 회원 조회
    public ArrayList<Member> selectUsers(SqlSessionTemplate sqlSession) {
        return (ArrayList)sqlSession.selectList("adminMapper.selectUsers");
    }

    // 회원 탈퇴
    public int deleteUser(SqlSessionTemplate sqlSession, String userId) {
        return sqlSession.update("adminMapper.deleteUser", userId);
    }

}
