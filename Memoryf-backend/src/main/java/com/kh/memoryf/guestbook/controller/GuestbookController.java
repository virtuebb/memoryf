package com.kh.memoryf.guestbook.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.guestbook.model.service.GuestbookService;
import com.kh.memoryf.guestbook.model.vo.Guestbook;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/guestbook")
public class GuestbookController {

    private final GuestbookService guestbookService;

    public GuestbookController(GuestbookService guestbookService) {
        this.guestbookService = guestbookService;
    }

    // 방명록 조회
    @GetMapping("/{homeNo}")
    public ResponseEntity<List<Guestbook>> getGuestbookList(
            @PathVariable int homeNo,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int offset,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "3") int limit
    ) {
        return ResponseEntity.ok(
            guestbookService.getGuestbookList(homeNo, offset, limit)
        );
    }

    // 방명록 등록
    @PostMapping
    public ResponseEntity<?> insertGuestbook(
            @RequestBody Guestbook guestbook,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        int memberNo = (Integer) request.getAttribute("memberNo");

        guestbook.setMemberNo(memberNo);

        guestbookService.insertGuestbook(guestbook);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
