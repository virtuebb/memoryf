import { useState, useEffect } from 'react';
import { fetchPaymentHistory } from '../../payment/api/paymentApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import '../css/PaymentSection.css';

function PaymentSection() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenMemberNo = getMemberNoFromToken();
  const memberNo = tokenMemberNo || localStorage.getItem('memberNo');

  const parseLocalHistory = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      console.error('로컬 결제 내역 파싱 실패', e);
      return [];
    }
  };

  useEffect(() => {
    if (memberNo) {
      loadHistory();
    }
  }, [memberNo]);

  const loadHistory = async () => {
    setLoading(true);
    let merged = [];

    try {
      const response = await fetchPaymentHistory(memberNo);
      if (response?.success && Array.isArray(response.data)) {
        merged = response.data;
      }
    } catch (error) {
      console.error('결제 내역 로드 실패(서버):', error);
    }

    try {
      // 로컬에 저장된 결제 내역(멜론 BGM 구매)을 병합 (회원별 저장 키 사용)
      const localHistory = parseLocalHistory(`localPaymentHistory_${memberNo}`);
      merged = [...merged, ...localHistory]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('로컬 결제 내역 병합 실패:', error);
    }

    setHistory(merged);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <div className="payment-section-header">
        <h2>결제 내역</h2>
        <p>결제한 상품 및 이용 내역을 확인할 수 있습니다.</p>
      </div>
      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : history.length === 0 ? (
        <div className="empty">결제 내역이 없습니다.</div>
      ) : (
        <div className="payment-history-list">
          {history.map((item, index) => (
            <div key={index} className="payment-item">
              <div className="payment-info">
                <div className="payment-desc">{item.description}</div>
                <div className="payment-date">{formatDate(item.date)}</div>
              </div>
              <div className={`payment-amount ${item.type === 'CHARGE' ? 'charge' : 'use'}`}>
                {item.type === 'CHARGE' ? '+' : '-'}{item.amount.toLocaleString()}P
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default PaymentSection;