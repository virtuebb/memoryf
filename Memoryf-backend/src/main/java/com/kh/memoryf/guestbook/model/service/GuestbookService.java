package com.kh.memoryf.guestbook.model.service;

import java.util.List;
import com.kh.memoryf.guestbook.model.vo.Guestbook;

public interface GuestbookService {

    List<Guestbook> getGuestbookList(int homeNo);

    int insertGuestbook(Guestbook guestbook);
}
