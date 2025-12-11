package com.kh.retrogram.common.template;

import com.kh.retrogram.common.model.vo.PageInfo;

// 페이징 처리 시마다 필요한 7개의 변수를 세팅하는 공통코드
public class Pagination {

	// 4개의 기본변수를 매개변수로 받아서 3개의 변수를 계산해서 리턴
	public static PageInfo getPageInfo(int listCount,
							  		   int currentPage,
							           int pageLimit,
							           int boardLimit) {

		// * maxPage : 가장 마지막 페이지가 몇번 페이지인지
		/*
		 * maxPage 구하기 - listCount, boardLimit의 영향을 받음
		 * 
		 * - 공식 구하기
		 * 단, boardLimit가 10이라는 가정 하에 규칙을 구하기
		 * 
		 * listCount	boardLimit	 	maxPage
		 * 100.0		/  10  => 10.0	10		
		 * 101.0		/  10  => 10.1	11
		 * 107.0		/  10  => 10.7	11
		 * 109.0		/  10  => 10.9	11
		 * 110.0       	/  10  => 11.0	11
		 * 112.0      	/  10  => 11.2	12
		 * 115.0      	/  10  => 11.5	12
		 * ...		 	
		 * => 컴퓨터의 값 처리 규칙 때문에 정수끼리 나누면 정수로 몫이 나옴
		 *    이걸 maxPage 값이랑 맞춰줘야함
		 * => 일부러 실수로 나눗셈 후 결과를 올림처리 한다면? 
		 *    maxPage 값 도출 가능!!
		 *
		 * 1) listCount를 double로 강제형변환
		 * 2) listCount / boardLimit
		 * 3) 결과를 올림처리 (Math.ceil)
		 * 4) 결과값을 int로 강제 형변환
		 * 
		 * maxPage = (int)Math.ceil((double)ListCount / boardLimit);
		 * 
		 */
		
		int maxPage = (int)Math.ceil((double)listCount / boardLimit);

		// * startPage : 페이지 하단에 보여질 페이징바의 
		/*
		 * startPage 구하기 - pageLimit, currentPage 영향을 받음
		 * 
		 * - 공식 구하기
		 * 단, pageLimit가 10이라는 가정하에 규칙을 구해보자
		 * 
		 * 만약에 pageLimit가 10이라는 가정하에
		 * startPage : 1 11 21 31 41 51 ...
		 * > n * 10 + 1
		 *  (n = 0 부터 시작하먄 10의 배수 + 1)
		 * 
		 * 만약에 pageLimit가 5라면..?
		 * 1 6 11 16 21 ...
		 * (n = 0 부터 시작하먄 5의 배수 + 1)
		 * 
		 * 하지만 실제 n을 구하는 규칙을 파약해야됨
		 * (0부터 시작하는 걸로 구현)
		 * 
		 * currentPage		startPage
		 * 1				1
		 * 5				1
		 * 10				1
		 * 11				11
		 * 15				11
		 * 19				11
		 * 20				11
		 * 21				21 
		 * 26				21
		 * 30				21
		 * ...
		 * > currentPage가 
		 *   1~10  사이일 경우 : startPage = 1  = n * pageLimit + 1	(n == 0)
		 *   11~20 사이일 경우 : startPage = 11 = n * pageLimit + 1	(n == 1)
		 *   21~30 사이일 경우 : startPage = 21 = n * pageLimit + 1	(n == 2)
		 *   31~40 사이일 경우 : startPage = 31 = n * pageLimit + 1	(n == 3)
		 *   ...
		 *   
		 * 최종적으로 n 을 구하기
		 * (currentPage- 1) / pageLimit = (1 - 1) / 10 = 0
		 * 						   		= (2 - 1) / 10 = 0
		 * 						   		= (4 - 1) / 10 = 0
		 * 						   		...
		 * 						   		= (9 - 1) / 10 = 0
		 * 						   		= (10  - 1) / 10 = 0
		 * 								------------------------
		 * 						   		= (11 - 1) / 10 = 1
		 * 						   		= (12 - 1) / 10 = 1
		 * 						   		...
		 * 						   		= (19 - 1) / 10 = 1
		 * 						   		= (20 - 1) / 10 = 1
		 * 즉, n = (currentPage - 1) / pageLimit;
		 * 
		 * 최종공식 합치기
		 * startPage =                   n           * pageLimit + 1;
		 * 			 = (currentPage - 1) / pageLimit * pageLimit + 1;
		 * 
		 */			
		int startPage = (currentPage - 1) / pageLimit * pageLimit + 1;
		
		// * endPage : 페이지 하단에 보여질 페이징바의 끝수
		/*
		 * endPage 구하기 - startPage, pageLimit의 영향을 받음
		 * 				  단, maxPage도 영향을 줌
		 * 
		 * - 공식 구하기
		 *   pageLimit가 10인 가정
		 * 
		 * startPage : 1  -> endPage = 10
		 * startPage : 11 -> endPage = 20
		 * startPage : 21 -> endPage = 30
		 * ...
		 * > 즉, endPage = startPage + pageLimit - 1;
		 * 
		 */
		
		int endPage = startPage + pageLimit - 1;
		// maxPage가 11, 17까지라면..?
		// > endPage도 11, 17이 되야함
		// 이 경우에는 maxPage가 endPage임
		if(endPage > maxPage) {
			
			endPage = maxPage;
		}
		/*
		System.out.println(listCount);
		System.out.println(currentPage);
		System.out.println(pageLimit);
		System.out.println(boardLimit);
		System.out.println(maxPage);
		System.out.println(startPage);
		System.out.println(endPage);
		*/
		PageInfo pi = new PageInfo(listCount, currentPage, pageLimit, boardLimit
                				 , maxPage, startPage, endPage);
		return pi;
	}
}
