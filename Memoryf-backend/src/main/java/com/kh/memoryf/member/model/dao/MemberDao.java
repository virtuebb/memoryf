package com.kh.memoryf.member.model.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.member.model.vo.Member;

@Repository
public class MemberDao {

	public int updateMemberNick(SqlSessionTemplate sqlSession, Member member) {
		return sqlSession.update("memberMapper.updateMemberNick", member);
	}

}
