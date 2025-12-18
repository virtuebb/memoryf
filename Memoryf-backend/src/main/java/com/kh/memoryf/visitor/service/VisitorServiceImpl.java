package com.kh.memoryf.visitor.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.visitor.dao.VisitorDao;

@Service
public class VisitorServiceImpl implements VisitorService {

    private final VisitorDao visitorDao;

    public VisitorServiceImpl(VisitorDao visitorDao) {
        this.visitorDao = visitorDao;
    }

    @Override
    @Transactional
    public void recordVisit(int memberNo, int homeNo) {
        visitorDao.insertTodayVisitor(memberNo, homeNo);
    }

    @Override
    public Map<String, Integer> getVisitorStats(int homeNo) {

        int today = visitorDao.selectTodayCount(homeNo);
        int total = visitorDao.selectTotalCount(homeNo);

        Map<String, Integer> result = new HashMap<>();
        result.put("today", today);
        result.put("total", total);

        return result;
    }
}
