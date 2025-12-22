import { useState, useEffect } from 'react';
import { updatePassword, deleteAccount, updateEmail, updatePhone, sendVerificationCode, verifyCode } from '../api/securityApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import axiosPrivate from '../../auth/api/axios';
import "../css/SettingsEdit.css";

function SecuritySection() {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  
  const [deletePwd, setDeletePwd] = useState('');
  
  // Email & Phone states
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const memberNo = getMemberNoFromToken();

  useEffect(() => {
    if (memberNo) {
      fetchMemberInfo();
    }
  }, [memberNo]);

  const fetchMemberInfo = async () => {
    try {
      const response = await axiosPrivate.get(`/member/info?memberNo=${memberNo}`);
      setCurrentEmail(response.data.email || '');
      setCurrentPhone(response.data.phone || '');
    } catch (error) {
      console.error("Failed to fetch member info", error);
    }
  };

  const handleUpdatePwd = async () => {
    if (newPwd !== confirmPwd) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!oldPwd || !newPwd) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await updatePassword({ memberNo, oldPwd, newPwd });
      alert(response);
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (error) {
      alert(error.response?.data || '비밀번호 변경 실패');
    }
  };

  const handleSendEmailCode = async () => {
    if (!newEmail) {
      alert('새 이메일을 입력해주세요.');
      return;
    }
    try {
      await sendVerificationCode(newEmail);
      setIsEmailCodeSent(true);
      alert('인증번호가 전송되었습니다.');
    } catch (error) {
      alert('인증번호 전송 실패');
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    try {
      const result = await verifyCode(newEmail, emailCode);
      if (result === 1) {
        setIsEmailVerified(true);
        alert('이메일 인증 성공');
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('인증 실패');
    }
  };

  const handleUpdateEmail = async () => {
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    try {
      const response = await updateEmail({ memberNo, email: newEmail });
      alert(response);
      setCurrentEmail(newEmail);
      setNewEmail('');
      setEmailCode('');
      setIsEmailCodeSent(false);
      setIsEmailVerified(false);
    } catch (error) {
      alert(error.response?.data || '이메일 변경 실패');
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone) {
      alert('새 전화번호를 입력해주세요.');
      return;
    }
    try {
      const response = await updatePhone({ memberNo, phone: newPhone });
      alert(response);
      setCurrentPhone(newPhone);
      setNewPhone('');
    } catch (error) {
      alert(error.response?.data || '전화번호 변경 실패');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePwd) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await deleteAccount({ memberNo, memberPwd: deletePwd });
      alert(response);
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    } catch (error) {
      alert(error.response?.data || '회원 탈퇴 실패');
    }
  };

  return (
    <div className="settings-edit-container">
      <h1 className="settings-edit-title">보안 설정</h1>

      {/* 비밀번호 변경 */}
      <div className="settings-section">
        <h2>비밀번호 변경</h2>
        <div className="settings-form">
          <div className="form-group">
            <label>현재 비밀번호</label>
            <div className="input-wrap">
              <input 
                type="password" 
                value={oldPwd}
                onChange={(e) => setOldPwd(e.target.value)}
                placeholder="현재 비밀번호"
              />
            </div>
          </div>

          <div className="form-group">
            <label>새 비밀번호</label>
            <div className="input-wrap">
              <input 
                type="password" 
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="새 비밀번호"
              />
            </div>
          </div>

          <div className="form-group">
            <label>새 비밀번호 확인</label>
            <div className="input-wrap">
              <input 
                type="password" 
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="새 비밀번호 확인"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="change-photo-btn" onClick={handleUpdatePwd}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>

      <hr className="settings-divider" style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

      {/* 이메일 변경 */}
      <div className="settings-section">
        <h2>이메일 변경</h2>
        <div className="settings-form">
          <div className="form-group">
            <label>현재 이메일</label>
            <div className="input-wrap">
              <input type="text" value={currentEmail} disabled style={{ backgroundColor: '#f5f5f5' }} />
            </div>
          </div>
          
          <div className="form-group">
            <label>새 이메일</label>
            <div className="input-wrap" style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="새 이메일 입력"
                disabled={isEmailVerified}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="change-photo-btn" 
                onClick={handleSendEmailCode}
                disabled={isEmailVerified}
                style={{ width: '100px', padding: '0' }}
              >
                인증번호 전송
              </button>
            </div>
          </div>

          {isEmailCodeSent && !isEmailVerified && (
            <div className="form-group">
              <label>인증번호</label>
              <div className="input-wrap" style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="인증번호 입력"
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  className="change-photo-btn" 
                  onClick={handleVerifyEmailCode}
                  style={{ width: '100px', padding: '0' }}
                >
                  확인
                </button>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="change-photo-btn" 
              onClick={handleUpdateEmail}
              disabled={!isEmailVerified}
              style={{ opacity: !isEmailVerified ? 0.5 : 1 }}
            >
              이메일 변경
            </button>
          </div>
        </div>
      </div>

      <hr className="settings-divider" style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

      {/* 전화번호 변경 */}
      <div className="settings-section">
        <h2>전화번호 변경</h2>
        <div className="settings-form">
          <div className="form-group">
            <label>현재 전화번호</label>
            <div className="input-wrap">
              <input type="text" value={currentPhone} disabled style={{ backgroundColor: '#f5f5f5' }} />
            </div>
          </div>

          <div className="form-group">
            <label>새 전화번호</label>
            <div className="input-wrap">
              <input 
                type="text" 
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="새 전화번호 입력"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="change-photo-btn" onClick={handleUpdatePhone}>
              전화번호 변경
            </button>
          </div>
        </div>
      </div>

      <hr className="settings-divider" style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

      {/* 회원 탈퇴 */}
      <div className="settings-section">
        <h2 style={{ color: '#ff4d4f' }}>회원 탈퇴</h2>
        <div className="settings-form">
          <div className="form-group">
            <label>비밀번호 확인</label>
            <div className="input-wrap">
              <input 
                type="password" 
                value={deletePwd}
                onChange={(e) => setDeletePwd(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="change-photo-btn" 
              onClick={handleDeleteAccount}
              style={{ backgroundColor: '#ff4d4f' }}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SecuritySection;