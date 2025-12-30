package com.kh.memoryf.member.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.member.model.service.MemberService;
import com.kh.memoryf.member.model.vo.AccountHistory;

import com.kh.memoryf.member.model.vo.Member;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("member")
public class MemberController {

	@Autowired
	@SuppressWarnings("unused")
	private MemberService memberService;

	@GetMapping("info")
	public ResponseEntity<Member> getMemberInfo(@RequestParam int memberNo) {
		Member member = memberService.selectMember(memberNo);
		if (member != null) {
			member.setMemberPwd(null);
			return ResponseEntity.ok(member);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PostMapping("password")
	public ResponseEntity<String> updatePwd(@RequestBody Map<String, Object> request) {
		int memberNo = (Integer) request.get("memberNo");
		String oldPwd = (String) request.get("oldPwd");
		String newPwd = (String) request.get("newPwd");
		
		int result = memberService.updatePwd(memberNo, oldPwd, newPwd);
		
		if (result > 0) {
			return ResponseEntity.ok("비밀번호가 변경되었습니다.");
		} else if (result == -1) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 일치하지 않습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경에 실패했습니다.");
		}
	}

	@PostMapping("withdrawal")
	public ResponseEntity<String> deleteMember(@RequestBody Map<String, Object> request) {
		int memberNo = (Integer) request.get("memberNo");
		String memberPwd = (String) request.get("memberPwd");
		
		int result = memberService.deleteMember(memberNo, memberPwd);
		
		if (result > 0) {
			return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
		} else if (result == -1) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴에 실패했습니다.");
		}
	}

	@PostMapping("email")
	public ResponseEntity<String> updateEmail(@RequestBody Map<String, Object> request) {
		int memberNo = (Integer) request.get("memberNo");
		String email = (String) request.get("email");
		
		int result = memberService.updateEmail(memberNo, email);
		
		if (result > 0) {
			return ResponseEntity.ok("이메일이 변경되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 변경에 실패했습니다.");
		}
	}

	@PostMapping("phone")
	public ResponseEntity<String> updatePhone(@RequestBody Map<String, Object> request) {
		int memberNo = (Integer) request.get("memberNo");
		String phone = (String) request.get("phone");
		
		int result = memberService.updatePhone(memberNo, phone);
		
		if (result > 0) {
			return ResponseEntity.ok("전화번호가 변경되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("전화번호 변경에 실패했습니다.");
		}
	}

	@GetMapping("history")
	public ResponseEntity<Map<String, Object>> getAccountHistory(
			@RequestParam int memberNo,
			@RequestParam(required = false) String sortBy,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate) {
		
		Map<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("sortBy", sortBy);
		params.put("startDate", startDate);
		params.put("endDate", endDate);
		
		List<AccountHistory> list = memberService.selectAccountHistoryList(params);
		
		Map<String, Object> response = new HashMap<>();
		response.put("list", list);
		
		return ResponseEntity.ok(response);
	}

}
