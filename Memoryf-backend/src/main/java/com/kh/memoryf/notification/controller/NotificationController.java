package com.kh.memoryf.notification.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.notification.model.service.NotificationService;
import com.kh.memoryf.notification.model.vo.Notification;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/{memberNo}")
    public HashMap<String, Object> getNotifications(@PathVariable("memberNo") int memberNo) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            ArrayList<Notification> list = notificationService.getNotificationList(memberNo);
            response.put("success", true);
            response.put("data", list);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림 조회 실패: " + e.getMessage());
        }
        return response;
    }
    
    @GetMapping("/{memberNo}/count")
    public HashMap<String, Object> getUnreadCount(@PathVariable("memberNo") int memberNo) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            int count = notificationService.getUnreadCount(memberNo);
            response.put("success", true);
            response.put("count", count);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림 개수 조회 실패: " + e.getMessage());
        }
        return response;
    }
    
    @PutMapping("/{notificationNo}/read")
    public HashMap<String, Object> markAsRead(@PathVariable("notificationNo") int notificationNo) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            int result = notificationService.markAsRead(notificationNo);
            if (result > 0) {
                response.put("success", true);
            } else {
                response.put("success", false);
                response.put("message", "알림 읽음 처리 실패");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림 읽음 처리 실패: " + e.getMessage());
        }
        return response;
    }
    
    @DeleteMapping("/{notificationNo}")
    public HashMap<String, Object> deleteNotification(@PathVariable("notificationNo") int notificationNo) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            int result = notificationService.deleteNotification(notificationNo);
            if (result > 0) {
                response.put("success", true);
            } else {
                response.put("success", false);
                response.put("message", "알림 삭제 실패");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림 삭제 실패: " + e.getMessage());
        }
        return response;
    }
}
