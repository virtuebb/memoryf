const FOLLOW_CHANGE_EVENT = 'memoryf:follow-change';

// status: 'Y' | 'P' | null
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

export function onFollowChange(listener) {
  if (typeof window === 'undefined') return () => {};

  const handler = (event) => {
    listener?.(event?.detail);
  };

  window.addEventListener(FOLLOW_CHANGE_EVENT, handler);
  return () => window.removeEventListener(FOLLOW_CHANGE_EVENT, handler);
}
