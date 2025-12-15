import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

/**
 * PaymentManagementPage - 결제 관리 페이지
 * 
 * 관리자가 결제 내역을 조회하고 관리하는 페이지예요!
 * 
 * 기능:
 * 1. 결제 목록 조회 (페이지네이션 지원)
 * 2. 결제 상세 조회
 * 3. 결제 정보는 읽기 전용 (환불은 별도 프로세스)
 * 
 * TODO: 실제 API 연동 시 React Query 사용
 */
const PaymentManagementPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null); // 상세보기용

  // 더미 데이터
  const payments = [
    { 
      id: 1, 
      userId: 101, 
      productName: 'BGM 패키지 A', 
      amount: 9900, 
      method: '카드', 
      paymentDate: '2024-03-01 14:30:00',
      status: '완료',
      refundStatus: '없음'
    },
    { 
      id: 2, 
      userId: 102, 
      productName: 'BGM 패키지 B', 
      amount: 19900, 
      method: '카카오페이', 
      paymentDate: '2024-03-02 10:15:00',
      status: '완료',
      refundStatus: '없음'
    },
    { 
      id: 3, 
      userId: 103, 
      productName: 'BGM 패키지 A', 
      amount: 9900, 
      method: '카드', 
      paymentDate: '2024-03-03 16:45:00',
      status: '완료',
      refundStatus: '환불 완료'
    },
  ];

  // 결제 상세보기
  const handleViewDetail = (payment) => {
    setSelectedPayment(payment);
  };

  // 상세보기 닫기
  const handleCloseDetail = () => {
    setSelectedPayment(null);
  };

  // 금액 포맷팅 (천 단위 구분)
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: 'id', label: '결제 ID', align: 'center' },
    { key: 'userId', label: '회원 ID', align: 'center' },
    { key: 'productName', label: '결제 상품명' },
    { 
      key: 'amount', 
      label: '결제 금액', 
      align: 'right',
      render: (row) => (
        <span style={{ fontWeight: '600', color: '#059669' }}>
          {formatAmount(row.amount)}
        </span>
      )
    },
    { key: 'method', label: '결제 수단', align: 'center' },
    { key: 'paymentDate', label: '결제 일시', align: 'center' },
    {
      key: 'refundStatus',
      label: '환불 여부',
      align: 'center',
      render: (row) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: row.refundStatus === '없음' ? '#d1fae5' : '#fee2e2',
          color: row.refundStatus === '없음' ? '#065f46' : '#991b1b'
        }}>
          {row.refundStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: '관리',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => handleViewDetail(row)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          상세
        </button>
      )
    }
  ];

  return (
    <div>
      {/* 페이지 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          결제 관리
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          전체 결제 내역을 조회하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>오늘 결제</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>₩1,234,000</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>이번 달 결제</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>₩12,345,000</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>전체 결제 건수</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>1,234건</div>
        </div>
      </div>

      {/* 결제 목록 테이블 */}
      <DataTable
        columns={columns}
        data={payments}
        isLoading={false}
        emptyMessage="결제 내역이 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 결제 상세 모달 */}
      {selectedPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={handleCloseDetail}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                결제 상세 정보
              </h2>
              <button
                onClick={handleCloseDetail}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* 결제 정보 표시 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>결제 ID</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>회원 ID</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.userId}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>상품명</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.productName}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>결제 금액</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  {formatAmount(selectedPayment.amount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>결제 수단</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.method}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>결제 일시</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.paymentDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>결제 상태</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.status}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>환불 여부</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPayment.refundStatus}</div>
              </div>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              💡 환불 처리는 별도 프로세스를 통해 진행됩니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagementPage;

