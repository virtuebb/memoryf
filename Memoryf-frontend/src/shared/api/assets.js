import { getBaseURL } from './config';

const isAbsoluteUrl = (value) =>
  typeof value === 'string' && /^(https?:)?\/\//.test(value);

/**
 * 백엔드(static) 자산 URL 생성
 * - absolute url: 그대로 반환
 * - '/profile_images/a.png' 같이 '/'로 시작: `${getBaseURL()}${path}`
 * - 'profile_images/a.png' 같이 상대: `${getBaseURL()}/${path}`
 */
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (isAbsoluteUrl(path)) return path;

  const baseURL = getBaseURL();
  if (path.startsWith('/')) return `${baseURL}${path}`;
  return `${baseURL}/${path}`;
};

export const getProfileImageUrl = (fileName) =>
  fileName ? getAssetUrl(`/profile_images/${fileName}`) : '';

export const getFeedUpfileUrl = (fileName) =>
  fileName ? getAssetUrl(`/feed_upfiles/${fileName}`) : '';
