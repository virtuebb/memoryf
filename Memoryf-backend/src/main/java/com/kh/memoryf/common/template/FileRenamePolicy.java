package com.kh.memoryf.common.template;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;

// 파일명 수정 후 서버로 업로드 하는 공통 코드 작업
public class FileRenamePolicy {

	public static String saveFile(MultipartFile upfile, HttpSession session, String path) {

		// 예) 카카오톡 
		//    bono.jpg --> "2025102015000230xxxxx.jpg" 
		//                  년월일시분초 + 랜덤값(5자리) + 원래확장자

		// 1. 원본파일명 뽑아오기
		String originName = upfile.getOriginalFilename();
		// bono.jpg
		
		// 2. 현재 시간을 형식에 맞게 문자열로 뽑기
		String currentTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		// > "2025102015000230" 년월일시분초
		
		// 3. 뒤에 붙힐 5자리 랜덤 수 (10000~99999)
		int randNum = (int)(Math.random() * 90000 + 10000);
		
		// 4. 원본 파일로부터 확장자명만 뽑아오기
		String ext = originName.substring(originName.lastIndexOf("."));
		// ".jpg"
		
		// 5. 모두 이어붙이기
		String changeName = currentTime + randNum + ext;
		
		// 6. 업로드 하고자 하는 폴더의 경로 세팅
		// > 단,우리는 개발 단계지만 추후 베포 단계를 고려해서 경로를 세팅
		//   우리의 배포 폴더 역할을 하는 webapp 폴더으로 경로를 잡아줄 것
		//   webapp 폴더 내부의 resources 폴더
		//   내부 어딘가에 첨부파일들을 보관할 수 있게끔 유도해보자
		//   (webapp/resources/board_upfiles 폴더)
		
		// application 객체에서 제공하는 getRealPath 메소드를 통해 알아내기
		// request 객체로부터, session 객체로부터 얻어내는 방법이 있음
		String savePath = session.getServletContext().getRealPath(path);
		// > 앞 슬래쉬는 webapp 폴더를 의미
		//   뒤의 /는 board_file라는 폴더 안을 의미
		//   업로드된 파일들은 모두 폴더 안에 존장
		// > savePath는 c 드라이브에서부터시작되는 board_upfiles라는 폴더의 절대 경로가 담겼을 것
		
		// 7. 파일 경로로와 수정파일명을 합체 후 파일을 업로드
		try {
			upfile.transferTo(new File(savePath + changeName));
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return changeName;
	}
	
}
