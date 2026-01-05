package com.kh.memoryf.member.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.member.model.service.MemberService;
import com.kh.memoryf.member.model.vo.AccountHistory;
import com.kh.memoryf.member.model.vo.Member;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/members")
public class MemberController {

	@Autowired
	@SuppressWarnings("unused")
	private MemberService memberService;

	/**
	 * 회원 정보 조회
	 * GET /members/{memberNo}
	 */
	@GetMapping("/{memberNo}")
	public ApiResponse<Member> getMemberInfo(@PathVariable int memberNo) {
		Member member = memberService.selectMember(memberNo);
		if (member != null) {
			member.setMemberPwd(null);
			return ApiResponse.success(member);
		} else {
			return ApiResponse.error("회원 정보를 찾을 수 없습니다.");
		}
	}

	/**
	 * 비밀번호 변경
	 * PUT /members/{memberNo}/password
	 */
	@PutMapping("/{memberNo}/password")
	public ApiResponse<Void> updatePwd(@PathVariable int memberNo, @RequestBody Map<String, Object> request) {
		String oldPwd = (String) request.get("oldPwd");
		String newPwd = (String) request.get("newPwd");
		
		int result = memberService.updatePwd(memberNo, oldPwd, newPwd);
		
		if (result > 0) {
			return ApiResponse.success("비밀번호가 변경되었습니다.", null);
		} else if (result == -1) {
			return ApiResponse.error("현재 비밀번호가 일치하지 않습니다.");
		} else {
			return ApiResponse.error("비밀번호 변경에 실패했습니다.");
		}
	}

	/**
	 * 회원 탈퇴
	 * DELETE /members/{memberNo}
	 */
	@DeleteMapping("/{memberNo}")
	public ApiResponse<Void> deleteMember(@PathVariable int memberNo, @RequestBody Map<String, Object> request) {
		String memberPwd = (String) request.get("memberPwd");
		
		int result = memberService.deleteMember(memberNo, memberPwd);
		
		if (result > 0) {
			return ApiResponse.success("회원 탈퇴가 완료되었습니다.", null);
		} else if (result == -1) {
			return ApiResponse.error("비밀번호가 일치하지 않습니다.");
		} else {
			return ApiResponse.error("회원 탈퇴에 실패했습니다.");
		}
	}

	/**
	 * 이메일 변경
	 * PUT /members/{memberNo}/email
	 */
	@PutMapping("/{memberNo}/email")
	public ApiResponse<Void> updateEmail(@PathVariable int memberNo, @RequestBody Map<String, Object> request) {
		String email = (String) request.get("email");
		
		int result = memberService.updateEmail(memberNo, email);
		
		if (result > 0) {
			return ApiResponse.success("이메일이 변경되었습니다.", null);
		} else {
			return ApiResponse.error("이메일 변경에 실패했습니다.");
		}
	}

	/**
	 * 전화번호 변경
	 * PUT /members/{memberNo}/phone
	 */
	@PutMapping("/{memberNo}/phone")
	public ApiResponse<Void> updatePhone(@PathVariable int memberNo, @RequestBody Map<String, Object> request) {
		String phone = (String) request.get("phone");
		
		int result = memberService.updatePhone(memberNo, phone);
		
		if (result > 0) {
			return ApiResponse.success("전화번호가 변경되었습니다.", null);
		} else {
			return ApiResponse.error("전화번호 변경에 실패했습니다.");
		}
	}

	/**
	 * 계정 활동 내역 조회
	 * GET /members/{memberNo}/history
	 */
	@GetMapping("/{memberNo}/history")
	public ApiResponse<List<AccountHistory>> getAccountHistory(
			@PathVariable int memberNo,
			@RequestParam(required = false) String sortBy,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate) {
		
		Map<String, Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("sortBy", sortBy);
		params.put("startDate", startDate);
		params.put("endDate", endDate);
		
		List<AccountHistory> list = memberService.selectAccountHistoryList(params);
		return ApiResponse.success(list);
	}
}
