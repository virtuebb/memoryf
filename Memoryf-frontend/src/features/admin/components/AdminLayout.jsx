import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * AdminLayout - 관리자 페이지 레이아웃 컴포넌트
 * 
 * 관리자 페이지의 전체 구조를 담당하는 컴포넌트예요!
 * 좌측 사이드바 + 상단 헤더 + 메인 콘텐츠 영역으로 구성돼요.
 * 
 * 구조:
 * - 좌측: AdminSidebar (메뉴 네비게이션)
 * - 상단: AdminHeader (헤더 정보)
 * - 메인: Outlet (각 페이지 내용이 여기에 렌더링됨)
 */
const AdminLayout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 좌측 사이드바 */}
      <AdminSidebar />
      
      {/* 메인 콘텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 상단 헤더 */}
        <AdminHeader />
        
        {/* 페이지 콘텐츠 영역 (스크롤 가능) */}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#ffffff'
        }}>
          {/* 각 페이지 컴포넌트가 여기에 렌더링돼요 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

