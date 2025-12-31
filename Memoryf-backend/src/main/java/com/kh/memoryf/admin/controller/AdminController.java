package com.kh.memoryf.admin.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.admin.model.service.AdminService;
import com.kh.memoryf.member.model.vo.Member;

@RestController
@RequestMapping("admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    // 사용자 전체 조회
    @GetMapping("selectUsers")
    public ArrayList<Member> selectUsers() {
        
        ArrayList<Member> list = adminService.selectUsers();

        // System.out.println(list);

        return list;
    }

    // 사용자 탈퇴
    @PostMapping("deleteUser/{userId}")
    public String deleteUser(@PathVariable String userId) {
    
        int result = adminService.deleteUser(userId);
    
        return (result > 0) ? "회원 탈퇴 성공" : "회원 탈퇴 실패";

    }

    // 회원 전체 수 조회
    @GetMapping("selectUserCount")
    public int selectUserCount() {

        System.out.println("----------------------");

        int result =  adminService.selectUserCount();

        System.out.println(result);

        return result;
    }


}
