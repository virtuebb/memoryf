import { useState, useEffect } from 'react';
import { updatePassword, deleteAccount, updateEmail, updatePhone, sendVerificationCode, verifyCode, getMemberInfo } from '../api';
import { getMemberNoFromToken } from '../../../shared/lib';
import "../../../shared/css/SettingsEditCommon.css";

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

  // 비밀번호 유효성 검사 state
  const [pwdValid, setPwdValid] = useState(null);
  const [pwdMatch, setPwdMatch] = useState(null);

  // 비밀번호 정규식 (회원가입과 동일)
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,16}$/;

  const memberNo = getMemberNoFromToken();

  useEffect(() => {
    if (memberNo) {
      fetchMemberInfo();
    }
  }, [memberNo]);

  const fetchMemberInfo = async () => {
    try {
      const info = await getMemberInfo(memberNo);
      setCurrentEmail(info?.email || '');
      setCurrentPhone(info?.phone || '');
    } catch (error) {
      console.error("Failed to fetch member info", error);
    }
  };

  // 비밀번호 형식 검사
  const checkPwdType = () => {
    if (!newPwd) {
      setPwdValid(null);
      return;
    }
    setPwdValid(pwdRegex.test(newPwd));
  };

  // 비밀번호 일치 확인
  const checkPassword = () => {
    checkPwdType(); // 형식 검사도 함께 수행

    if (!newPwd || !confirmPwd) {
      setPwdMatch(null);
      return;
    }

    setPwdMatch(newPwd === confirmPwd);
  };

  // 비밀번호 형식 검증 메시지
  const pwdTypeMsg = () => {
    if (pwdValid === true) return <p className="type-ok" style={{ fontSize: '12px', marginTop: '5px', color: '#28a745' }}>올바른 비밀번호 형식입니다.</p>;
    if (pwdValid === false) return <p className="type-fail" style={{ fontSize: '12px', marginTop: '5px', color: '#dc3545' }}>올바르지 않은 비밀번호 형식입니다.</p>;
    return null;
  };

  // 비밀번호 일치 여부 메시지
  const renderPwdMsg = () => {
    if (pwdMatch === true) return <p className="type-ok" style={{ fontSize: '12px', marginTop: '5px', color: '#28a745' }}>비밀번호가 일치합니다.</p>;
    if (pwdMatch === false) return <p className="type-fail" style={{ fontSize: '12px', marginTop: '5px', color: '#dc3545' }}>비밀번호가 일치하지 않습니다.</p>;
    return null;
  };

  const handleUpdatePwd = async () => {
    if (!oldPwd || !newPwd || !confirmPwd) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!pwdRegex.test(newPwd)) {
      alert('비밀번호 형식을 확인해주세요. (8~16자, 영문+숫자 필수)');
      return;
    }

    if (newPwd !== confirmPwd) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await updatePassword(memberNo, { oldPwd, newPwd });
      alert(response?.message || '비밀번호가 변경되었습니다.');
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (error) {
      alert(error.response?.data?.message || '비밀번호 변경 실패');
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
      const response = await updateEmail(memberNo, { email: newEmail });
      alert(response?.message || '이메일이 변경되었습니다.');
      setCurrentEmail(newEmail);
      setNewEmail('');
      setEmailCode('');
      setIsEmailCodeSent(false);
      setIsEmailVerified(false);
    } catch (error) {
      alert(error.response?.data?.message || '이메일 변경 실패');
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone) {
      alert('새 전화번호를 입력해주세요.');
      return;
    }
    try {
      const response = await updatePhone(memberNo, { phone: newPhone });
      alert(response?.message || '전화번호가 변경되었습니다.');
      setCurrentPhone(newPhone);
      setNewPhone('');
    } catch (error) {
      alert(error.response?.data?.message || '전화번호 변경 실패');
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
      const response = await deleteAccount(memberNo, { memberPwd: deletePwd });
      alert(response?.message || '회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    } catch (error) {
      alert(error.response?.data?.message || '회원 탈퇴 실패');
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
                onBlur={checkPwdType}
                placeholder="새 비밀번호 (8~16자, 영문+숫자 필수)"
              />
            </div>
            {pwdTypeMsg()}
          </div>

          <div className="form-group">
            <label>새 비밀번호 확인</label>
            <div className="input-wrap">
              <input 
                type="password" 
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                onBlur={checkPassword}
                placeholder="새 비밀번호 확인"
              />
            </div>
            {renderPwdMsg()}
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