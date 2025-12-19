package com.kh.memoryf.feed.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.memoryf.comment.model.service.CommentService;
import com.kh.memoryf.comment.model.vo.Comment;
import com.kh.memoryf.common.template.FileRenamePolicy;
import com.kh.memoryf.feed.model.service.FeedService;
import com.kh.memoryf.feed.model.vo.Feed;
import com.kh.memoryf.feed.model.vo.FeedFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("feeds")
public class FeedController {

	@Autowired
	private FeedService feedService;
	
	@Autowired
	private CommentService commentService;
	
	/**
	 * 피드 목록 조회 (RESTful: GET /feed)
	 * @param sortBy 정렬 기준 (popular, following, recent) - 기본값: recent
	 * @param memberNo 현재 로그인한 회원 번호 (세션에서 가져와야 함, 임시로 파라미터로 받음)
	 * @return 피드 목록
	 */
	@GetMapping("")
	public HashMap<String, Object> selectFeedList(
			@RequestParam(value = "sortBy", defaultValue = "recent") String sortBy,
			@RequestParam(value = "memberNo", required = false) Integer memberNo,
			@RequestParam(value = "page", required = false) Integer page,
			@RequestParam(value = "size", required = false) Integer size) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			ArrayList<Feed> feedList;
			if (page != null && size != null) {
				feedList = feedService.selectFeedList(sortBy, memberNo, page, size);
			} else {
				feedList = feedService.selectFeedList(sortBy, memberNo);
			}
			System.out.println("피드 목록 조회 결과: " + (feedList != null ? feedList.size() + "개" : "null"));
			if (feedList != null && !feedList.isEmpty()) {
				System.out.println("첫 번째 피드: " + feedList.get(0).toString());
			}
			response.put("success", true);
			response.put("data", feedList != null ? feedList : new ArrayList<>());
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("피드 목록 조회 예외 발생:");
			System.err.println("예외 타입: " + e.getClass().getName());
			System.err.println("예외 메시지: " + e.getMessage());
			if (e.getCause() != null) {
				System.err.println("원인 예외: " + e.getCause().getMessage());
			}
			response.put("success", false);
			response.put("message", "피드 목록 조회 실패: " + e.getMessage());
			if (e.getCause() != null) {
				response.put("cause", e.getCause().getMessage());
			}
		}
		
		return response;
	}
	
	/**
	 * 북마크한 피드 목록 조회 (RESTful: GET /feeds/bookmarked)
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 북마크한 피드 목록
	 */
	@GetMapping("/bookmarked")
	public HashMap<String, Object> selectBookmarkedFeedList(
			@RequestParam("memberNo") int memberNo) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			ArrayList<Feed> feedList = feedService.selectBookmarkedFeedList(memberNo);
			response.put("success", true);
			response.put("data", feedList != null ? feedList : new ArrayList<>());
		} catch (Exception e) {
			e.printStackTrace();
			response.put("success", false);
			response.put("message", "북마크 피드 목록 조회 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 피드 상세 조회 (RESTful: GET /feed/{feedNo})
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 피드 상세 정보
	 */
	@GetMapping("/{feedNo}")
	public HashMap<String, Object> selectFeed(
			@PathVariable("feedNo") int feedNo,
			@RequestParam(value = "memberNo", required = false) Integer memberNo) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			Feed feed = feedService.selectFeed(feedNo, memberNo);
			if (feed != null) {
				response.put("success", true);
				response.put("data", feed);
			} else {
				response.put("success", false);
				response.put("message", "피드를 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "피드 조회 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 피드 생성 (RESTful: POST /feed)
	 * @param content 피드 내용
	 * @param tag 해시태그
	 * @param latitude 위도
	 * @param longitude 경도
	 * @param memberNo 회원 번호
	 * @param files 업로드할 이미지 파일들
	 * @param session 세션 (파일 저장 경로용)
	 * @return 생성 결과
	 */
	@PostMapping("")
	public HashMap<String, Object> insertFeed(
			@RequestParam(value = "content", required = false) String content,
			@RequestParam(value = "tag", required = false) String tag,
			@RequestParam(value = "latitude", required = false) String latitude,
			@RequestParam(value = "longitude", required = false) String longitude,
			@RequestParam("memberNo") int memberNo,
			@RequestParam("files") List<MultipartFile> files,
			HttpServletRequest request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			// 파일이 없으면 에러
			if (files == null || files.isEmpty() || files.get(0).isEmpty()) {
				response.put("success", false);
				response.put("message", "최소 1개 이상의 이미지를 업로드해주세요.");
				return response;
			}
			
			// Feed 객체 생성
			Feed feed = new Feed();
			feed.setContent(content);
			feed.setTag(tag);
			feed.setLatitude(latitude);
			feed.setLongitude(longitude);
			feed.setMemberNo(memberNo);
			
			// FeedFile 리스트 생성
			List<FeedFile> feedFiles = new ArrayList<>();
			// 정적 리소스 매핑 경로 (URL 경로)
			String savePath = "/feed_upfiles/";
			
			// 세션이 없어도 HttpServletRequest에서 ServletContext를 가져올 수 있음
			HttpSession session = request.getSession(false);
			if (session == null) {
				session = request.getSession(true);
			}
			
			for (MultipartFile file : files) {
				if (!file.isEmpty()) {
					try {
						String originName = file.getOriginalFilename();
						String changeName = FileRenamePolicy.saveFile(file, session, savePath);
						
						FeedFile feedFile = new FeedFile();
						feedFile.setOriginName(originName);
						feedFile.setChangeName(changeName);
						// 경로 끝에 슬래시가 없으면 추가
						String filePath = savePath.endsWith("/") ? savePath + changeName : savePath + "/" + changeName;
						feedFile.setFilePath(filePath);
						
						feedFiles.add(feedFile);
					} catch (Exception e) {
						e.printStackTrace();
						response.put("success", false);
						response.put("message", "파일 업로드 실패: " + e.getMessage());
						return response;
					}
				}
			}
			
			feed.setFeedFiles(feedFiles);
			
			// 피드 저장
			int result = feedService.insertFeed(feed);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "피드가 등록되었습니다.");
				response.put("feedNo", feed.getFeedNo());
			} else {
				response.put("success", false);
				response.put("message", "피드 등록에 실패했습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			String errorMessage = "피드 등록 실패: " + e.getMessage();
			
			// 외래 키 제약 조건 위반인 경우 더 명확한 메시지 제공
			if (e.getMessage() != null && e.getMessage().contains("ORA-02291")) {
				errorMessage = "피드 등록 실패: 회원 정보가 존재하지 않습니다. (MEMBER_NO: " + memberNo + ")";
			} else if (e.getCause() != null && e.getCause().getMessage() != null 
					&& e.getCause().getMessage().contains("ORA-02291")) {
				errorMessage = "피드 등록 실패: 회원 정보가 존재하지 않습니다. (MEMBER_NO: " + memberNo + ")";
			}
			
			response.put("success", false);
			response.put("message", errorMessage);
		}
		
		return response;
	}
	
	/**
	 * 피드 좋아요 토글 (RESTful: POST /feed/{feedNo}/likes)
	 * @param feedNo 피드 번호
	 * @param memberNo 회원 번호 (요청 본문에서 받음)
	 * @return 좋아요 결과
	 */
	@PostMapping("/{feedNo}/likes")
	public HashMap<String, Object> toggleFeedLike(
			@PathVariable("feedNo") int feedNo,
			@RequestBody HashMap<String, Object> request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int memberNo = (Integer) request.get("memberNo");
			boolean isLiked = feedService.toggleFeedLike(feedNo, memberNo);
			
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
	 * 피드 삭제 (RESTful: DELETE /feed/{feedNo})
	 * @param feedNo 피드 번호
	 * @return 삭제 결과
	 */
	@DeleteMapping("/{feedNo}")
	public HashMap<String, Object> deleteFeed(@PathVariable("feedNo") int feedNo) {
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int result = feedService.deleteFeed(feedNo);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "피드가 삭제되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "피드 삭제에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "피드 삭제 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 피드 수정 (내용/태그/위치)
	 * @param feedNo 피드 번호
	 * @param feed   수정할 내용
	 * @return 수정 결과
	 */
	@PutMapping("/{feedNo}")
	public HashMap<String, Object> updateFeed(
			@PathVariable("feedNo") int feedNo,
			@RequestBody Feed feed) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			feed.setFeedNo(feedNo);
			int result = feedService.updateFeed(feed);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "피드가 수정되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "피드 수정에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "피드 수정 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 피드 북마크 토글 (RESTful: POST /feed/{feedNo}/bookmarks)
	 * @param feedNo 피드 번호
	 * @param request 요청 본문 (memberNo)
	 * @return 북마크 결과
	 */
	@PostMapping("/{feedNo}/bookmarks")
	public HashMap<String, Object> toggleFeedBookmark(
			@PathVariable("feedNo") int feedNo,
			@RequestBody HashMap<String, Object> request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int memberNo = (Integer) request.get("memberNo");
			boolean isBookmarked = feedService.toggleFeedBookmark(feedNo, memberNo);
			
			response.put("success", true);
			response.put("isBookmarked", isBookmarked);
			response.put("message", isBookmarked ? "북마크에 추가했습니다." : "북마크를 취소했습니다.");
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "북마크 처리 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 특정 피드의 댓글 목록 조회 (RESTful: GET /feed/{feedNo}/comments)
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 댓글 목록
	 */
	@GetMapping("/{feedNo}/comments")
	public HashMap<String, Object> getComments(
			@PathVariable("feedNo") int feedNo,
			@RequestParam(value = "memberNo", required = false) Integer memberNo) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			ArrayList<Comment> comments = commentService.selectCommentList(feedNo, memberNo);
			response.put("success", true);
			response.put("data", comments);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "댓글 조회 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 댓글 생성 (RESTful: POST /feed/{feedNo}/comments)
	 * @param feedNo 피드 번호
	 * @param comment 댓글 정보
	 * @return 생성 결과
	 */
	@PostMapping("/{feedNo}/comments")
	public HashMap<String, Object> createComment(
			@PathVariable("feedNo") int feedNo,
			@RequestBody Comment comment) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			comment.setFeedNo(feedNo);
			int result = commentService.insertComment(comment);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "댓글이 등록되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "댓글 등록에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "댓글 등록 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 댓글 삭제 (RESTful: DELETE /feed/{feedNo}/comments/{commentNo})
	 * @param feedNo 피드 번호
	 * @param commentNo 댓글 번호
	 * @return 삭제 결과
	 */
	@DeleteMapping("/{feedNo}/comments/{commentNo}")
	public HashMap<String, Object> deleteComment(
			@PathVariable("feedNo") int feedNo,
			@PathVariable("commentNo") int commentNo) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int result = commentService.deleteComment(commentNo);
			if (result > 0) {
				response.put("success", true);
				response.put("message", "댓글이 삭제되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "댓글 삭제에 실패했습니다.");
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "댓글 삭제 실패: " + e.getMessage());
		}
		
		return response;
	}
	
	/**
	 * 댓글 좋아요 토글 (RESTful: POST /feed/{feedNo}/comments/{commentNo}/likes)
	 * @param feedNo 피드 번호
	 * @param commentNo 댓글 번호
	 * @param request 요청 본문 (memberNo)
	 * @return 좋아요 결과
	 */
	@PostMapping("/{feedNo}/comments/{commentNo}/likes")
	public HashMap<String, Object> toggleCommentLike(
			@PathVariable("feedNo") int feedNo,
			@PathVariable("commentNo") int commentNo,
			@RequestBody HashMap<String, Object> request) {
		
		HashMap<String, Object> response = new HashMap<>();
		
		try {
			int memberNo = (Integer) request.get("memberNo");
			boolean isLiked = commentService.toggleCommentLike(commentNo, memberNo);
			
			response.put("success", true);
			response.put("isLiked", isLiked);
			response.put("message", isLiked ? "좋아요를 추가했습니다." : "좋아요를 취소했습니다.");
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "좋아요 처리 실패: " + e.getMessage());
		}
		
		return response;
	}
}
