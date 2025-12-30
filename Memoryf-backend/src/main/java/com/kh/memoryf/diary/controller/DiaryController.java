package com.kh.memoryf.diary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.diary.model.service.DiaryService;
import com.kh.memoryf.diary.model.vo.Diary;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/diaries")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    @PostMapping
    public ResponseEntity<?> createDiary(
        @RequestBody Diary diary,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");

        if (memberNo == null) {
            return ResponseEntity.status(401).build();
        }

        diary.setMemberNo(memberNo);
        diaryService.createDiary(diary);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getDiaryList(
        @RequestParam int page,
        @RequestParam int size,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");

        if (memberNo == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
            diaryService.getDiaryList(memberNo, page, size)
        );
    }
    
    // 다이어리 삭제
    @DeleteMapping("/{diaryNo}")
    public ResponseEntity<?> deleteDiary(
        @PathVariable int diaryNo,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");

        if (memberNo == null) {
            return ResponseEntity.status(401).build();
        }

        diaryService.deleteDiary(diaryNo);
        return ResponseEntity.ok().build();
    }
    
    // 다이어리 수정
    @PutMapping("/{diaryNo}")
    public ResponseEntity<?> updateDiary(
        @PathVariable int diaryNo,
        @RequestBody Diary diary,
        HttpServletRequest request
    ) {
        Integer memberNo = (Integer) request.getAttribute("memberNo");

        if (memberNo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401
        }

        diary.setDiaryNo(diaryNo);
        diary.setMemberNo(memberNo);

        diaryService.updateDiary(diary);
        return ResponseEntity.ok().build();
    }

}
