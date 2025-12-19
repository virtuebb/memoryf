package com.kh.memoryf.member.model.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.member.model.vo.Member;

@Repository
public class MemberDao {

	public Integer selectMemberNoByNick(SqlSessionTemplate sqlSession, String memberNick) {
		return sqlSession.selectOne("memberMapper.selectMemberNoByNick", memberNick);
	}

	public int updateMemberNick(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.update("memberMapper.updateMemberNick", member);
	}

}
