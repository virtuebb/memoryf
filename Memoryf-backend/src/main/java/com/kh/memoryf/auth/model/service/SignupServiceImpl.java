package com.kh.memoryf.auth.model.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.memoryf.auth.model.dao.SignupDao;
import com.kh.memoryf.auth.model.vo.Signup;
import com.kh.memoryf.member.model.service.MemberService;
import com.kh.memoryf.member.model.vo.AccountHistory;

@Service
public class SignupServiceImpl implements SignupService {
	
	@Autowired
	private SignupDao signupDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private MemberService memberService;

	// 회원추가
	@Override
	@Transactional
	public int insertMember(Signup signup) {
		try {
			// 검증 필요한 것들 불러오기
			String memberId = signup.getMemberId();
			String memberPwd = signup.getMemberPwd();
			String memberName = signup.getMemberName();
			String memberNick = signup.getMemberNick();
			String email = signup.getEmail();
			
			// 공백 제거
			if(memberId == null || memberPwd == null || memberName == null || memberNick == null
				|| email == null
				|| memberId.trim().isEmpty()
				|| memberPwd.trim().isEmpty()
				|| memberName.trim().isEmpty()
				|| memberNick.trim().isEmpty()
				|| email.trim().isEmpty()) {
				System.out.println("[회원가입 실패] 필수 항목이 비어있습니다.");
				return 0;
			}
			
			// 아이디, 비번, 닉네임 형식 설정
			if(!memberId.matches("^[a-z0-9]{4,12}$")
				|| !memberPwd.matches("^(?=.*[A-Za-z])(?=.*\\d).{8,16}$")
				|| !memberNick.matches("^[A-Za-z0-9가-힣_.]{2,10}$")) {
				System.out.println("[회원가입 실패] 형식 검증 실패");
				return 0;
			}
			
			// 아이디 중복확인 체크
			int count = signupDao.checkMemberId(sqlSession, memberId);
			if(count > 0) {
				System.out.println("[회원가입 실패] 아이디 중복: " + memberId);
				return 0;
			}
			
			// 닉네임 중복확인 체크 (TB_MEMBER.MEMBER_NICK UNIQUE)
			int nickCount = signupDao.checkMemberNick(sqlSession, memberNick);
			if (nickCount > 0) {
				System.out.println("[회원가입 실패] 닉네임 중복: " + memberNick);
				return 0;
			}
			
			// 이메일 중복확인 체크 (TB_MEMBER.EMAIL UNIQUE)
			int emailCount = signupDao.checkEmail(sqlSession, email);
			if (emailCount > 0) {
				System.out.println("[회원가입 실패] 이메일 중복: " + email);
				return 0;
			}
			
			// 암호화
			signup.setMemberPwd(bCryptPasswordEncoder.encode(memberPwd));
			
			int result = signupDao.insertMember(sqlSession, signup);
			
			if(result > 0) {
				System.out.println("[회원가입 성공] 회원번호: " + signup.getMemberNo());
				
				// 홈 생성 (이미 존재하면 생성하지 않음)
				try {
					int homeExists = signupDao.checkHomeExists(sqlSession, signup.getMemberNo());
					if (homeExists == 0) {
						signupDao.insertHome(sqlSession, signup);
						System.out.println("[회원가입 성공] 홈 생성 완료");
					} else {
						System.out.println("[회원가입 경고] 홈이 이미 존재합니다. (회원번호: " + signup.getMemberNo() + ")");
					}
				} catch (Exception e) {
					System.out.println("[회원가입 실패] 홈 생성 오류: " + e.getMessage());
					e.printStackTrace();
					throw e; // 트랜잭션 롤백
				}
				
				// 계정 생성 이력 저장
				try {
					AccountHistory history = new AccountHistory();
					history.setMemberNo(signup.getMemberNo());
					history.setEventType("CREATE");
					history.setEventDesc("계정을 생성했습니다.");
					memberService.insertAccountHistory(history);
					System.out.println("[회원가입 성공] 계정 이력 저장 완료");
				} catch (Exception e) {
					System.out.println("[회원가입 경고] 계정 이력 저장 실패 (무시): " + e.getMessage());
					// 계정 이력 저장 실패는 치명적이지 않으므로 무시
				}
			} else {
				System.out.println("[회원가입 실패] insertMember 결과: " + result);
			}
			
			return result;
		} catch (Exception e) {
			System.out.println("[회원가입 실패] 예외 발생: " + e.getMessage());
			e.printStackTrace();
			throw e; // 트랜잭션 롤백
		}
	}

	// 아이디 중복 체크
	@Override
	@Transactional
	public int checkMemberId(String memberId) {
		
		if(memberId == null || memberId.trim().isEmpty()) {
			
			return -1;
			
		} else if(!memberId.matches("^[a-z0-9]{4,12}$")) {
			
			return -1;
		}
		
		return signupDao.checkMemberId(sqlSession, memberId);
	}

	// 닉네임 중복 체크
	@Override
	@Transactional
	public int checkMemberNick(String memberNick) {
		
		if(memberNick == null || memberNick.trim().isEmpty()) {
			
			return -1;
			
		} else if(!memberNick.matches("^[A-Za-z0-9가-힣_.]{2,10}$")) {
			
			return -1;
		}
		
		return signupDao.checkMemberNick(sqlSession, memberNick);
	}
	
}
