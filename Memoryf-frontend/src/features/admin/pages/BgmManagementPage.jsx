import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

/**
 * BgmManagementPage - BGM 상품 관리 페이지
 * 
 * 관리자가 BGM 상품을 추가, 수정, 삭제하는 페이지예요!
 * 
 * 기능:
 * 1. BGM 목록 조회
 * 2. BGM 추가 (제목, 가격, 음원 파일 업로드)
 * 3. BGM 수정
 * 4. BGM 삭제 (확인 모달 필수)
 * 5. 미리듣기 기능
 * 
 * TODO: 실제 API 연동 시 React Query 사용
 */
const BgmManagementPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  
  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBgm, setSelectedBgm] = useState(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    audioFile: null
  });

  // 더미 데이터
  const [bgms, setBgms] = useState([
    { id: 1, title: '편안한 카페 음악', price: 9900, registerDate: '2024-01-15', audioUrl: null },
    { id: 2, title: '업무 집중 BGM', price: 19900, registerDate: '2024-01-20', audioUrl: null },
    { id: 3, title: '휴식 시간 음악', price: 14900, registerDate: '2024-02-01', audioUrl: null },
  ]);

  // 추가 모달 열기
  const handleAddClick = () => {
    setFormData({ title: '', price: '', audioFile: null });
    setIsAddModalOpen(true);
  };

  // 수정 모달 열기
  const handleEditClick = (bgm) => {
    setSelectedBgm(bgm);
    setFormData({ 
      title: bgm.title, 
      price: bgm.price.toString(), 
      audioFile: null 
    });
    setIsEditModalOpen(true);
  };

  // 삭제 모달 열기
  const handleDeleteClick = (bgm) => {
    setSelectedBgm(bgm);
    setIsDeleteModalOpen(true);
  };

  // BGM 추가
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    // TODO: 실제 API 호출
    // const formDataToSend = new FormData();
    // formDataToSend.append('title', formData.title);
    // formDataToSend.append('price', formData.price);
    // formDataToSend.append('audioFile', formData.audioFile);
    // await adminApi.addBgm(formDataToSend);
    
    const newBgm = {
      id: bgms.length + 1,
      title: formData.title,
      price: parseInt(formData.price),
      registerDate: new Date().toISOString().split('T')[0],
      audioUrl: null
    };
    setBgms([...bgms, newBgm]);
    setIsAddModalOpen(false);
    alert('BGM이 추가되었습니다.');
  };

  // BGM 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // TODO: 실제 API 호출
    // await adminApi.updateBgm(selectedBgm.id, formData);
    
    setBgms(bgms.map(bgm => 
      bgm.id === selectedBgm.id 
        ? { ...bgm, title: formData.title, price: parseInt(formData.price) }
        : bgm
    ));
    setIsEditModalOpen(false);
    setSelectedBgm(null);
    alert('BGM이 수정되었습니다.');
  };

  // BGM 삭제
  const handleDeleteConfirm = async () => {
    // TODO: 실제 API 호출
    // await adminApi.deleteBgm(selectedBgm.id);
    
    setBgms(bgms.filter(bgm => bgm.id !== selectedBgm.id));
    setIsDeleteModalOpen(false);
    setSelectedBgm(null);
    alert('BGM이 삭제되었습니다.');
  };

  // 금액 포맷팅
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: 'id', label: 'BGM ID', align: 'center' },
    { key: 'title', label: '제목' },
    { 
      key: 'price', 
      label: '가격', 
      align: 'right',
      render: (row) => (
        <span style={{ fontWeight: '600', color: '#059669' }}>
          {formatAmount(row.price)}
        </span>
      )
    },
    { key: 'registerDate', label: '등록일', align: 'center' },
    {
      key: 'actions',
      label: '관리',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => alert('미리듣기 기능 (실제로는 오디오 플레이어 표시)')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            미리듣기
          </button>
          <button
            onClick={() => handleEditClick(row)}
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
            수정
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
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
            BGM 상품 관리
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            BGM 상품을 추가, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
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
          + BGM 추가
        </button>
      </div>

      {/* BGM 목록 테이블 */}
      <DataTable
        columns={columns}
        data={bgms}
        isLoading={false}
        emptyMessage="등록된 BGM이 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 추가 모달 */}
      {isAddModalOpen && (
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
        onClick={() => setIsAddModalOpen(false)}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              BGM 추가
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  가격 (원) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  음원 파일 *
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormData({ ...formData, audioFile: e.target.files[0] })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
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
        onClick={() => setIsEditModalOpen(false)}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              BGM 수정
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  가격 (원) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  음원 파일 (변경 시에만 선택)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormData({ ...formData, audioFile: e.target.files[0] })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="BGM 삭제 확인"
        message={`"${selectedBgm?.title}" BGM을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedBgm(null);
        }}
        variant="danger"
      />
    </div>
  );
};

export default BgmManagementPage;

