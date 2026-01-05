import React from 'react';

/**
 * ConfirmModal - 확인 모달 컴포넌트
 * 
 * 삭제, 정지, 탈퇴 등 중요한 작업 전에 확인을 받는 모달이에요!
 * 
 * 사용 예시:
 * - 회원 탈퇴 확인
 * - 신고된 콘텐츠 삭제 확인
 * - 회원 정지 확인
 * - BGM 삭제 확인
 * 
 * @param {boolean} isOpen - 모달이 열려있는지 여부
 * @param {string} title - 모달 제목
 * @param {string} message - 확인 메시지
 * @param {string} confirmText - 확인 버튼 텍스트 (기본: "확인")
 * @param {string} cancelText - 취소 버튼 텍스트 (기본: "취소")
 * @param {Function} onConfirm - 확인 버튼 클릭 시 실행할 함수
 * @param {Function} onCancel - 취소 버튼 클릭 시 실행할 함수
 */
const ConfirmModal = ({
  isOpen,
  title = '확인',
  message = '이 작업을 진행하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'danger' // 'danger' (빨간색) 또는 'warning' (노란색)
}) => {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않아요
  if (!isOpen) return null;

  // 확인 버튼 색상 (variant에 따라 다름)
  const confirmButtonColor = variant === 'danger' ? '#ef4444' : '#f59e0b';
  const confirmButtonHoverColor = variant === 'danger' ? '#dc2626' : '#d97706';

  return (
    // 모달 배경 (오버레이)
    <div
      style={{
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
      onClick={onCancel} // 배경 클릭 시 닫기
    >
      {/* 모달 컨텐츠 */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
      >
        {/* 제목 */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          {title}
        </h2>

        {/* 메시지 */}
        <p style={{
          fontSize: '15px',
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* 버튼 영역 */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          {/* 취소 버튼 */}
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            {cancelText}
          </button>

          {/* 확인 버튼 */}
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              backgroundColor: confirmButtonColor,
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = confirmButtonHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = confirmButtonColor;
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

