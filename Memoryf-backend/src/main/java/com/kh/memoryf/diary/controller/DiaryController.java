package com.kh.memoryf.diary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.diary.model.service.DiaryService;
import com.kh.memoryf.diary.model.vo.Diary;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/diaries")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    /**
     * 다이어리 생성
     */
    @PostMapping
    public ApiResponse<Void> createDiary(
        @RequestBody Diary diary,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");
        if (memberNo == null) {
            return ApiResponse.error("인증이 필요합니다.");
        }

        diary.setMemberNo(memberNo);
        diaryService.createDiary(diary);
        return ApiResponse.success("다이어리가 등록되었습니다.", null);
    }

    /**
     * 다이어리 목록 조회
     */
    @GetMapping
    public ApiResponse<List<Diary>> getDiaryList(
        @RequestParam int page,
        @RequestParam int size,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");
        if (memberNo == null) {
            return ApiResponse.error("인증이 필요합니다.");
        }

        List<Diary> list = diaryService.getDiaryList(memberNo, page, size);
        return ApiResponse.success(list);
    }
    
    /**
     * 다이어리 삭제
     */
    @DeleteMapping("/{diaryNo}")
    public ApiResponse<Void> deleteDiary(
        @PathVariable int diaryNo,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");
        if (memberNo == null) {
            return ApiResponse.error("인증이 필요합니다.");
        }

        diaryService.deleteDiary(diaryNo);
        return ApiResponse.success("다이어리가 삭제되었습니다.", null);
    }
    
    /**
     * 다이어리 수정
     */
    @PutMapping("/{diaryNo}")
    public ApiResponse<Void> updateDiary(
        @PathVariable int diaryNo,
        @RequestBody Diary diary,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");
        if (memberNo == null) {
            return ApiResponse.error("인증이 필요합니다.");
        }

        diary.setDiaryNo(diaryNo);
        diary.setMemberNo(memberNo);
        diaryService.updateDiary(diary);
        return ApiResponse.success("다이어리가 수정되었습니다.", null);
    }
}
