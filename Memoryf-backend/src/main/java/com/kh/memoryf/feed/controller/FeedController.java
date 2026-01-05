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
import com.kh.memoryf.common.response.ApiResponse;
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
	public ApiResponse<List<Feed>> selectFeedList(
			@RequestParam(value = "sortBy", defaultValue = "recent") String sortBy,
			@RequestParam(value = "memberNo", required = false) Integer memberNo,
			@RequestParam(value = "page", required = false) Integer page,
			@RequestParam(value = "size", required = false) Integer size) {
		
		ArrayList<Feed> feedList;
		if (page != null && size != null) {
			feedList = feedService.selectFeedList(sortBy, memberNo, page, size);
		} else {
			feedList = feedService.selectFeedList(sortBy, memberNo);
		}
		return ApiResponse.success(feedList != null ? feedList : new ArrayList<>());
	}

	/**
	 * 프로필(작성자) 기준 피드 목록 조회 (RESTful: GET /feeds/by-member/{targetMemberNo})
	 * - 기존 /feeds(recent) 를 필터링하는 방식은 페이지네이션 때문에 프로필에서 게시물이 안 보일 수 있어 별도 엔드포인트로 제공
	 * @param targetMemberNo 프로필 주인 회원 번호(작성자)
	 * @param viewerMemberNo 현재 로그인한 회원 번호 (좋아요 여부 조회용, optional)
	 */
	@GetMapping("/by-member/{targetMemberNo}")
	public ApiResponse<List<Feed>> selectFeedListByMember(
			@PathVariable("targetMemberNo") int targetMemberNo,
			@RequestParam(value = "viewerMemberNo", required = false) Integer viewerMemberNo,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "60") int size) {
		ArrayList<Feed> feedList = feedService.selectProfileFeedList(targetMemberNo, viewerMemberNo, page, size);
		return ApiResponse.success(feedList != null ? feedList : new ArrayList<>());
	}
	
	/**
	 * 북마크한 피드 목록 조회 (RESTful: GET /feeds/bookmarked)
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 북마크한 피드 목록
	 */
	@GetMapping("/bookmarked")
	public ApiResponse<List<Feed>> selectBookmarkedFeedList(
			@RequestParam("memberNo") int memberNo) {
		ArrayList<Feed> feedList = feedService.selectBookmarkedFeedList(memberNo);
		return ApiResponse.success(feedList != null ? feedList : new ArrayList<>());
	}
	
	/**
	 * 피드 상세 조회 (RESTful: GET /feed/{feedNo})
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 피드 상세 정보
	 */
	@GetMapping("/{feedNo}")
	public ApiResponse<Feed> selectFeed(
			@PathVariable("feedNo") int feedNo,
			@RequestParam(value = "memberNo", required = false) Integer memberNo) {
		Feed feed = feedService.selectFeed(feedNo, memberNo);
		if (feed != null) {
			return ApiResponse.success(feed);
		} else {
			return ApiResponse.error("피드를 찾을 수 없습니다.");
		}
	}
	
	/**
	 * 피드 생성 (RESTful: POST /feed)
	 * @param content 피드 내용
	 * @param tag 해시태그
	 * @param latitude 위도
	 * @param longitude 경도
	 * @param memberNo 회원 번호
	 * @param files 업로드할 이미지 파일들
	 * @param request 요청 (파일 저장 경로용)
	 * @return 생성 결과
	 */
	@PostMapping("")
	public ApiResponse<HashMap<String, Object>> insertFeed(
			@RequestParam(value = "content", required = false) String content,
			@RequestParam(value = "tag", required = false) String tag,
			@RequestParam(value = "latitude", required = false) String latitude,
			@RequestParam(value = "longitude", required = false) String longitude,
			@RequestParam(value = "locationName", required = false) String locationName,
			@RequestParam("memberNo") int memberNo,
			@RequestParam("files") List<MultipartFile> files,
			HttpServletRequest request) {
		
		// 파일이 없으면 에러
		if (files == null || files.isEmpty() || files.get(0).isEmpty()) {
			return ApiResponse.error("최소 1개 이상의 파일을 업로드해주세요.");
		}
		
		// Feed 객체 생성
		Feed feed = new Feed();
		feed.setContent(content);
		feed.setTag(tag);
		feed.setLatitude(latitude);
		feed.setLongitude(longitude);
		feed.setLocationName(locationName);
		feed.setMemberNo(memberNo);
		
		// FeedFile 리스트 생성
		List<FeedFile> feedFiles = new ArrayList<>();
		String savePath = "/feed_upfiles/";
		
		HttpSession session = request.getSession(false);
		if (session == null) {
			session = request.getSession(true);
		}
		
		for (MultipartFile file : files) {
			if (!file.isEmpty()) {
				String originName = file.getOriginalFilename();
				String changeName = FileRenamePolicy.saveFile(file, session, savePath);
				
				FeedFile feedFile = new FeedFile();
				feedFile.setOriginName(originName);
				feedFile.setChangeName(changeName);
				String filePath = savePath.endsWith("/") ? savePath + changeName : savePath + "/" + changeName;
				feedFile.setFilePath(filePath);
				
				feedFiles.add(feedFile);
			}
		}
		
		feed.setFeedFiles(feedFiles);
		
		// 피드 저장
		int result = feedService.insertFeed(feed);
		if (result > 0) {
			HashMap<String, Object> data = new HashMap<>();
			data.put("feedNo", feed.getFeedNo());
			return ApiResponse.success("피드가 등록되었습니다.", data);
		} else {
			return ApiResponse.error("피드 등록에 실패했습니다.");
		}
	}
	
	/**
	 * 피드 좋아요 토글 (RESTful: POST /feed/{feedNo}/likes)
	 * @param feedNo 피드 번호
	 * @param request 요청 본문 (memberNo)
	 * @return 좋아요 결과
	 */
	@PostMapping("/{feedNo}/likes")
	public ApiResponse<HashMap<String, Object>> toggleFeedLike(
			@PathVariable("feedNo") int feedNo,
			@RequestBody HashMap<String, Object> request) {
		
		int memberNo = (Integer) request.get("memberNo");
		boolean isLiked = feedService.toggleFeedLike(feedNo, memberNo);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("isLiked", isLiked);
		return ApiResponse.success(isLiked ? "좋아요를 추가했습니다." : "좋아요를 취소했습니다.", data);
	}
	
	/**
	 * 피드 삭제 (RESTful: DELETE /feed/{feedNo})
	 * @param feedNo 피드 번호
	 * @return 삭제 결과
	 */
	@DeleteMapping("/{feedNo}")
	public ApiResponse<Void> deleteFeed(@PathVariable("feedNo") int feedNo) {
		int result = feedService.deleteFeed(feedNo);
		if (result > 0) {
			return ApiResponse.success("피드가 삭제되었습니다.", null);
		} else {
			return ApiResponse.error("피드 삭제에 실패했습니다.");
		}
	}
	
	/**
	 * 피드 수정 (내용/태그/위치)
	 * @param feedNo 피드 번호
	 * @param feed   수정할 내용
	 * @return 수정 결과
	 */
	@PutMapping("/{feedNo}")
	public ApiResponse<Void> updateFeed(
			@PathVariable("feedNo") int feedNo,
			@RequestBody Feed feed) {
		feed.setFeedNo(feedNo);
		int result = feedService.updateFeed(feed);
		if (result > 0) {
			return ApiResponse.success("피드가 수정되었습니다.", null);
		} else {
			return ApiResponse.error("피드 수정에 실패했습니다.");
		}
	}
	
	/**
	 * 피드 북마크 토글 (RESTful: POST /feed/{feedNo}/bookmarks)
	 * @param feedNo 피드 번호
	 * @param request 요청 본문 (memberNo)
	 * @return 북마크 결과
	 */
	@PostMapping("/{feedNo}/bookmarks")
	public ApiResponse<HashMap<String, Object>> toggleFeedBookmark(
			@PathVariable("feedNo") int feedNo,
			@RequestBody HashMap<String, Object> request) {
		
		int memberNo = (Integer) request.get("memberNo");
		boolean isBookmarked = feedService.toggleFeedBookmark(feedNo, memberNo);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("isBookmarked", isBookmarked);
		return ApiResponse.success(isBookmarked ? "북마크에 추가했습니다." : "북마크를 취소했습니다.", data);
	}
	
	/**
	 * 특정 피드의 댓글 목록 조회 (RESTful: GET /feed/{feedNo}/comments)
	 * @param feedNo 피드 번호
	 * @param memberNo 현재 로그인한 회원 번호
	 * @return 댓글 목록
	 */
	@GetMapping("/{feedNo}/comments")
	public ApiResponse<List<Comment>> getComments(
			@PathVariable("feedNo") int feedNo,
			@RequestParam(value = "memberNo", required = false) Integer memberNo) {
		ArrayList<Comment> comments = commentService.selectCommentList(feedNo, memberNo);
		return ApiResponse.success(comments);
	}
	
	/**
	 * 댓글 생성 (RESTful: POST /feed/{feedNo}/comments)
	 * @param feedNo 피드 번호
	 * @param comment 댓글 정보
	 * @return 생성 결과
	 */
	@PostMapping("/{feedNo}/comments")
	public ApiResponse<Void> createComment(
			@PathVariable("feedNo") int feedNo,
			@RequestBody Comment comment) {
		comment.setFeedNo(feedNo);
		int result = commentService.insertComment(comment);
		if (result > 0) {
			return ApiResponse.success("댓글이 등록되었습니다.", null);
		} else {
			return ApiResponse.error("댓글 등록에 실패했습니다.");
		}
	}
	
	/**
	 * 댓글 삭제 (RESTful: DELETE /feed/{feedNo}/comments/{commentNo})
	 * @param feedNo 피드 번호
	 * @param commentNo 댓글 번호
	 * @return 삭제 결과
	 */
	@DeleteMapping("/{feedNo}/comments/{commentNo}")
	public ApiResponse<Void> deleteComment(
			@PathVariable("feedNo") int feedNo,
			@PathVariable("commentNo") int commentNo) {
		int result = commentService.deleteComment(commentNo);
		if (result > 0) {
			return ApiResponse.success("댓글이 삭제되었습니다.", null);
		} else {
			return ApiResponse.error("댓글 삭제에 실패했습니다.");
		}
	}
	
	/**
	 * 댓글 좋아요 토글 (RESTful: POST /feed/{feedNo}/comments/{commentNo}/likes)
	 * @param feedNo 피드 번호
	 * @param commentNo 댓글 번호
	 * @param request 요청 본문 (memberNo)
	 * @return 좋아요 결과
	 */
	@PostMapping("/{feedNo}/comments/{commentNo}/likes")
	public ApiResponse<HashMap<String, Object>> toggleCommentLike(
			@PathVariable("feedNo") int feedNo,
			@PathVariable("commentNo") int commentNo,
			@RequestBody HashMap<String, Object> request) {
		
		int memberNo = (Integer) request.get("memberNo");
		boolean isLiked = commentService.toggleCommentLike(commentNo, memberNo);
		
		HashMap<String, Object> data = new HashMap<>();
		data.put("isLiked", isLiked);
		return ApiResponse.success(isLiked ? "좋아요를 추가했습니다." : "좋아요를 취소했습니다.", data);
	}

	/**
	 * 내가 좋아요한 피드 목록 조회
	 */
	@GetMapping("/liked")
	public ApiResponse<List<Feed>> selectLikedFeedList(
			@RequestParam(value = "memberNo") Integer memberNo,
			@RequestParam(value = "sortBy", defaultValue = "recent") String sortBy,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("sortBy", sortBy);
		map.put("startDate", startDate);
		map.put("endDate", endDate);
		
		List<Feed> list = feedService.selectLikedFeedList(map);
		return ApiResponse.success(list);
	}

	/**
	 * 내가 댓글 단 목록 조회
	 */
	@GetMapping("/commented")
	public ApiResponse<List<Comment>> selectCommentedFeedList(
			@RequestParam(value = "memberNo") Integer memberNo,
			@RequestParam(value = "sortBy", defaultValue = "recent") String sortBy,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("sortBy", sortBy);
		map.put("startDate", startDate);
		map.put("endDate", endDate);
		
		List<Comment> list = feedService.selectCommentedFeedList(map);
		return ApiResponse.success(list);
	}
}
