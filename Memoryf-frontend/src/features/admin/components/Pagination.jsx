import React from 'react';

/**
 * Pagination - 페이지네이션 컴포넌트
 * 
 * 목록이 많을 때 페이지를 나눠서 보여주는 컴포넌트예요!
 * 
 * 기능:
 * - 이전/다음 페이지 이동
 * - 특정 페이지로 직접 이동
 * - 현재 페이지 하이라이트
 * 
 * @param {number} currentPage - 현재 페이지 번호 (1부터 시작)
 * @param {number} totalPages - 전체 페이지 수
 * @param {Function} onPageChange - 페이지 변경 시 호출되는 함수 (pageNumber를 인자로 받음)
 */
const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  // 페이지 번호 배열 생성 (최대 5개까지 표시)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // 최대 표시할 페이지 수
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 2개씩 표시
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // 시작 부분 조정
      if (end - start < maxVisible - 1) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisible - 1);
        } else {
          start = Math.max(1, end - maxVisible + 1);
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 이전 페이지로 이동
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 특정 페이지로 이동
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '24px'
    }}>
      {/* 이전 버튼 */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
          color: currentPage === 1 ? '#9ca3af' : '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        이전
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          style={{
            padding: '8px 12px',
            minWidth: '40px',
            backgroundColor: page === currentPage ? '#3b82f6' : '#ffffff',
            color: page === currentPage ? '#ffffff' : '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: page === currentPage ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }
          }}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
          color: currentPage === totalPages ? '#9ca3af' : '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;

