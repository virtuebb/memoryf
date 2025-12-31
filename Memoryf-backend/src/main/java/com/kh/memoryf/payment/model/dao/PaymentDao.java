package com.kh.memoryf.payment.model.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.kh.memoryf.payment.model.vo.Bgm;
import com.kh.memoryf.payment.model.vo.Payment;
import com.kh.memoryf.payment.model.vo.PointCharge;

@Repository
public class PaymentDao {
	
	// 포인트 충전 내역 삽입
	public int insertPointCharge(SqlSession sqlSession, PointCharge pointCharge) {
		return sqlSession.insert("paymentMapper.insertPointCharge", pointCharge);
	}
	
	// 회원 포인트 업데이트
	public int updateMemberPoint(SqlSession sqlSession, int memberNo, int amount) {
		return sqlSession.update("paymentMapper.updateMemberPoint", 
			java.util.Map.of("memberNo", memberNo, "amount", amount));
	}
	
	// BGM 전체 목록 조회
	public List<Bgm> selectAllBgmList(SqlSession sqlSession) {
		return sqlSession.selectList("paymentMapper.selectAllBgmList");
	}
	
	// 회원이 구매한 BGM 목록 조회
	public List<Bgm> selectPurchasedBgmList(SqlSession sqlSession, int memberNo) {
		return sqlSession.selectList("paymentMapper.selectPurchasedBgmList", memberNo);
	}
	
	// BGM 상세 조회
	public Bgm selectBgmByNo(SqlSession sqlSession, int bgmNo) {
		return sqlSession.selectOne("paymentMapper.selectBgmByNo", bgmNo);
	}
	
	// 구매 여부 확인
	public int checkPurchased(SqlSession sqlSession, int memberNo, int bgmNo) {
		return sqlSession.selectOne("paymentMapper.checkPurchased", 
			java.util.Map.of("memberNo", memberNo, "bgmNo", bgmNo));
	}
	
	// BGM 구매 내역 삽입
	public int insertBgmPayment(SqlSession sqlSession, Payment payment) {
		return sqlSession.insert("paymentMapper.insertBgmPayment", payment);
	}
	
	// 회원 포인트 차감
	public int deductMemberPoint(SqlSession sqlSession, int memberNo, int amount) {
		return sqlSession.update("paymentMapper.deductMemberPoint", 
			java.util.Map.of("memberNo", memberNo, "amount", amount));
	}
	
	// 회원 포인트 조회
	public int selectMemberPoint(SqlSession sqlSession, int memberNo) {
		return sqlSession.selectOne("paymentMapper.selectMemberPoint", memberNo);
	}
	
	// 결제 내역 조회
	public List<com.kh.memoryf.payment.model.dto.PaymentHistoryDto> selectPaymentHistory(SqlSession sqlSession, int memberNo) {
		return sqlSession.selectList("paymentMapper.selectPaymentHistory", memberNo);
	}
}

