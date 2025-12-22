import axiosPrivate from '../../auth/api/axios';

export const updatePassword = async (data) => {
  try {
    const response = await axiosPrivate.post('/member/password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (data) => {
  try {
    const response = await axiosPrivate.post('/member/withdrawal', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmail = async (data) => {
  try {
    const response = await axiosPrivate.post('/member/email', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePhone = async (data) => {
  try {
    const response = await axiosPrivate.post('/member/phone', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendVerificationCode = async (email) => {
  try {
    const response = await axiosPrivate.post('/signup/send-code', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await axiosPrivate.post('/signup/verify-code', { email, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};
