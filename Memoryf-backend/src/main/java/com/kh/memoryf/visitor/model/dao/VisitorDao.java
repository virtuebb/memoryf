package com.kh.memoryf.visitor.model.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.visitor.model.vo.Visitor;

@Repository
public class VisitorDao {

    // 오늘 방문 여부
    public boolean existsToday(SqlSessionTemplate sqlSession, int memberNo, int homeNo) {

        Integer count = sqlSession.selectOne(
            "homeVisitorMapper.existsToday",
            new Visitor(memberNo, homeNo)
        );
        return count != null && count > 0;
    }

    // 방문 기록 저장
    public int insertVisit(
            SqlSessionTemplate sqlSession,
            Visitor visitor) {

        return sqlSession.insert(
            "homeVisitorMapper.insertVisit",
            visitor
        );
    }

    // 오늘 방문자 수
    public int selectTodayCount(SqlSessionTemplate sqlSession, int homeNo) {

        return sqlSession.selectOne(
            "homeVisitorMapper.selectTodayCount",
            homeNo
        );
    }

    // 전체 방문자 수
    public int selectTotalCount(SqlSessionTemplate sqlSession, int homeNo) {

        return sqlSession.selectOne(
            "homeVisitorMapper.selectTotalCount",
            homeNo
        );
    }
}
