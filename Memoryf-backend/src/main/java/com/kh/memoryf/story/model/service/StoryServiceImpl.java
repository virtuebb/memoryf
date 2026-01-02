package com.kh.memoryf.story.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kh.memoryf.common.template.FileRenamePolicy;
import com.kh.memoryf.story.model.dao.StoryDao;
import com.kh.memoryf.story.model.vo.Story;
import com.kh.memoryf.story.model.vo.StoryDetail;
import com.kh.memoryf.story.model.vo.StoryItem;
import com.kh.memoryf.story.model.vo.StoryVisitor;

import jakarta.servlet.http.HttpSession;

@Service 
public class StoryServiceImpl implements StoryService {

	@Autowired
	private StoryDao storyDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	
	@Override
	public StoryDetail selectStoryDetail(int storyNo) {
		
		return storyDao.selectStoryDetail(sqlSession, storyNo);
	}


	@Override
	@Transactional
	public int insertStory(StoryDetail storyDetail,
	                       ArrayList<MultipartFile> files,
	                       HttpSession session) {

	    // 1) storyNo 생성
	    int storyNo = storyDao.selectStoryNo(sqlSession);

	    // 2) TB_STORY insert
	    Story story = storyDetail.getStory();
	    story.setStoryNo(storyNo);
	    storyDao.insertStory(sqlSession, story);

	    // 3) TB_STORY_ITEM 세팅 + 파일 저장
	    ArrayList<StoryItem> items = storyDetail.getItems();

	    int order = 1;

	    for (int i = 0; i < items.size(); i++) {

	        StoryItem item = items.get(i);

	        item.setStoryNo(storyNo);
	        item.setItemOrder(order++);

	        // 파일 매칭 (items 순서 = files 순서)
	        MultipartFile upfile = files.get(i);

	        String originName = upfile.getOriginalFilename();
	        String changeName = FileRenamePolicy.saveFile(upfile, session, "story"); // path 파라미터는 너 방식대로

	        item.setOriginName(originName);
	        item.setChangeName(changeName);

	        // ⚠️ 여기 값은 "프론트에서 접근하는 경로"로 통일해야 함
	        // 예) /resources/story
	        item.setFilePath("/resources/story");
	    }

	    // 4) TB_STORY_ITEM 다건 insert
	    storyDao.insertStoryItems(sqlSession, items);

	    return storyNo;
	}



	@Override
	@Transactional
	public int deleteStory(int storyNo) {
		
		storyDao.deleteStoryItems(sqlSession, storyNo);

		return storyDao.deleteStory(sqlSession, storyNo);
	}


	@Override
	public ArrayList<Story> selectStoryList(int memberNo) {

		return storyDao.selectStoryList(sqlSession, memberNo);
	}

	@Override
	public ArrayList<Story> selectStoryListByMember(int memberNo) {
		return storyDao.selectStoryListByMember(sqlSession, memberNo);
	}


	@Override
	@Transactional
	public int insertStoryVisitor(StoryVisitor storyVisitor) {

		// 중복방지
		int count = storyDao.selectStoryVisitorCount(sqlSession, storyVisitor);
		
		if(count >0) {
			
			return 0;
		}
		
		return storyDao.insertStoryVisitor(sqlSession, storyVisitor);
	}
	
	
	
	
	

}
