package com.kh.memoryf.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.FindService;
import com.kh.memoryf.member.model.vo.Member;

@CrossOrigin(origins="https://localhost:5173")
@RestController
@RequestMapping("/find")
public class FindController {
	
	@Autowired
	private FindService findService;
	
	// 아이디 찾기
	@PostMapping("/id")
	public Map<String, Object> findId(@RequestBody Member member) {
		
		Map<String, Object> result = new HashMap<>();
		
		String memberId = findService.findId(member);
		
		if(memberId != null) {

			result.put("result", 1);
			result.put("memberId", memberId);
			
		} else {
			
			result.put("result", 0);
			result.put("message", "일치하는 회원이 없습니다.");
		}
		
		return result;
	}
	
	// 비밀번호 찾기(존재 여부)
	@PostMapping("/pwd")
	public boolean findPwd(@RequestBody Member member) {
		
		return findService.findPwd(member);
	}
	
	// 비밀전호 재설정
	@PostMapping("/reset")
	public int resetPwd(@RequestBody Member member) {
		
		return findService.resetPwd(member.getMemberId(), member.getMemberPwd());
	}
	

}




