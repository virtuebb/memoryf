package com.kh.memoryf.bgm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.bgm.model.dto.MelonChartDto;
import com.kh.memoryf.bgm.service.MelonCrawlingService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/bgm")
@CrossOrigin(origins = {"http://localhost:5173"}, allowCredentials = "true")
@Slf4j
public class BgmController {

    @Autowired
    private MelonCrawlingService melonCrawlingService;
    
    /**
     * 멜론 차트 TOP 50 조회
     * GET /bgm/melon/chart
     */
    @GetMapping("/melon/chart")
    public ResponseEntity<Map<String, Object>> getMelonChart() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MelonChartDto> chartList = melonCrawlingService.getMelonTop50();
            
            response.put("success", true);
            response.put("data", chartList);
            response.put("message", "멜론 차트 조회 성공");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("멜론 차트 조회 실패", e);
            response.put("success", false);
            response.put("message", "멜론 차트 조회 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 멜론 차트 특정 순위 곡 조회
     * GET /bgm/melon/chart/{rank}
     */
    @GetMapping("/melon/chart/{rank}")
    public ResponseEntity<Map<String, Object>> getMelonChartByRank(@PathVariable("rank") int rank) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (rank < 1 || rank > 50) {
                response.put("success", false);
                response.put("message", "순위는 1~50 사이여야 합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            MelonChartDto chart = melonCrawlingService.getMelonChartByRank(rank);
            
            if (chart != null) {
                response.put("success", true);
                response.put("data", chart);
                response.put("message", "조회 성공");
            } else {
                response.put("success", false);
                response.put("message", "해당 순위의 곡을 찾을 수 없습니다.");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("멜론 차트 조회 실패", e);
            response.put("success", false);
            response.put("message", "조회 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
