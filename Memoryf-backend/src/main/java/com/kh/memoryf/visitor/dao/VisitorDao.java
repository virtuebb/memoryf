package com.kh.memoryf.visitor.dao;

import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class VisitorDao {

    private final SqlSessionTemplate sqlSession;

    public VisitorDao(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }

    public int insertTodayVisitor(int memberNo, int homeNo) {
        return sqlSession.insert(
            "visitor.insertTodayVisitor",
            Map.of("memberNo", memberNo, "homeNo", homeNo)
        );
    }

    public int selectTodayCount(int homeNo) {
        return sqlSession.selectOne(
            "visitor.selectTodayCount",
            homeNo
        );
    }

    public int selectTotalCount(int homeNo) {
        return sqlSession.selectOne(
            "com.kh.memoryf.visitor.dao.VisitorDao.selectTotalCount",
            homeNo
        );
    }
}
