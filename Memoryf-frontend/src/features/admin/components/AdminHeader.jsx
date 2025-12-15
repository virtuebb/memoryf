import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AdminHeader - 관리자 페이지 상단 헤더 컴포넌트
 * 
 * 관리자 페이지의 상단 헤더를 담당하는 컴포넌트예요!
 * 
 * 기능:
 * - 현재 페이지 제목 표시
 * - 관리자 정보 표시
 * - 로그아웃 버튼
 */
const AdminHeader = () => {
  const navigate = useNavigate();

  // 로그아웃 함수 (실제로는 API 호출 후 로그아웃 처리)
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // TODO: 실제 로그아웃 API 호출
      // await adminApi.logout();
      // localStorage.removeItem('adminToken');
      navigate('/login');
    }
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* 좌측: 페이지 제목 (동적으로 변경 가능) */}
      <div style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1f2937'
      }}>
        관리자 대시보드
      </div>

      {/* 우측: 관리자 정보 및 로그아웃 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* 관리자 정보 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              관리자
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              admin@example.com
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

