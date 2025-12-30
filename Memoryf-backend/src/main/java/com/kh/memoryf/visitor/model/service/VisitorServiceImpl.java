package com.kh.memoryf.visitor.model.service;

import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;

import com.kh.memoryf.visitor.model.dao.VisitorDao;
import com.kh.memoryf.visitor.model.vo.Visitor;

@Service
public class VisitorServiceImpl implements VisitorService {

    private final VisitorDao visitorDao;
    private final SqlSessionTemplate sqlSession;

    public VisitorServiceImpl(
            VisitorDao visitorDao,
            SqlSessionTemplate sqlSession) {
        this.visitorDao = visitorDao;
        this.sqlSession = sqlSession;
    }

    @Override
    public void recordVisit(int memberNo, int homeNo) {

        // 🔒 오늘 이미 방문했는지 체크
        boolean visitedToday =
            visitorDao.existsToday(sqlSession, memberNo, homeNo);

        if (visitedToday) return;

        Visitor visitor = new Visitor();
        visitor.setMemberNo(memberNo);
        visitor.setHomeNo(homeNo);

        visitorDao.insertVisit(sqlSession, visitor);
    }

    @Override
    public Map<String, Integer> getVisitorStats(int homeNo) {

        int today = visitorDao.selectTodayCount(sqlSession, homeNo);
        int total = visitorDao.selectTotalCount(sqlSession, homeNo);

        Map<String, Integer> result = new HashMap<>();
        result.put("today", today);
        result.put("total", total);

        return result;
    }
}
