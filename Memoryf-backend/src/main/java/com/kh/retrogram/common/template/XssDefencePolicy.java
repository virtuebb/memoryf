package com.kh.retrogram.common.template;

public class XssDefencePolicy {
	
	// 공통코드 작업
	public static String defence(String originText) {
		
		String changeText = originText;
		if (changeText == null) return null;

		// 먼저 &를 치환하여 이미 이스케이프된 시퀀스가 생기는 것을 방지
		changeText = changeText.replace("&", "&amp;");
		changeText = changeText.replace("<", "&lt;");
		changeText = changeText.replace(">", "&gt;");
		changeText = changeText.replace("\"", "&quot;");
		changeText = changeText.replace("'", "&apos;");
		// 추가적으로 스크립트나 이벤트 속성 우회 방지를 위해 괄호나 URL 스킴을 제거하지는 않음
		// 필요시 추가적인 필터를 적용하세요.

		return changeText;
	}
}
