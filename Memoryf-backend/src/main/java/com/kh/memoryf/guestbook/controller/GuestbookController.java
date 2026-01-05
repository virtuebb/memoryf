package com.kh.memoryf.guestbook.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
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

    /**
     * 방명록 조회
     */
    @GetMapping("/{homeNo}")
    public ApiResponse<List<Guestbook>> getGuestbookList(
            @PathVariable int homeNo,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int offset,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "3") int limit
    ) {
        List<Guestbook> list = guestbookService.getGuestbookList(homeNo, offset, limit);
        return ApiResponse.success(list);
    }

    /**
     * 방명록 등록
     */
    @PostMapping
    public ApiResponse<Void> insertGuestbook(
            @RequestBody Guestbook guestbook,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        int memberNo = (Integer) request.getAttribute("memberNo");
        guestbook.setMemberNo(memberNo);
        guestbookService.insertGuestbook(guestbook);
        return ApiResponse.success("방명록이 등록되었습니다.", null);
    }
}
