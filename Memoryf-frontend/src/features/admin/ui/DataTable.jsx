import React from 'react';

/**
 * DataTable - 데이터 테이블 컴포넌트
 * 
 * 관리자 페이지에서 목록을 표시할 때 사용하는 테이블 컴포넌트예요!
 * 
 * 기능:
 * - 컬럼 헤더 표시
 * - 데이터 행 표시
 * - 로딩 상태 표시
 * - 빈 데이터 상태 표시
 * 
 * @param {Array} columns - 테이블 컬럼 정의 [{ key, label, render }]
 * @param {Array} data - 테이블에 표시할 데이터 배열
 * @param {boolean} isLoading - 로딩 중인지 여부
 * @param {string} emptyMessage - 데이터가 없을 때 표시할 메시지
 */
const DataTable = ({ 
  columns = [], 
  data = [], 
  isLoading = false,
  emptyMessage = '데이터가 없습니다.'
}) => {
  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>⏳</div>
        <div>데이터를 불러오는 중...</div>
      </div>
    );
  }

  // 데이터가 없을 때 표시할 내용
  if (data.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>📭</div>
        <div>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        {/* 테이블 헤더 */}
        <thead>
          <tr style={{
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: '12px 16px',
                  textAlign: column.align || 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              style={{
                borderBottom: '1px solid #e5e7eb',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: '12px 16px',
                    textAlign: column.align || 'left',
                    fontSize: '14px',
                    color: '#1f2937'
                  }}
                >
                  {/* render 함수가 있으면 render 함수 사용, 없으면 row[column.key] 사용 */}
                  {column.render
                    ? column.render(row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

