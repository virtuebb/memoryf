package com.kh.memoryf.visitor.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.visitor.model.service.VisitorService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/visitor")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    /**
     * 방문 기록 (테스트용)
     * POST /memoryf/visitor?memberNo=1&homeNo=2
     */
    @PostMapping
    public void recordVisit(
            @RequestParam int memberNo,
            @RequestParam int homeNo) {

        visitorService.recordVisit(memberNo, homeNo);
    }

    /**
     * 방문자 수 조회 (테스트용)
     * GET /memoryf/visitor/count?homeNo=2
     */
    @GetMapping("/count")
    public Map<String, Integer> getVisitorStats(
            @RequestParam int homeNo) {

        return visitorService.getVisitorStats(homeNo);
    }
}
