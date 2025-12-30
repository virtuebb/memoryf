package com.kh.memoryf.visitor.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kh.memoryf.visitor.model.service.VisitorService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/visitor")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    // 🔹 방문 기록 (JWT 기반)
    @PostMapping
    public ResponseEntity<?> recordVisit(
            @RequestParam int homeNo,
            HttpServletRequest request) {

        Integer memberNo = (Integer) request.getAttribute("memberNo");
        if (memberNo == null) {
            return ResponseEntity.status(401).build();
        }

        visitorService.recordVisit(memberNo, homeNo);
        return ResponseEntity.ok().build();
    }

    // 🔹 방문자 수 조회
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getVisitorStats(
            @RequestParam int homeNo) {
    	
        return ResponseEntity.ok(
            visitorService.getVisitorStats(homeNo));
    }
}
