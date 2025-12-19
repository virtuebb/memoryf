package com.kh.memoryf.diary.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.diary.model.dao.DiaryDao;
import com.kh.memoryf.diary.model.vo.Diary;

@Service
public class DiaryServiceImpl implements DiaryService {

    @Autowired
    private DiaryDao diaryDao;

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Override
    public void createDiary(Diary diary) {
        diaryDao.insertDiary(sqlSession, diary);
    }

    @Override
    public List<Diary> getDiaryList(int memberNo, int page, int size) {
        int start = (page - 1) * size + 1;
        int end = page * size;

        Map<String, Object> param = new HashMap<>();
        param.put("memberNo", memberNo);
        param.put("start", start);
        param.put("end", end);

        return diaryDao.selectDiaryList(sqlSession, param);
    }

    @Override
    public void deleteDiary(int diaryNo) {
        diaryDao.deleteDiary(sqlSession, diaryNo);
    }
}
