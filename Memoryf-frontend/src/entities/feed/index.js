/**
 * 피드 엔티티 Public API
 * 
 * 이 index.js를 통해서만 피드 엔티티의 기능을 외부에 노출합니다.
 * API와 내부 모듈은 이 파일을 통해서만 import되어야 합니다.
 */

export * from './api';
export { default as FeedItem } from './ui/FeedItem.jsx';
// export { useFeed } from './model/useFeed'; // 추후 추가
