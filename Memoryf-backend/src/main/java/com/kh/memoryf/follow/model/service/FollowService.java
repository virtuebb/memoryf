package com.kh.memoryf.follow.model.service;

import java.util.ArrayList;
import java.util.HashMap;

public interface FollowService {
	boolean follow(int memberNo, int targetMemberNo);
	
	/**
	 * 팔로우 상태 확인
	 * @param memberNo
	 * @param targetMemberNo
	 * @return "Y"(팔로우), "P"(대기), null(미팔로우)
	 */
	String checkFollowStatus(int memberNo, int targetMemberNo);
	
	boolean unfollow(int memberNo, int targetMemberNo);

	ArrayList<HashMap<String, Object>> getFollowers(int memberNo, Integer currentMemberNo, String keyword, int page, int size);
	ArrayList<HashMap<String, Object>> getFollowing(int memberNo, Integer currentMemberNo, String keyword, int page, int size);

	// 팔로우 요청 수락
	boolean acceptFollowRequest(int memberNo, int requesterNo);
	
	// 팔로우 요청 거절
	boolean rejectFollowRequest(int memberNo, int requesterNo);
}
