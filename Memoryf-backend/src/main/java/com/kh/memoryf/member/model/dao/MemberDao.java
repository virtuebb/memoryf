package com.kh.memoryf.member.model.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.member.model.vo.AccountHistory;
import com.kh.memoryf.member.model.vo.Member;

@Repository
public class MemberDao {

	public Integer selectMemberNoByNick(SqlSessionTemplate sqlSession, String memberNick) {
		return sqlSession.selectOne("memberMapper.selectMemberNoByNick", memberNick);
	}

	public int updateMemberNick(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.update("memberMapper.updateMemberNick", member);
	}

	public Member selectMember(SqlSessionTemplate sqlSession, int memberNo) {
		return sqlSession.selectOne("memberMapper.selectMember", memberNo);
	}

	public int updatePwd(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.update("memberMapper.updatePwd", member);
	}

	public int updateEmail(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.update("memberMapper.updateEmail", member);
	}

	public int updatePhone(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.update("memberMapper.updatePhone", member);
	}

	public int deleteMember(SqlSessionTemplate sqlSession, int memberNo) {
		return sqlSession.update("memberMapper.deleteMember", memberNo);
	}

	public int insertAccountHistory(SqlSessionTemplate sqlSession, AccountHistory history) {
		return sqlSession.insert("accountHistoryMapper.insertAccountHistory", history);
	}

	public List<AccountHistory> selectAccountHistoryList(SqlSessionTemplate sqlSession, Map<String, Object> params) {
		return sqlSession.selectList("accountHistoryMapper.selectAccountHistoryList", params);
	}

}
