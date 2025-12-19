package com.kh.memoryf.visitor.model.service;

import java.util.Map;

public interface VisitorService {

    // 방문 기록
    void recordVisit(int memberNo, int homeNo);

    // TODAY / TOTAL 조회
    Map<String, Integer> getVisitorStats(int homeNo);
}
