import { useState, useEffect } from 'react';
import { chargePoint, fetchMemberPoint } from '../api/paymentApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import './PointChargePage.css';

const PointChargePage = () => {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 정보에서 회원 번호 가져오기
  const memberNo = getMemberNoFromToken();

  // 충전 금액 옵션
  const chargeAmounts = [
    { amount: 1000, label: '1,000원' },
    { amount: 3000, label: '3,000원' },
    { amount: 5000, label: '5,000원' },
    { amount: 10000, label: '10,000원' },
    { amount: 30000, label: '30,000원' },
    { amount: 50000, label: '50,000원' }
  ];

  useEffect(() => {
    loadCurrentPoint();
  }, []);

  // 현재 포인트 조회
  const loadCurrentPoint = async () => {
    try {
      const response = await fetchMemberPoint(memberNo);
      if (response.success) {
        setCurrentPoint(response.point);
      }
    } catch (error) {
      console.error('포인트 조회 실패:', error);
    }
  };

  // 포트원 결제 요청
  const requestPayment = async () => {
    if (!selectedAmount) {
      alert('충전할 금액을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    // 포트원 SDK 로드 확인
    if (!window.IMP) {
      alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
      return;
    }

    const IMP = window.IMP;
    const impCode = import.meta.env.VITE_PORTONE_IMP_CODE || 'imp00000000';
    console.log('Initializing PortOne with code:', impCode);
    IMP.init(impCode);

    const merchantUid = `charge_${Date.now()}_${memberNo}`;

    IMP.request_pay(
      {
        pg: 'kakaopay', // 카카오페이
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: `포인트 ${selectedAmount.toLocaleString()}원 충전`,
        amount: selectedAmount,
        buyer_name: '회원' + memberNo,
        buyer_tel: '010-0000-0000',
        buyer_email: 'test@test.com'
      },
      async (rsp) => {
        if (rsp.success) {
          // 결제 성공 시 서버에서 검증 후 포인트 충전
          try {
            const chargeData = {
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              amount: rsp.paid_amount
            };

            const result = await chargePoint(memberNo, chargeData);

            if (result.success) {
              alert(`${selectedAmount.toLocaleString()}원이 충전되었습니다!`);
              setCurrentPoint(result.currentPoint);
              setSelectedAmount(null);
            } else {
              alert('포인트 충전에 실패했습니다: ' + result.message);
            }
          } catch (error) {
            console.error('포인트 충전 처리 실패:', error);
            // 백엔드에서 보낸 에러 메시지 확인
            const errorMessage = error.response?.data?.message || error.message || '포인트 충전 처리 중 오류가 발생했습니다.';
            alert('포인트 충전 실패: ' + errorMessage);
          }
        } else {
          alert('결제에 실패했습니다: ' + rsp.error_msg);
        }
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="point-charge-page">
      <div className="point-charge-container">
        <h1 className="page-title">포인트 충전</h1>

        {/* 현재 포인트 표시 */}
        <div className="current-point-box">
          <span className="point-label">보유 포인트</span>
          <span className="point-value">{currentPoint.toLocaleString()}P</span>
        </div>

        {/* 충전 금액 선택 */}
        <div className="charge-amount-section">
          <h2 className="section-title">충전 금액 선택</h2>
          <div className="amount-grid">
            {chargeAmounts.map((item) => (
              <button
                key={item.amount}
                className={`amount-button ${selectedAmount === item.amount ? 'selected' : ''}`}
                onClick={() => setSelectedAmount(item.amount)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 충전 버튼 */}
        <div className="charge-button-section">
          {selectedAmount && (
            <div className="selected-info">
              <span>선택 금액: </span>
              <strong>{selectedAmount.toLocaleString()}원</strong>
            </div>
          )}
          <button
            className="charge-button"
            onClick={requestPayment}
            disabled={!selectedAmount || isLoading}
          >
            {isLoading ? '처리 중...' : '충전하기'}
          </button>
        </div>

        {/* 안내 사항 */}
        <div className="info-section">
          <h3>안내사항</h3>
          <ul>
            <li>포인트는 BGM 구매에 사용할 수 있습니다.</li>
            <li>현재 테스트 모드로 실제 결제가 이루어지지 않습니다.</li>
            <li>카카오페이 테스트 결제를 통해 포인트가 충전됩니다.</li>
            <li>충전된 포인트는 환불이 불가능합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PointChargePage;
