package com.kh.memoryf.bgm.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import com.kh.memoryf.bgm.model.dto.MelonChartDto;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MelonCrawlingService {

    private static final String MELON_CHART_URL = "https://www.melon.com/chart/index.htm";
    
    /**
     * 멜론 차트 TOP 100 크롤링
     */
    public List<MelonChartDto> getMelonTop50() {
        List<MelonChartDto> chartList = new ArrayList<>();
        
        try {
            // User-Agent 설정하여 멜론 접속
            Document doc = Jsoup.connect(MELON_CHART_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(5000)
                    .get();
            
            // 차트 목록 선택
            Elements songElements = doc.select("tr[data-song-no]");
            
            int rank = 1;
            for (Element song : songElements) {
                try {
                    // 곡 제목 추출
                    Element titleElement = song.selectFirst("div.ellipsis.rank01 a");
                    String title = titleElement != null ? titleElement.text().trim() : "";
                    
                    // 가수명 추출
                    Element artistElement = song.selectFirst("div.ellipsis.rank02 a");
                    String artist = artistElement != null ? artistElement.text().trim() : "";
                    
                    // 썸네일 추출
                    Element imgElement = song.selectFirst("a.image_typeAll img");
                    String thumbnail = imgElement != null ? imgElement.attr("src") : "";

                    if (!title.isEmpty() && !artist.isEmpty()) {
                        chartList.add(new MelonChartDto(title, artist, rank, thumbnail));
                        rank++;
                        
                        // TOP 100만 수집
                        if (rank > 100) break;
                    }
                } catch (Exception e) {
                    log.warn("곡 정보 파싱 중 오류: {}", e.getMessage());
                }
            }
            
            log.info("멜론 차트 크롤링 완료: {}곡", chartList.size());
            
        } catch (IOException e) {
            log.error("멜론 차트 크롤링 실패: {}", e.getMessage());
        }
        
        return chartList;
    }
    
    /**
     * 특정 순위의 곡 정보 조회
     */
    public MelonChartDto getMelonChartByRank(int rank) {
        List<MelonChartDto> chartList = getMelonTop50();
        
        if (rank > 0 && rank <= chartList.size()) {
            return chartList.get(rank - 1);
        }
        
        return null;
    }
}
