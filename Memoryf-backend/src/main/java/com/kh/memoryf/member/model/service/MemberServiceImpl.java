package com.kh.memoryf.member.model.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.memoryf.member.model.dao.MemberDao;
import com.kh.memoryf.member.model.vo.AccountHistory;
import com.kh.memoryf.member.model.vo.Member;
import com.kh.memoryf.follow.model.dao.FollowDao;

@Service
public class MemberServiceImpl implements MemberService {
	
	@Autowired
	@SuppressWarnings("unused")
	private MemberDao memberDao;

	@Autowired
	@SuppressWarnings("unused")
	private SqlSessionTemplate sqlSession;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private FollowDao followDao;
	
	@Override
	public ArrayList<Member> selectMemberList() {
		return null;
	}

	@Override
	public Member selectMember(String memberId) {
		return null;
	}

	@Override
	public Member selectMember(int memberNo) {
		return memberDao.selectMember(sqlSession, memberNo);
	}

	@Override
	public int updateMember(Member m) {
		return 0;
	}

	@Override
	public int deleteMember(int memberNo, String memberPwd) {
		Member m = memberDao.selectMember(sqlSession, memberNo);
		if(m == null) return 0;
		
		if(!bCryptPasswordEncoder.matches(memberPwd, m.getMemberPwd())) {
			return -1;
		}
		
		// 탈퇴 전에 모든 팔로우 관계 삭제
		followDao.deleteAllFollowsByMember(sqlSession, memberNo);
		
		return memberDao.deleteMember(sqlSession, memberNo);
	}

	@Override
	public int updatePwd(int memberNo, String oldPwd, String newPwd) {
		Member m = memberDao.selectMember(sqlSession, memberNo);
		if(m == null) return 0;
		
		if(!bCryptPasswordEncoder.matches(oldPwd, m.getMemberPwd())) {
			return -1;
		}
		
		m.setMemberPwd(bCryptPasswordEncoder.encode(newPwd));
		int result = memberDao.updatePwd(sqlSession, m);
		
		if(result > 0) {
			AccountHistory history = new AccountHistory();
			history.setMemberNo(memberNo);
			history.setEventType("PASSWORD");
			history.setEventDesc("비밀번호를 변경했습니다.");
			memberDao.insertAccountHistory(sqlSession, history);
		}
		
		return result;
	}

	@Override
	public int updateEmail(int memberNo, String email) {
		Member m = new Member();
		m.setMemberNo(memberNo);
		m.setEmail(email);
		
		int result = memberDao.updateEmail(sqlSession, m);
		
		if(result > 0) {
			AccountHistory history = new AccountHistory();
			history.setMemberNo(memberNo);
			history.setEventType("EMAIL");
			history.setEventDesc("이메일을 변경했습니다.");
			memberDao.insertAccountHistory(sqlSession, history);
		}
		
		return result;
	}

	@Override
	public int updatePhone(int memberNo, String phone) {
		Member m = new Member();
		m.setMemberNo(memberNo);
		m.setPhone(phone);
		
		int result = memberDao.updatePhone(sqlSession, m);
		
		if(result > 0) {
			AccountHistory history = new AccountHistory();
			history.setMemberNo(memberNo);
			history.setEventType("PHONE");
			history.setEventDesc("전화번호를 변경했습니다.");
			memberDao.insertAccountHistory(sqlSession, history);
		}
		
		return result;
	}

	@Override
	public int updateMemberNick(Member m) {
		int result = memberDao.updateMemberNick(sqlSession, m);
		if(result > 0) {
			AccountHistory history = new AccountHistory();
			history.setMemberNo(m.getMemberNo());
			history.setEventType("NICKNAME");
			history.setEventDesc("닉네임을 '" + m.getMemberNick() + "'(으)로 변경했습니다.");
			memberDao.insertAccountHistory(sqlSession, history);
		}
		return result;
	}

	@Override
	public Integer selectMemberNoByNick(String memberNick) {
		return memberDao.selectMemberNoByNick(sqlSession, memberNick);
	}

	@Override
	public int insertAccountHistory(AccountHistory history) {
		return memberDao.insertAccountHistory(sqlSession, history);
	}

	@Override
	public List<AccountHistory> selectAccountHistoryList(Map<String, Object> params) {
		return memberDao.selectAccountHistoryList(sqlSession, params);
	}

}
