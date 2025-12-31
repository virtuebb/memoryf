import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { getAccessToken } from '../../../utils/jwt';

/**
 * UserManagementPage - 회원 관리 페이지
 * 
 * 관리자가 회원 목록을 조회하고 관리하는 페이지예요!
 * 
 * 기능:
 * 1. 회원 목록 조회 (페이지네이션 지원)
 * 2. 회원 상세 조회
 * 3. 회원 탈퇴 처리 (확인 모달 필수)
 * 
 * TODO: 실제 API 연동 시 React Query 사용
 * - useQuery로 회원 목록 조회
 * - useMutation으로 회원 탈퇴 처리
 */
const UserManagementPage = () => {
  const navigate = useNavigate();
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // 실제로는 API에서 받아와요
  const pageSize = 10; // 한 페이지에 표시할 항목 수

  // 모달 상태
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: null
  });

  // 로딩 상태 (실제로는 React Query의 isLoading 사용)
  const [isLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  // 더미 데이터 (실제로는 API에서 가져와요)
  // TODO: const { data, isLoading } = useQuery(['users', currentPage], () => adminApi.getUsers(currentPage));
  // const users = [
  //   { id: 1, nickname: 'user001', email: 'user001@example.com', joinDate: '2024-01-15', status: '정상' },
  //   { id: 2, nickname: 'user002', email: 'user002@example.com', joinDate: '2024-01-20', status: '정상' },
  //   { id: 3, nickname: 'user003', email: 'user003@example.com', joinDate: '2024-02-01', status: '정지' },
  //   { id: 4, nickname: 'user004', email: 'user004@example.com', joinDate: '2024-02-10', status: '정상' },
  //   { id: 5, nickname: 'user005', email: 'user005@example.com', joinDate: '2024-02-15', status: '정상' },
  // ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const url = "http://localhost:8006/memoryf/admin/selectUsers";

    try {
      const response = await axios({
        url,
        method: "GET",
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      console.log("회원 정보 조회 성공");
      console.log(response.data);

      setUserList(response.data);
    } catch (error) {
      console.error("회원 정보 조회 실패", error);
      return null;
    }
  };
 

  // 회원 상세 페이지로 이동
  const handleViewDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // 탈퇴 모달 열기
  const handleDeleteClick = (userId, userName) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName
    });
  };

  // 탈퇴 확인
  const handleDeleteConfirm = async () => {
    
    const url = `http://localhost:8006/memoryf/admin/deleteUser/${deleteModal.userId}`;
    const method = "POST";

    try {

      const response = await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      console.log(response.data);
      alert(`${deleteModal.userName} 회원이 탈퇴 처리되었습니다.`);


    } catch(e) {

      console.error("회원 탈퇴 실패 : " + e);
      return null;

    }

    
    setDeleteModal({ isOpen: false, userId: null, userName: null });
  };

  // 탈퇴 취소
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: null });
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'memberId',
      label: '회원 ID',
      align: 'center'
    },
    {
      key: 'memberName',
      label: '회원 이름'
    },
    {
      key: 'memberNick',
      label: '닉네임'
    },
    {
      key: 'email',
      label: '이메일'
    },
    {
      key: 'createDate',
      label: '가입일',
      align: 'center'
    },
    {
      key: 'status',
      label: '상태',
      align: 'center',
      render: (row) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: row.status === 'Y' ? '#fee2e2' : '#d1fae5',
          color: row.status === 'Y' ? '#991b1b' : '#065f46'
        }}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: '관리',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {/* <button
            onClick={() => handleViewDetail(row.id)}
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
          </button> */}
          <button
            onClick={() => handleDeleteClick(row.memberId, row.memberName)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
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
            탈퇴
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* 페이지 헤더 */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            회원 관리
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            전체 회원 목록을 조회하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 통계 카드 (선택사항) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>전체 회원</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>1,234</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>정상 회원</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>1,200</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>정지 회원</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>34</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>오늘 가입</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>12</div>
        </div>
      </div>

      {/* 회원 목록 테이블 */}
      <DataTable
        columns={columns}
        data={userList}
        isLoading={isLoading}
        emptyMessage="등록된 회원이 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="회원 탈퇴 확인"
        message={`${deleteModal.userName} 회원을 정말 탈퇴 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="탈퇴 처리"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
};

export default UserManagementPage;
