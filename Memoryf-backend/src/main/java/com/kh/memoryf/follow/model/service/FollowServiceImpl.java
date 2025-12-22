package com.kh.memoryf.follow.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.memoryf.follow.model.dao.FollowDao;
import com.kh.memoryf.home.model.dao.HomeDao;
import com.kh.memoryf.home.model.vo.Home;
import com.kh.memoryf.notification.model.service.NotificationService;
import com.kh.memoryf.notification.model.vo.Notification;

@Service
public class FollowServiceImpl implements FollowService {

	@Autowired
	private SqlSessionTemplate sqlSession;

	@Autowired
	private FollowDao followDao;

	@Autowired
	private HomeDao homeDao;
	
	@Autowired
	private NotificationService notificationService;

	@Override
	public boolean follow(int memberNo, int targetMemberNo) {
		if (memberNo <= 0 || targetMemberNo <= 0) {
			throw new IllegalArgumentException("memberNo/targetMemberNo가 올바르지 않습니다.");
		}
		if (memberNo == targetMemberNo) {
			throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
		}

		Home targetHome = homeDao.selectHomeByMemberNo(sqlSession, targetMemberNo, null);
		if (targetHome == null) {
			throw new IllegalArgumentException("대상 홈을 찾을 수 없습니다.");
		}

		int homeNo = targetHome.getHomeNo();
		
		// 이미 팔로우 상태인지 확인 (STATUS 상관없이 존재 여부 확인)
		String status = followDao.checkFollowStatus(sqlSession, memberNo, homeNo);
		
		if (status != null) {
			// 이미 존재하면 삭제 (언팔로우 또는 요청 취소)
			// 요청 취소인 경우 수신자 알림 탭에 남아있는 FOLLOW_REQUEST 알림을 정리
			notificationService.deleteFollowRequestNotifications(targetMemberNo, memberNo);
			followDao.deleteFollow(sqlSession, memberNo, homeNo);
			return false;
		} else {
			// 존재하지 않으면 추가
			String newStatus = "Y";
			String notiType = "FOLLOW";
			
			if ("Y".equals(targetHome.getIsPrivateProfile())) {
				newStatus = "P"; // 비공개 계정이면 대기 상태
				notiType = "FOLLOW_REQUEST";
			}
			
			followDao.insertFollow(sqlSession, memberNo, homeNo, newStatus);
			
			// 알림 생성
			Notification noti = new Notification();
			noti.setReceiverNo(targetMemberNo);
			noti.setSenderNo(memberNo);
			noti.setType(notiType);
			// 비공개 계정 팔로우 요청 알림은 중복 방지(같은 사람의 반복 요청/취소 반복 시)
			if ("FOLLOW_REQUEST".equals(notiType)) {
				notificationService.deleteFollowRequestNotifications(targetMemberNo, memberNo);
			}
			notificationService.createNotification(noti);
			
			return "Y".equals(newStatus); // 승인된 상태면 true, 대기 상태면 false
		}
	}

	@Override
	public String checkFollowStatus(int memberNo, int targetMemberNo) {
		Home targetHome = homeDao.selectHomeByMemberNo(sqlSession, targetMemberNo, null);
		if (targetHome == null) return null;
		return followDao.checkFollowStatus(sqlSession, memberNo, targetHome.getHomeNo());
	}

	@Override
	public boolean unfollow(int memberNo, int targetMemberNo) {
		if (memberNo <= 0 || targetMemberNo <= 0) {
			throw new IllegalArgumentException("memberNo/targetMemberNo가 올바르지 않습니다.");
		}
		if (memberNo == targetMemberNo) {
			return false;
		}

		Home targetHome = homeDao.selectHomeByMemberNo(sqlSession, targetMemberNo, null);
		if (targetHome == null) {
			throw new IllegalArgumentException("대상 홈을 찾을 수 없습니다.");
		}

		int homeNo = targetHome.getHomeNo();
		// 요청 취소(STATUS='P') 포함: 수신자 알림 탭에 남아있는 FOLLOW_REQUEST 알림 정리
		notificationService.deleteFollowRequestNotifications(targetMemberNo, memberNo);
		followDao.deleteFollow(sqlSession, memberNo, homeNo);
		return false;
	}

	@Override
	public ArrayList<HashMap<String, Object>> getFollowers(int memberNo, Integer currentMemberNo, String keyword, int page, int size) {
		if (memberNo <= 0) {
			throw new IllegalArgumentException("memberNo가 올바르지 않습니다.");
		}
		if (page < 0) page = 0;
		if (size < 1) size = 1;
		if (size > 50) size = 50;

		return followDao.selectFollowers(sqlSession, memberNo, currentMemberNo, keyword, page, size);
	}

	@Override
	public ArrayList<HashMap<String, Object>> getFollowing(int memberNo, Integer currentMemberNo, String keyword, int page, int size) {
		if (memberNo <= 0) {
			throw new IllegalArgumentException("memberNo가 올바르지 않습니다.");
		}
		if (page < 0) page = 0;
		if (size < 1) size = 1;
		if (size > 50) size = 50;

		return followDao.selectFollowing(sqlSession, memberNo, currentMemberNo, keyword, page, size);
	}

	@Override
	public boolean acceptFollowRequest(int memberNo, int requesterNo) {
		// memberNo: 나 (요청 받은 사람)
		// requesterNo: 요청한 사람
		
		// 내 홈 정보 조회
		Home myHome = homeDao.selectHomeByMemberNo(sqlSession, memberNo, null);
		if (myHome == null) return false;
		
		// 현재 상태 확인
		String currentStatus = followDao.checkFollowStatus(sqlSession, requesterNo, myHome.getHomeNo());
		
		// 수락/거절 어떤 경우든, 남아있는 요청 알림(중복 포함)은 정리
		notificationService.deleteFollowRequestNotifications(memberNo, requesterNo);

		// 요청이 없거나(취소됨) 이미 수락된 경우 성공으로 처리
		if (currentStatus == null || "Y".equals(currentStatus)) {
			return true;
		}
		
		// 팔로우 상태 업데이트 (P -> Y)
		int result = followDao.updateFollowStatus(sqlSession, requesterNo, myHome.getHomeNo(), "Y");
		
		if (result > 0) {
			// 알림 생성 (요청한 사람에게 수락 알림)
			Notification noti = new Notification();
			noti.setReceiverNo(requesterNo);
			noti.setSenderNo(memberNo);
			noti.setType("FOLLOW_ACCEPT");
			notificationService.createNotification(noti);
			return true;
		}
		return false;
	}

	@Override
	public boolean rejectFollowRequest(int memberNo, int requesterNo) {
		// memberNo: 나 (요청 받은 사람)
		// requesterNo: 요청한 사람
		
		// 내 홈 정보 조회
		Home myHome = homeDao.selectHomeByMemberNo(sqlSession, memberNo, null);
		if (myHome == null) return false;
		
		// 남아있는 요청 알림(중복 포함) 정리
		notificationService.deleteFollowRequestNotifications(memberNo, requesterNo);
		
		// 팔로우 삭제 (삭제된 행이 없어도 성공으로 처리 - 이미 취소/거절된 경우)
		followDao.deleteFollow(sqlSession, requesterNo, myHome.getHomeNo());
		return true;
	}
}
