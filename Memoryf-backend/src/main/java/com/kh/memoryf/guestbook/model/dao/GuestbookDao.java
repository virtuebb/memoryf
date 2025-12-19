package com.kh.memoryf.guestbook.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.guestbook.model.vo.Guestbook;

@Repository
public class GuestbookDao {

    public List<Guestbook> selectGuestbookList(
            SqlSessionTemplate sqlSession,
            int homeNo
    ) {
        return sqlSession.selectList(
            "guestbookMapper.selectGuestbookList",
            homeNo
        );
    }

    public int insertGuestbook(
            SqlSessionTemplate sqlSession,
            Guestbook guestbook
    ) {
        return sqlSession.insert(
            "guestbookMapper.insertGuestbook",
            guestbook
        );
    }
}
