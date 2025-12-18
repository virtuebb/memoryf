package com.kh.memoryf.common.template;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;

// 파일명 수정 후 로컬 파일 시스템에 업로드 하는 공통 코드
public class FileRenamePolicy {

	public static String saveFile(MultipartFile upfile, HttpSession session, String path) {

		// 1. 원본파일명 확인
		String originName = upfile.getOriginalFilename();
		if (originName == null || originName.isEmpty()) {
			throw new IllegalArgumentException("파일명이 없습니다.");
		}
		
		// 2. 현재 시간 + 랜덤값으로 변경 파일명 생성
		String currentTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		int randNum = (int)(Math.random() * 90000 + 10000);
		int lastDotIndex = originName.lastIndexOf(".");
		String ext = (lastDotIndex > 0) ? originName.substring(lastDotIndex) : ".jpg";
		String changeName = currentTime + randNum + ext;
		
		// 3. 실제 저장 경로 (로컬 사용자 홈 하위)
		String baseDir = System.getProperty("user.home") 
				+ File.separator + "memoryf"
				+ File.separator + "feed_upfiles" + File.separator;
		
		try {
			File directory = new File(baseDir);
			if (!directory.exists()) {
				directory.mkdirs(); // 상위 폴더까지 생성
			}
			
			File uploadFile = new File(baseDir + changeName);
			upfile.transferTo(uploadFile);
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException("파일 저장 실패: " + e.getMessage(), e);
		}
		
		return changeName;
	}
	
	/**
	 * 파일명 변경 (원본 파일명 → 시간기반 랜덤 파일명)
	 * @param originName 원본 파일명
	 * @return 변경된 파일명
	 */
	public static String rename(String originName) {
		if (originName == null || originName.isEmpty()) {
			throw new IllegalArgumentException("파일명이 없습니다.");
		}
		
		// 현재 시간 + 랜덤값으로 변경 파일명 생성
		String currentTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		int randNum = (int)(Math.random() * 90000 + 10000);
		int lastDotIndex = originName.lastIndexOf(".");
		String ext = (lastDotIndex > 0) ? originName.substring(lastDotIndex) : ".jpg";
		
		return currentTime + randNum + ext;
	}
	
}
