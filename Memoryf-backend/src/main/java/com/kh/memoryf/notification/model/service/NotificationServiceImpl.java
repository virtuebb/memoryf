package com.kh.memoryf.notification.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.notification.model.dao.NotificationDao;
import com.kh.memoryf.notification.model.vo.Notification;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationDao notificationDao;
    
    @Autowired
    private SqlSessionTemplate sqlSession;

    @Override
    public int createNotification(Notification notification) {
        return notificationDao.insertNotification(sqlSession, notification);
    }

    @Override
    public ArrayList<Notification> getNotificationList(int memberNo) {
        return notificationDao.selectNotificationList(sqlSession, memberNo);
    }

    @Override
    public int markAsRead(int notificationNo) {
        return notificationDao.updateReadStatus(sqlSession, notificationNo);
    }

    @Override
    public int deleteNotification(int notificationNo) {
        return notificationDao.deleteNotification(sqlSession, notificationNo);
    }

    @Override
    public int deleteFollowRequestNotifications(int receiverNo, int senderNo) {
        return notificationDao.deleteFollowRequestNotifications(sqlSession, receiverNo, senderNo);
    }

    @Override
    public int getUnreadCount(int memberNo) {
        return notificationDao.getUnreadCount(sqlSession, memberNo);
    }
}
