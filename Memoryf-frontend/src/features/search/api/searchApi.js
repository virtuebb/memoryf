import axios from 'axios';
import { getAccessToken } from '../../../utils/jwt';

const API_BASE_URL = 'http://localhost:8006/memoryf';

const searchApi = axios.create({
  baseURL: `${API_BASE_URL}/search`,
  timeout: 10000,
});

searchApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 회원 검색 (닉네임)
 * @param {string} keyword 
 */
export const searchMembers = async (keyword) => {
  try {
    const response = await searchApi.get('/member', {
      params: { keyword }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('회원 검색 실패:', error);
    return [];
  }
};

/**
 * 태그 검색 (피드)
 * @param {string} keyword 
 */
export const searchFeedsByTag = async (keyword) => {
  try {
    const response = await searchApi.get('/tag', {
      params: { keyword }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('태그 검색 실패:', error);
    return [];
  }
};
