package com.kh.memoryf.follow.model.service;

import java.util.ArrayList;
import java.util.HashMap;

public interface FollowService {
	boolean follow(int memberNo, int targetMemberNo);
	boolean unfollow(int memberNo, int targetMemberNo);

	ArrayList<HashMap<String, Object>> getFollowers(int memberNo, Integer currentMemberNo, String keyword, int page, int size);
	ArrayList<HashMap<String, Object>> getFollowing(int memberNo, Integer currentMemberNo, String keyword, int page, int size);

}
