import { baseApi, mergeApiResponseData, toApiResponse } from '../../../shared/api';

const normalizeApiResponse = (payload) => mergeApiResponseData(toApiResponse(payload));

/**
 * 포인트 충전 API
 */
export const chargePoint = async (memberNo, chargeData) => {
  try {
    const response = await baseApi.post(`/payment/charge?memberNo=${memberNo}`, chargeData);
    return normalizeApiResponse(response.data);
  } catch (error) {
    console.error('포인트 충전 실패:', error);
    throw error;
  }
};

/**
 * BGM 전체 목록 조회
 */
export const fetchBgmList = async () => {
  try {
    const response = await baseApi.get('/payment/bgm/list');
    return normalizeApiResponse(response.data);
  } catch (error) {
    console.error('BGM 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 구매한 BGM 목록 조회
 */
export const fetchPurchasedBgmList = async (memberNo) => {
  try {
    const response = await baseApi.get(`/payment/bgm/purchased/${memberNo}`);
    return normalizeApiResponse(response.data);
  } catch (error) {
    console.error('구매한 BGM 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * BGM 구매
 */
export const purchaseBgm = async (memberNo, bgmData) => {
  try {
    const response = await baseApi.post(`/payment/bgm/purchase?memberNo=${memberNo}`, {
      bgmNo: bgmData.bgmNo,
      title: bgmData.title || bgmData.bgmTitle,
      artist: bgmData.artist,
      videoId: bgmData.videoId,
      thumbnail: bgmData.thumbnail
    });
    return normalizeApiResponse(response.data);
  } catch (error) {
    console.error('BGM 구매 실패:', error);
    throw error;
  }
};

/**
 * 회원 포인트 조회
 */
export const fetchMemberPoint = async (memberNo) => {
  try {
    const response = await baseApi.get(`/payment/point/${memberNo}`);
    return normalizeApiResponse(response.data);
  } catch (error) {
    console.error('포인트 조회 실패:', error);
    throw error;
  }
};

/**
 * 결제 내역 조회
 */
export const fetchPaymentHistory = async (memberNo) => {
  try {
    const response = await baseApi.get(`/payment/history/${memberNo}`);
    return normalizeApiResponse(response.data);
  } catch (error) {
    console.error('결제 내역 조회 실패:', error);
    throw error;
  }
};
