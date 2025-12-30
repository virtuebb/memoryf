package com.kh.memoryf.notification.model.service;

import java.util.ArrayList;
import com.kh.memoryf.notification.model.vo.Notification;

public interface NotificationService {
    
    int createNotification(Notification notification);
    
    ArrayList<Notification> getNotificationList(int memberNo);
    
    int markAsRead(int notificationNo);
    
    int deleteNotification(int notificationNo);

    int deleteFollowRequestNotifications(int receiverNo, int senderNo);
    
    int getUnreadCount(int memberNo);
}
