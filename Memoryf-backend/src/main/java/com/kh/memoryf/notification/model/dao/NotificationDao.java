package com.kh.memoryf.notification.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.notification.model.vo.Notification;

@Repository
public class NotificationDao {

    public int insertNotification(SqlSessionTemplate sqlSession, Notification notification) {
        return sqlSession.insert("notificationMapper.insertNotification", notification);
    }

    public ArrayList<Notification> selectNotificationList(SqlSessionTemplate sqlSession, int memberNo) {
        return new ArrayList<>(sqlSession.selectList("notificationMapper.selectNotificationList", memberNo));
    }

    public int updateReadStatus(SqlSessionTemplate sqlSession, int notificationNo) {
        return sqlSession.update("notificationMapper.updateReadStatus", notificationNo);
    }
    
    public int deleteNotification(SqlSessionTemplate sqlSession, int notificationNo) {
        return sqlSession.delete("notificationMapper.deleteNotification", notificationNo);
    }

    public int deleteFollowRequestNotifications(SqlSessionTemplate sqlSession, int receiverNo, int senderNo) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("receiverNo", receiverNo);
        param.put("senderNo", senderNo);
        return sqlSession.delete("notificationMapper.deleteFollowRequestNotifications", param);
    }
    
    public int getUnreadCount(SqlSessionTemplate sqlSession, int memberNo) {
        return sqlSession.selectOne("notificationMapper.getUnreadCount", memberNo);
    }
}
