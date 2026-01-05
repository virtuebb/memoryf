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

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.notification.model.service.NotificationService;
import com.kh.memoryf.notification.model.vo.Notification;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    /**
     * 알림 목록 조회
     */
    @GetMapping("/{memberNo}")
    public ApiResponse<ArrayList<Notification>> getNotifications(@PathVariable("memberNo") int memberNo) {
        ArrayList<Notification> list = notificationService.getNotificationList(memberNo);
        return ApiResponse.success(list);
    }
    
    /**
     * 앍일 알림 개수 조회
     */
    @GetMapping("/{memberNo}/count")
    public ApiResponse<HashMap<String, Object>> getUnreadCount(@PathVariable("memberNo") int memberNo) {
        int count = notificationService.getUnreadCount(memberNo);
        HashMap<String, Object> data = new HashMap<>();
        data.put("count", count);
        return ApiResponse.success(data);
    }
    
    /**
     * 알림 읽음 처리
     */
    @PutMapping("/{notificationNo}/read")
    public ApiResponse<Void> markAsRead(@PathVariable("notificationNo") int notificationNo) {
        int result = notificationService.markAsRead(notificationNo);
        if (result > 0) {
            return ApiResponse.success("알림을 읽음 처리했습니다.", null);
        } else {
            return ApiResponse.error("알림 읽음 처리 실패");
        }
    }
    
    /**
     * 알림 삭제
     */
    @DeleteMapping("/{notificationNo}")
    public ApiResponse<Void> deleteNotification(@PathVariable("notificationNo") int notificationNo) {
        int result = notificationService.deleteNotification(notificationNo);
        if (result > 0) {
            return ApiResponse.success("알림이 삭제되었습니다.", null);
        } else {
            return ApiResponse.error("알림 삭제 실패");
        }
    }
}
