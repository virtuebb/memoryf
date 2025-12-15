import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

/**
 * ReportManagementPage - 신고 관리 페이지
 * 
 * 관리자가 신고된 콘텐츠와 회원을 관리하는 페이지예요!
 * 
 * 기능:
 * 1. 신고된 피드 관리 (목록, 상세, 삭제)
 * 2. 신고된 댓글 관리 (목록, 삭제)
 * 3. 신고된 회원 관리 (목록, 정지)
 * 
 * 탭 구조로 3가지 신고 유형을 관리해요!
 */
const ReportManagementPage = () => {
  // 현재 선택된 탭 (feed, comment, user)
  const [activeTab, setActiveTab] = useState('feed');
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);

  // 모달 상태
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'feed', 'comment'
    id: null,
    title: null
  });

  const [suspendModal, setSuspendModal] = useState({
    isOpen: false,
    userId: null,
    userName: null,
    suspendPeriod: '3' // 3일, 7일, 30일, permanent
  });

  // 더미 데이터
  const reportedFeeds = [
    { id: 1, author: 'user001', reason: '욕설/비방', reportCount: 5, content: '부적절한 내용...' },
    { id: 2, author: 'user002', reason: '스팸', reportCount: 3, content: '스팸 게시물...' },
    { id: 3, author: 'user003', reason: '음란물', reportCount: 8, content: '부적절한 이미지...' },
  ];

  const reportedComments = [
    { id: 1, author: 'user004', content: '부적절한 댓글 내용입니다...', reason: '욕설/비방' },
    { id: 2, author: 'user005', content: '스팸 댓글입니다...', reason: '스팸' },
  ];

  const reportedUsers = [
    { id: 1, nickname: 'user006', reason: '반복적인 신고', reportCount: 15 },
    { id: 2, nickname: 'user007', reason: '부적절한 행동', reportCount: 8 },
  ];

  // 탭 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경 시 페이지 초기화
  };

  // 피드/댓글 삭제 모달 열기
  const handleDeleteClick = (type, id, title) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      title
    });
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    // TODO: 실제 API 호출
    // await adminApi.deleteReportedContent(deleteModal.type, deleteModal.id);
    console.log(`${deleteModal.type} 삭제:`, deleteModal.id);
    alert('삭제 처리되었습니다.');
    setDeleteModal({ isOpen: false, type: null, id: null, title: null });
  };

  // 회원 정지 모달 열기
  const handleSuspendClick = (userId, userName) => {
    setSuspendModal({
      isOpen: true,
      userId,
      userName,
      suspendPeriod: '3'
    });
  };

  // 정지 확인
  const handleSuspendConfirm = async () => {
    // TODO: 실제 API 호출
    // await adminApi.suspendUser(suspendModal.userId, suspendModal.suspendPeriod);
    const periodText = suspendModal.suspendPeriod === 'permanent' 
      ? '영구' 
      : `${suspendModal.suspendPeriod}일`;
    console.log(`회원 정지: ${suspendModal.userId}, 기간: ${periodText}`);
    alert(`${suspendModal.userName} 회원이 ${periodText} 정지 처리되었습니다.`);
    setSuspendModal({ isOpen: false, userId: null, userName: null, suspendPeriod: '3' });
  };

  // 피드 테이블 컬럼
  const feedColumns = [
    { key: 'id', label: '피드 ID', align: 'center' },
    { key: 'author', label: '작성자' },
    { key: 'reason', label: '신고 사유' },
    { 
      key: 'reportCount', 
      label: '신고 횟수', 
      align: 'center',
      render: (row) => (
        <span style={{
          padding: '4px 8px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {row.reportCount}회
        </span>
      )
    },
    {
      key: 'actions',
      label: '관리',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => alert(`피드 ${row.id} 상세보기`)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            상세
          </button>
          <button
            onClick={() => handleDeleteClick('feed', row.id, `피드 ${row.id}`)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            삭제
          </button>
        </div>
      )
    }
  ];

  // 댓글 테이블 컬럼
  const commentColumns = [
    { key: 'id', label: '댓글 ID', align: 'center' },
    { key: 'author', label: '작성자' },
    { 
      key: 'content', 
      label: '댓글 내용',
      render: (row) => (
        <div style={{
          maxWidth: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {row.content}
        </div>
      )
    },
    { key: 'reason', label: '신고 사유' },
    {
      key: 'actions',
      label: '관리',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => handleDeleteClick('comment', row.id, `댓글 ${row.id}`)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          삭제
        </button>
      )
    }
  ];

  // 회원 테이블 컬럼
  const userColumns = [
    { key: 'id', label: '회원 ID', align: 'center' },
    { key: 'nickname', label: '닉네임' },
    { key: 'reason', label: '신고 사유' },
    { 
      key: 'reportCount', 
      label: '누적 신고 횟수', 
      align: 'center',
      render: (row) => (
        <span style={{
          padding: '4px 8px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {row.reportCount}회
        </span>
      )
    },
    {
      key: 'actions',
      label: '관리',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => handleSuspendClick(row.id, row.nickname)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          정지
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
          신고 관리
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          신고된 피드, 댓글, 회원을 관리할 수 있습니다.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {[
          { key: 'feed', label: '신고된 피드', count: reportedFeeds.length },
          { key: 'comment', label: '신고된 댓글', count: reportedComments.length },
          { key: 'user', label: '신고된 회원', count: reportedUsers.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
              fontSize: '15px',
              fontWeight: activeTab === tab.key ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 탭별 콘텐츠 */}
      {activeTab === 'feed' && (
        <>
          <DataTable
            columns={feedColumns}
            data={reportedFeeds}
            isLoading={false}
            emptyMessage="신고된 피드가 없습니다."
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {activeTab === 'comment' && (
        <>
          <DataTable
            columns={commentColumns}
            data={reportedComments}
            isLoading={false}
            emptyMessage="신고된 댓글이 없습니다."
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {activeTab === 'user' && (
        <>
          <DataTable
            columns={userColumns}
            data={reportedUsers}
            isLoading={false}
            emptyMessage="신고된 회원이 없습니다."
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="삭제 확인"
        message={`${deleteModal.title}을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, type: null, id: null, title: null })}
        variant="danger"
      />

      {/* 정지 확인 모달 (커스텀) */}
      {suspendModal.isOpen && (
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
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
              회원 정지 확인
            </h2>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '16px' }}>
              {suspendModal.userName} 회원을 정지 처리하시겠습니까?
            </p>
            
            {/* 정지 기간 선택 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                정지 기간
              </label>
              <select
                value={suspendModal.suspendPeriod}
                onChange={(e) => setSuspendModal({ ...suspendModal, suspendPeriod: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="3">3일</option>
                <option value="7">7일</option>
                <option value="30">30일</option>
                <option value="permanent">영구 정지</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setSuspendModal({ isOpen: false, userId: null, userName: null, suspendPeriod: '3' })}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleSuspendConfirm}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                정지 처리
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagementPage;

