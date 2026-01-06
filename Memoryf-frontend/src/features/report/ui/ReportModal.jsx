/**
 * 신고 모달 컴포넌트
 */
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { getMemberNoFromToken } from '../../../shared/lib';
import './ReportModal.css';

// 신고 사유 옵션
const REPORT_REASONS = [
  { value: 'SPAM', label: '스팸/광고' },
  { value: 'INAPPROPRIATE', label: '부적절한 콘텐츠' },
  { value: 'HARASSMENT', label: '괴롭힘/혐오 발언' },
  { value: 'VIOLENCE', label: '폭력적인 내용' },
  { value: 'COPYRIGHT', label: '저작권 침해' },
  { value: 'OTHER', label: '기타' },
];

export function ReportModal({
  isOpen,
  reportType,
  onClose,
  onSubmit,
  isLoading,
  error,
}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const memberNo = getMemberNoFromToken();
    if (!memberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    const reason = selectedReason === 'OTHER' 
      ? customReason 
      : REPORT_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;

    if (!reason.trim()) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    const success = await onSubmit(memberNo, reason);
    if (success) {
      alert('신고가 접수되었습니다.');
      setSelectedReason('');
      setCustomReason('');
    }
  };

  const typeLabel = reportType === 'FEED' ? '게시물' : '댓글';

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <div className="report-modal-title">
            <AlertTriangle size={20} />
            <span>{typeLabel} 신고</span>
          </div>
          <button className="report-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-modal-form">
          <p className="report-modal-description">
            이 {typeLabel}을(를) 신고하는 이유를 선택해주세요.
          </p>

          <div className="report-reasons">
            {REPORT_REASONS.map((reason) => (
              <label key={reason.value} className="report-reason-item">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <span>{reason.label}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'OTHER' && (
            <textarea
              className="report-custom-reason"
              placeholder="신고 사유를 입력해주세요..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              maxLength={200}
            />
          )}

          {error && <p className="report-error">{error}</p>}

          <div className="report-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              취소
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!selectedReason || isLoading}
            >
              {isLoading ? '처리 중...' : '신고하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;

