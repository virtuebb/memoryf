package com.kh.memoryf.admin.model.service;

import java.util.ArrayList;

import com.kh.memoryf.member.model.vo.Member;

public interface AdminService {

    // 회원 전체 조회
    ArrayList<Member> selectUsers();

    // 회원 탈퇴
    int deleteUser(String userId);

}
