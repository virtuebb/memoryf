package com.kh.memoryf.guestbook.model.service;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.guestbook.model.dao.GuestbookDao;
import com.kh.memoryf.guestbook.model.vo.Guestbook;

@Service
public class GuestbookServiceImpl implements GuestbookService {

    private final GuestbookDao guestbookDao;
    private final SqlSessionTemplate sqlSession;

    public GuestbookServiceImpl(
            GuestbookDao guestbookDao,
            SqlSessionTemplate sqlSession
    ) {
        this.guestbookDao = guestbookDao;
        this.sqlSession = sqlSession;
    }

    @Override
    public List<Guestbook> getGuestbookList(int homeNo, int offset, int limit) {
        return guestbookDao.selectGuestbookList(sqlSession, homeNo, offset, limit);
    }

    @Override
    @Transactional
    public int insertGuestbook(Guestbook guestbook) {
        return guestbookDao.insertGuestbook(sqlSession, guestbook);
    }
}
