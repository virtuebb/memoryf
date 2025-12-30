package com.kh.memoryf.diary.model.service;

import java.util.List;

import com.kh.memoryf.diary.model.vo.Diary;

public interface DiaryService {

    // 일기 작성
    void createDiary(Diary diary);

    // 일기 목록 조회 (페이징)
    List<Diary> getDiaryList(int memberNo, int page, int size);

    // 일기 삭제 (soft delete)
    void deleteDiary(int diaryNo);

    // 일기 수정
	void updateDiary(Diary diary);
}
