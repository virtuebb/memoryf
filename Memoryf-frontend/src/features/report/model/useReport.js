/**
 * 신고 기능 커스텀 훅
 */
import { useState, useCallback } from 'react';
import { reportFeed, reportComment } from '../api/reportApi';

/**
 * 신고 모달 및 신고 기능 훅
 */
export const useReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState(null); // 'FEED' | 'COMMENT'
  const [targetId, setTargetId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 피드 신고 모달 열기
   */
  const openFeedReport = useCallback((feedNo) => {
    setReportType('FEED');
    setTargetId(feedNo);
    setIsOpen(true);
    setError(null);
  }, []);

  /**
   * 댓글 신고 모달 열기
   */
  const openCommentReport = useCallback((commentNo) => {
    setReportType('COMMENT');
    setTargetId(commentNo);
    setIsOpen(true);
    setError(null);
  }, []);

  /**
   * 모달 닫기
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setReportType(null);
    setTargetId(null);
    setError(null);
  }, []);

  /**
   * 신고 제출
   * @param {number} memberNo - 신고자 회원번호
   * @param {string} reason - 신고 사유
   */
  const submitReport = useCallback(async (memberNo, reason) => {
    if (!targetId || !reportType) return;

    setIsLoading(true);
    setError(null);

    try {
      if (reportType === 'FEED') {
        await reportFeed(targetId, memberNo, reason);
      } else {
        await reportComment(targetId, memberNo, reason);
      }
      closeModal();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || '신고 처리 중 오류가 발생했습니다.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [targetId, reportType, closeModal]);

  return {
    isOpen,
    reportType,
    targetId,
    isLoading,
    error,
    openFeedReport,
    openCommentReport,
    closeModal,
    submitReport,
  };
};

export default useReport;

