package com.kh.memoryf.auth.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.LoginService;
import com.kh.memoryf.auth.model.service.SignupService;
import com.kh.memoryf.auth.model.service.FindService;
import com.kh.memoryf.auth.model.vo.Login;
import com.kh.memoryf.auth.model.vo.Signup;
import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.member.model.vo.Member;

/**
 * 통합 인증 컨트롤러
 * 
 * 로그인, 회원가입, 아이디/비밀번호 찾기 등 인증 관련 모든 API를 담당
 */
@CrossOrigin(origins={"http://192.168.150.10:5173", "http://localhost:5173", "https://localhost:5173"})
@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private LoginService loginService;
	
	@Autowired
	private SignupService signupService;
	
	@Autowired
	private FindService findService;
	
	// ==================== 로그인 관련 API ====================
	
	/**
	 * 로그인 요청 처리
	 * POST /auth/login
	 * @param login 로그인 정보 (memberId, memberPwd)
	 * @return JWT 토큰
	 */
	@PostMapping("/login")
	public ApiResponse<HashMap<String, Object>> login(@RequestBody Login login) {
		try {
			String jwt = loginService.loginMember(login);
			
			if (jwt != null && !jwt.isEmpty()) {
				HashMap<String, Object> data = new HashMap<>();
				data.put("token", jwt);
				return ApiResponse.success("로그인 성공", data);
			} else {
				return ApiResponse.error("아이디 또는 비밀번호가 일치하지 않습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ApiResponse.error("로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	// ==================== 회원가입 관련 API ====================
	
	/**
	 * 회원가입
	 * POST /auth/signup
	 */
	@PostMapping("/signup")
	public ApiResponse<Void> signup(@RequestBody Signup signup) {
		try {
			int result = signupService.insertMember(signup);
			if (result > 0) {
				return ApiResponse.success("회원가입이 완료되었습니다.", null);
			} else {
				return ApiResponse.error("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			// DB 제약 위반 등으로 500이 나지 않도록 표준 응답으로 변환
			String errorMsg = e.getMessage();
			if (errorMsg != null && errorMsg.contains("UNIQUE")) {
				return ApiResponse.error("이미 사용 중인 정보입니다. (아이디, 닉네임, 이메일 중복)");
			}
			return ApiResponse.error("회원가입 처리 중 오류가 발생했습니다: " + errorMsg);
		}
	}
	
	/**
	 * 아이디 중복 체크
	 * POST /auth/check-id
	 */
	@PostMapping("/check-id")
	public ApiResponse<HashMap<String, Object>> checkId(@RequestBody String memberId) {
		int count = signupService.checkMemberId(memberId);
		HashMap<String, Object> data = new HashMap<>();
		data.put("available", count == 0);
		return ApiResponse.success(count == 0 ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.", data);
	}
	
	/**
	 * 닉네임 중복 체크
	 * POST /auth/check-nick
	 */
	@PostMapping("/check-nick")
	public ApiResponse<HashMap<String, Object>> checkNick(@RequestBody String memberNick) {
		int count = signupService.checkMemberNick(memberNick);
		HashMap<String, Object> data = new HashMap<>();
		data.put("available", count == 0);
		return ApiResponse.success(count == 0 ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다.", data);
	}
	
	// ==================== 아이디/비밀번호 찾기 API ====================
	
	/**
	 * 아이디 찾기
	 * POST /auth/find-id
	 */
	@PostMapping("/find-id")
	public ApiResponse<HashMap<String, Object>> findId(@RequestBody Member member) {
		String memberId = findService.findId(member);
		
		if(memberId != null) {
			HashMap<String, Object> data = new HashMap<>();
			data.put("memberId", memberId);
			return ApiResponse.success("아이디를 찾았습니다.", data);
		} else {
			return ApiResponse.error("일치하는 회원이 없습니다.");
		}
	}
	
	/**
	 * 비밀번호 찾기 (존재 여부 확인)
	 * POST /auth/find-password
	 */
	@PostMapping("/find-password")
	public ApiResponse<HashMap<String, Object>> findPassword(@RequestBody Member member) {
		boolean exists = findService.findPwd(member);
		HashMap<String, Object> data = new HashMap<>();
		data.put("exists", exists);
		
		if (exists) {
			return ApiResponse.success("회원 정보가 확인되었습니다.", data);
		} else {
			return ApiResponse.error("일치하는 회원이 없습니다.");
		}
	}
	
	/**
	 * 비밀번호 재설정
	 * POST /auth/reset-password
	 */
	@PostMapping("/reset-password")
	public ApiResponse<Void> resetPassword(@RequestBody Member member) {
		int result = findService.resetPwd(member.getMemberId(), member.getMemberPwd());
		
		if (result > 0) {
			return ApiResponse.success("비밀번호가 재설정되었습니다.", null);
		} else {
			return ApiResponse.error("비밀번호 재설정에 실패했습니다.");
		}
	}
	
	/**
	 * 테스트용: 비밀번호 직접 재설정 (개발 환경 전용)
	 * POST /auth/test-reset-password
	 * Body: { "memberId": "testuser", "memberPwd": "1234" }
	 */
	@PostMapping("/test-reset-password")
	public ApiResponse<HashMap<String, Object>> testResetPassword(@RequestBody Member member) {
		try {
			int result = findService.resetPwd(member.getMemberId(), member.getMemberPwd());
			
			if (result > 0) {
				HashMap<String, Object> data = new HashMap<>();
				data.put("memberId", member.getMemberId());
				data.put("message", "비밀번호가 재설정되었습니다.");
				return ApiResponse.success("비밀번호가 재설정되었습니다.", data);
			} else {
				return ApiResponse.error("비밀번호 재설정에 실패했습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ApiResponse.error("비밀번호 재설정 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
}
