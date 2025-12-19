package com.kh.memoryf.diary.controller;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kh.memoryf.diary.model.service.DiaryService;
import com.kh.memoryf.diary.model.vo.Diary;

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
}
