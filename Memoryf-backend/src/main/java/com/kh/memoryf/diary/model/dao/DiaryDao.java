package com.kh.memoryf.diary.model.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.diary.model.vo.Diary;

@Repository
public class DiaryDao {

    // 일기 저장
    public int insertDiary(SqlSessionTemplate sqlSession, Diary diary) {
        return sqlSession.insert("DiaryMapper.insertDiary", diary);
    }

    // 일기 목록 조회 (페이징)
    public List<Diary> selectDiaryList(
        SqlSessionTemplate sqlSession,
        Map<String, Object> param
    ) {
        return sqlSession.selectList("DiaryMapper.selectDiaryList", param);
    }

    // 일기 삭제 (soft delete)
    public int deleteDiary(
        SqlSessionTemplate sqlSession,
        int diaryNo
    ) {
        return sqlSession.update("DiaryMapper.deleteDiary", diaryNo);
    }

    // 전체 개수 조회 (페이징용)
    public int selectDiaryCount(
        SqlSessionTemplate sqlSession,
        int memberNo
    ) {
        return sqlSession.selectOne(
            "DiaryMapper.selectDiaryCount",
            memberNo
        );
    }
}
