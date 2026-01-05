import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * AdminSidebar - 관리자 페이지 좌측 사이드바 컴포넌트
 * 
 * 관리자 페이지의 메뉴 네비게이션을 담당하는 컴포넌트예요!
 * 
 * 메뉴 구성:
 * - 회원 관리: 회원 목록, 상세 조회, 탈퇴 관리
 * - 신고 관리: 피드/댓글/회원 신고 관리
 * - 결제 관리: 결제 내역 조회 및 관리
 * - 상품 관리: BGM 추가/수정/삭제
 */
const AdminSidebar = () => {
  // 메뉴 아이템 목록
  // 각 메뉴는 경로와 표시할 이름을 가지고 있어요
  const menuItems = [
    { path: '/admin', label: '대시보드', icon: '📊' },
    { path: '/admin/users', label: '회원 관리', icon: '👥' },
    { path: '/admin/reports', label: '신고 관리', icon: '🚨' },
    { path: '/admin/payments', label: '결제 관리', icon: '💳' },
    { path: '/admin/bgm', label: '상품 관리', icon: '🎵' },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1e293b', // 다크 블루 배경
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
    }}>
      {/* 로고/타이틀 영역 */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        🛡️ 관리자 페이지
      </div>

      {/* 메뉴 목록 */}
      <nav style={{
        flex: 1,
        padding: '16px 0',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'} // 대시보드는 정확히 일치할 때만 활성화
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '14px 20px',
              color: isActive ? '#ffffff' : '#cbd5e1',
              backgroundColor: isActive ? '#3b82f6' : 'transparent',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: isActive ? '600' : '400',
              transition: 'all 0.2s',
              borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
              cursor: 'pointer'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 하단 정보 영역 */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        <div>관리자 전용</div>
        <div style={{ marginTop: '4px' }}>v1.0.0</div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

