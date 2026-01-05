import "./SettingsEditWidget.css";
import { useSettingsEdit } from "../../../features/settings";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import { getProfileImageUrl } from "../../../shared/api";

function SettingsEditWidget() {
	const {
		fileInputRef,
		loading,
		saving,
		uploading,
		profileData,
		formData,
		imageTimestamp,
		nickValid,
		nickRegex,
		handleChange,
		checkNickType,
		handleProfileImageClick,
		handleFileChange,
		handleSubmit,
	} = useSettingsEdit();

	// 닉네임 형식 검증 메시지
	const nickTypeMsg = () => {
		if (nickValid === true)
			return (
				<p className="type-ok" style={{ fontSize: "12px", marginTop: "5px", color: "#28a745" }}>
					올바른 닉네임 형식입니다.
				</p>
			);
		if (nickValid === false)
			return (
				<p className="type-fail" style={{ fontSize: "12px", marginTop: "5px", color: "#dc3545" }}>
					올바르지 않은 닉네임 형식입니다. (2~10자, 한글/영문/숫자/_ /. 만 가능)
				</p>
			);
		return null;
	};

	if (loading) {
		return (
			<div className="settings-edit-container">
				<div className="loading">로딩 중...</div>
			</div>
		);
	}

	const profileImageUrl = profileData?.profileChangeName
		? `${getProfileImageUrl(profileData.profileChangeName)}?t=${imageTimestamp}`
		: defaultProfileImg;

	const handleImageError = (e) => {
		e.target.src = defaultProfileImg;
	};

	return (
		<div className="settings-edit-container">
			<h1 className="settings-edit-title">프로필 편집</h1>
			<div className="settings-edit-header">
				<div className="profile-image-section">
					<div className="profile-image-wrapper">
						<img src={profileImageUrl} alt="프로필 사진" onError={handleImageError} />
					</div>
					<div className="profile-info">
						<div className="profile-nickname">{profileData?.memberNick}</div>
						<div className="profile-id">{profileData?.statusMsg || profileData?.memberId}</div>
					</div>
				</div>
				<button type="button" className="change-photo-btn" onClick={handleProfileImageClick} disabled={uploading}>
					{uploading ? "업로드 중..." : "사진 변경"}
				</button>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					style={{ display: "none" }}
				/>
			</div>

			<form className="settings-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="memberNick">닉네임</label>
					<div className="input-wrap">
						<input
							type="text"
							id="memberNick"
							name="memberNick"
							value={formData.memberNick}
							onChange={handleChange}
							onBlur={checkNickType}
							placeholder="닉네임 (2~10자, 한글/영문/숫자/_ /. 만 가능)"
						/>
					</div>
					{nickTypeMsg()}
				</div>

				<div className="form-group">
					<label htmlFor="statusMsg">소개</label>
					<div className="input-wrap">
						<textarea
							id="statusMsg"
							name="statusMsg"
							value={formData.statusMsg}
							onChange={handleChange}
							placeholder="소개"
							rows="3"
						/>
						<div className="helper-text">{formData.statusMsg.length} / 150</div>
					</div>
				</div>

				<div className="form-actions">
					<button type="submit" className="submit-btn" disabled={saving}>
						{saving ? "저장 중..." : "제출"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default SettingsEditWidget;
