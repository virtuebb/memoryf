/**
 * 팔로우 상태 변경 이벤트 유틸리티
 * 
 * 컴포넌트 간 팔로우 상태 동기화를 위한 커스텀 이벤트 시스템
 */

const FOLLOW_CHANGE_EVENT = 'memoryf:follow-change';

/**
 * 팔로우 상태 변경 이벤트 발행
 * @param {Object} params
 * @param {number} params.targetMemberNo - 팔로우 대상 회원번호
 * @param {number} params.actorMemberNo - 팔로우 행위자 회원번호
 * @param {'Y' | 'P' | null} params.status - 팔로우 상태 (Y: 승인, P: 대기, null: 해제)
 */
export function emitFollowChange({ targetMemberNo, actorMemberNo, status }) {
  if (typeof window === 'undefined') return;
  
  window.dispatchEvent(
    new CustomEvent(FOLLOW_CHANGE_EVENT, {
      detail: {
        targetMemberNo: targetMemberNo != null ? Number(targetMemberNo) : null,
        actorMemberNo: actorMemberNo != null ? Number(actorMemberNo) : null,
        status: status ?? null,
      },
    })
  );
}

/**
 * 팔로우 상태 변경 이벤트 구독
 * @param {Function} listener - 이벤트 리스너
 * @returns {Function} 구독 해제 함수
 */
export function onFollowChange(listener) {
  if (typeof window === 'undefined') return () => {};

  const handler = (event) => {
    listener?.(event?.detail);
  };

  window.addEventListener(FOLLOW_CHANGE_EVENT, handler);
  return () => window.removeEventListener(FOLLOW_CHANGE_EVENT, handler);
}
