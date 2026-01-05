package com.kh.memoryf.visitor.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.visitor.model.service.VisitorService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/visitors")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    /**
     * 방문 기록 (JWT 기반)
     * POST /visitors?homeNo=xxx
     */
    @PostMapping
    public ApiResponse<Void> recordVisit(
            @RequestParam int homeNo,
            HttpServletRequest request) {

        Integer memberNo = (Integer) request.getAttribute("memberNo");
        if (memberNo == null) {
            return ApiResponse.error("인증이 필요합니다.");
        }

        visitorService.recordVisit(memberNo, homeNo);
        return ApiResponse.success("방문이 기록되었습니다.", null);
    }

    /**
     * 방문자 수 조회
     * GET /visitors/stats?homeNo=xxx
     */
    @GetMapping("/stats")
    public ApiResponse<Map<String, Integer>> getVisitorStats(@RequestParam int homeNo) {
        Map<String, Integer> stats = visitorService.getVisitorStats(homeNo);
        return ApiResponse.success(stats);
    }
}
