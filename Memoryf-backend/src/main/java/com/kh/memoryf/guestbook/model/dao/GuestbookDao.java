package com.kh.memoryf.guestbook.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.guestbook.model.vo.Guestbook;

@Repository
public class GuestbookDao {

    public List<Guestbook> selectGuestbookList(
            SqlSessionTemplate sqlSession,
            int homeNo,
            int offset,
            int limit
    ) {
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("homeNo", homeNo);
        params.put("offset", offset);
        params.put("limit", limit);
        
        return sqlSession.selectList(
            "guestbookMapper.selectGuestbookList",
            params
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
