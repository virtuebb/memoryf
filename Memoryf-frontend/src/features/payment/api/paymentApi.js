import axios from '../../auth/api/axios';

/**
 * 포인트 충전 API
 */
export const chargePoint = async (memberNo, chargeData) => {
  try {
    const response = await axios.post(`/payment/charge?memberNo=${memberNo}`, chargeData);
    return response.data;
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
    const response = await axios.get('/payment/bgm/list');
    return response.data;
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
    const response = await axios.get(`/payment/bgm/purchased/${memberNo}`);
    return response.data;
  } catch (error) {
    console.error('구매한 BGM 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * BGM 구매
 */
export const purchaseBgm = async (memberNo, bgmNo) => {
  try {
    const response = await axios.post(`/payment/bgm/purchase?memberNo=${memberNo}`, {
      bgmNo: bgmNo
    });
    return response.data;
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
    const response = await axios.get(`/payment/point/${memberNo}`);
    return response.data;
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
    const response = await axios.get(`/payment/history/${memberNo}`);
    return response.data;
  } catch (error) {
    console.error('결제 내역 조회 실패:', error);
    throw error;
  }
};
