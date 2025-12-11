package com.kh.retrogram.config;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.kh.retrogram.member.model.vo.Member;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {

        HttpSession session = request.getSession(false);

        if (session == null) {
            // no session -> not logged in
            response.sendRedirect(request.getContextPath() + "/");
            return false;
        }

        Object obj = session.getAttribute("loginUser");
        if (obj == null) {
            session = request.getSession();
            session.setAttribute("alertMsg", "관리자만 접근 가능합니다. 로그인 후 시도하세요.");
            response.sendRedirect(request.getContextPath() + "/");
            return false;
        }

        if (obj instanceof Member) {
            Member m = (Member) obj;
            String memberId = m.getMemberId();
            if (memberId != null && memberId.equals("admin")) {
                // allow
                return true;
            }
        }

        // Not admin
        session.setAttribute("alertMsg", "관리자만 접근 가능합니다.");
        response.sendRedirect(request.getContextPath() + "/");
        return false;
    }
}
