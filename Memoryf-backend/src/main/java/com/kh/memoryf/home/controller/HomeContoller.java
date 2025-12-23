package com.kh.memoryf.home.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.memoryf.common.template.FileRenamePolicy;
import com.kh.memoryf.guestbook.model.vo.Guestbook;
import com.kh.memoryf.home.model.service.HomeService;
import com.kh.memoryf.home.model.vo.Home;
import com.kh.memoryf.member.model.service.MemberService;
import com.kh.memoryf.member.model.vo.AccountHistory;
import com.kh.memoryf.member.model.vo.Member;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("home")
public class HomeContoller {

	@Autowired
	private HomeService homeService;
	
	@Autowired
	private MemberService memberService;
	
	/**
	 * 회원 번호로 홈 조회 (RESTful: GET /home/{memberNo})
	 * @param memberNo 조회할 회원 번호
	 * @param currentMemberNo 현재 로그인한 회원 번호 (옵션)
	 * @return 홈 정보
	 */
	@GetMapping("/{memberNo}")
	public HashMap<String, Object> getHome(
			@PathVariable("memberNo") int memberNo,
			@RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			Home home = homeService.getHomeByMemberNo(memberNo, currentMemberNo);
			if (home != null) {
				response.put("success", true);
				response.put("data", home);
			} else {
				response.put("success", false);
				response.put("message", "홈을 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "홈 조회 실패: " + e.getMessage());
		}
		
		return response;
	}

	/**
	 * 닉네임으로 홈 조회 (RESTful: GET /home/by-nick/{memberNick})
	 * 닉네임이 변경 가능하므로, 과거 닉네임은 404 처리(요청대로 링크 깨짐 허용)
	 * @param memberNick 조회할 회원 닉네임
	 * @param currentMemberNo 현재 로그인한 회원 번호 (옵션)
	 * @return 홈 정보
	 */
	@GetMapping("/by-nick/{memberNick}")
	public HashMap<String, Object> getHomeByNick(
			@PathVariable("memberNick") String memberNick,
			@RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo) {
		HashMap<String, Object> response = new HashMap<>();
		try {
			Integer memberNo = memberService.selectMemberNoByNick(memberNick);
			if (memberNo == null) {
				response.put("success", false);
				response.put("message", "회원을 찾을 수 없습니다.");
				return response;
			}

			Home home = homeService.getHomeByMemberNo(memberNo, currentMemberNo);
			if (home != null) {
				response.put("success", true);
				response.put("data", home);
			} else {
				response.put("success", false);
				response.put("message", "홈을 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "홈 조회 실패: " + e.getMessage());
		}
		return response;
	}
	
	/**
	 * 홈 번호로 방명록 목록 조회 (RESTful: GET /home/{homeNo}/guestbook)
	 * @param homeNo 홈 번호
	 * @param currentMemberNo 현재 로그인한 회원 번호 (옵션)
	 * @return 방명록 목록
	 */
	    @GetMapping("/{homeNo}/guestbook")
	    public HashMap<String, Object> getGuestbookList(
		    @PathVariable("homeNo") int homeNo,
		    @RequestParam(value = "currentMemberNo", required = false) Integer currentMemberNo,
		    @RequestParam(value = "offset", defaultValue = "0") int offset,
		    @RequestParam(value = "limit", defaultValue = "3") int limit) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			ArrayList<Guestbook> guestbookList = homeService.getGuestbookList(homeNo, currentMemberNo, offset, limit);
			response.put("success", true);
			response.put("data", guestbookList);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "방명록 조회 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 방명록 생성 (RESTful: POST /home/{homeNo}/guestbook)
	 * @param homeNo 홈 번호
	 * @param guestbook 방명록 정보
	 * @return 생성 결과
	 */
	@PostMapping("/{homeNo}/guestbook")
	public HashMap<String, Object> createGuestbook(
			@PathVariable("homeNo") int homeNo,
			@RequestBody Guestbook guestbook) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			guestbook.setHomeNo(homeNo);
			int result = homeService.createGuestbook(guestbook);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "방명록이 등록되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "방명록 등록에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "방명록 등록 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 방명록 삭제 (RESTful: DELETE /home/{homeNo}/guestbook/{guestbookNo})
	 * @param homeNo 홈 번호
	 * @param guestbookNo 방명록 번호
	 * @return 삭제 결과
	 */
	@DeleteMapping("/{homeNo}/guestbook/{guestbookNo}")
	public HashMap<String, Object> deleteGuestbook(
			@PathVariable("homeNo") int homeNo,
			@PathVariable("guestbookNo") int guestbookNo) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int result = homeService.deleteGuestbook(guestbookNo);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "방명록이 삭제되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "방명록 삭제에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "방명록 삭제 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 방명록 좋아요 토글 (RESTful: POST /home/{homeNo}/guestbook/{guestbookNo}/likes)
	 * @param homeNo 홈 번호
	 * @param guestbookNo 방명록 번호
	 * @param request 요청 본문 (memberNo)
	 * @return 좋아요 결과
	 */
	@PostMapping("/{homeNo}/guestbook/{guestbookNo}/likes")
	public HashMap<String, Object> toggleGuestbookLike(
			@PathVariable("homeNo") int homeNo,
			@PathVariable("guestbookNo") int guestbookNo,
			@RequestBody HashMap<String, Object> request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int memberNo = (Integer) request.get("memberNo");
			boolean isLiked = homeService.toggleGuestbookLike(guestbookNo, memberNo);
			
			response.put("success", true);
			response.put("isLiked", isLiked);
			response.put("message", isLiked ? "좋아요를 추가했습니다." : "좋아요를 취소했습니다.");
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "좋아요 처리 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 프로필 이미지 업로드 (RESTful: POST /home/{memberNo}/profile-image)
	 * @param memberNo 회원 번호
	 * @param file 프로필 이미지 파일
	 * @param request HttpServletRequest
	 * @return 업로드 결과
	 */
	@PostMapping("/{memberNo}/profile-image")
	public HashMap<String, Object> uploadProfileImage(
			@PathVariable("memberNo") int memberNo,
			@RequestParam("file") MultipartFile file,
			HttpServletRequest request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		if (file.isEmpty()) {
			response.put("success", false);
			response.put("message", "파일이 비어있습니다.");
			return response;
		}
		
		try {
			// 파일 저장 경로 - 사용자 홈 디렉토리 하위에 저장
			String savePath = System.getProperty("user.home") 
					+ File.separator + "memoryf" 
					+ File.separator + "profile_images" 
					+ File.separator;
			
			// 디렉토리 생성
			File dir = new File(savePath);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			
			// 파일명 변경
			String originName = file.getOriginalFilename();
			String changeName = FileRenamePolicy.rename(originName);
			
			// 파일 저장
			file.transferTo(new File(savePath + changeName));
			
			// 홈 정보 업데이트
			Home home = new Home();
			home.setMemberNo(memberNo);
			home.setProfileOriginName(originName);
			home.setProfileChangeName(changeName);
			
			int result = homeService.updateProfileImage(home);
			
			if (result > 0) {
				// 계정 내역 저장
				AccountHistory history = new AccountHistory();
				history.setMemberNo(memberNo);
				history.setEventType("UPDATE");
				history.setEventDesc("프로필 사진을 변경했습니다.");
				memberService.insertAccountHistory(history);
				
				response.put("success", true);
				response.put("message", "프로필 이미지가 업데이트되었습니다.");
				response.put("profileChangeName", changeName);
			} else {
				response.put("success", false);
				response.put("message", "프로필 이미지 업데이트에 실패했습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.put("success", false);
			response.put("message", "프로필 이미지 업로드 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 프로필 정보 수정 (RESTful: PUT /home/{memberNo}/profile)
	 * @param memberNo 회원 번호
	 * @param request 요청 본문 (memberNick, statusMsg)
	 * @return 수정 결과
	 */
	@PutMapping("/{memberNo}/profile")
	public HashMap<String, Object> updateProfile(
			@PathVariable("memberNo") int memberNo,
			@RequestBody HashMap<String, Object> request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			String memberNick = (String) request.get("memberNick");
			String statusMsg = (String) request.get("statusMsg");
			
			// Member 닉네임 업데이트
			Member member = new Member();
			member.setMemberNo(memberNo);
			member.setMemberNick(memberNick);
			memberService.updateMemberNick(member);
			
			// Home 상태메시지 업데이트
			Home home = new Home();
			home.setMemberNo(memberNo);
			home.setStatusMsg(statusMsg);
			homeService.updateStatusMsg(home);
			
			response.put("success", true);
			response.put("message", "프로필이 업데이트되었습니다.");
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "프로필 업데이트 실패: " + e.getMessage());
		}
		
		return response;
	}

	/**
	 * 계정 공개 범위 수정 (RESTful: PUT /home/{memberNo}/privacy)
	 * @param memberNo 회원 번호
	 * @param request 요청 본문 (isPrivate)
	 * @return 수정 결과
	 */
	@PutMapping("/{memberNo}/privacy")
	public HashMap<String, Object> updatePrivacy(
			@PathVariable("memberNo") int memberNo,
			@RequestBody HashMap<String, Object> request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			boolean isPrivate = (boolean) request.get("isPrivate");
			String isPrivateStr = isPrivate ? "Y" : "N";
			
			Home home = new Home();
			home.setMemberNo(memberNo);
			home.setIsPrivateProfile(isPrivateStr);
			
			int result = homeService.updatePrivacy(home);
			
			if (result > 0) {
				// 계정 내역 저장
				AccountHistory history = new AccountHistory();
				history.setMemberNo(memberNo);
				history.setEventType("PRIVACY");
				history.setEventDesc(isPrivate ? "계정을 비공개로 전환했습니다." : "계정을 공개로 전환했습니다.");
				memberService.insertAccountHistory(history);
				
				response.put("success", true);
				response.put("message", "계정 공개 범위가 변경되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "계정 공개 범위 변경에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "계정 공개 범위 변경 실패: " + e.getMessage());
		}
		
		return response;
	}
}
