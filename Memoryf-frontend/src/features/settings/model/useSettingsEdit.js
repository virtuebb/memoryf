import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	getHomeByMemberNo,
	updateProfile,
	uploadProfileImage,
} from "../../../entities/home";
import { getMemberNoFromToken } from "../../../shared/lib";

export const useSettingsEdit = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const currentMemberNo = getMemberNoFromToken();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [profileData, setProfileData] = useState(null);
	const [imageTimestamp, setImageTimestamp] = useState(Date.now());
	const [formData, setFormData] = useState({
		memberNick: "",
		statusMsg: "",
	});

	// 닉네임 유효성 검사 state
	const [nickValid, setNickValid] = useState(null);
	const nickRegex = useMemo(() => /^[A-Za-z0-9가-힣_.]{2,10}$/, []);

	useEffect(() => {
		const fetchProfileData = async () => {
			if (!currentMemberNo) {
				navigate("/login");
				return;
			}

			try {
				setLoading(true);
				const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
				setProfileData(homeData);
				setFormData({
					memberNick: homeData?.memberNick || "",
					statusMsg: homeData?.statusMsg || "",
				});
			} catch (error) {
				console.error("프로필 데이터 조회 실패:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileData();
	}, [currentMemberNo, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "memberNick") {
			setNickValid(null);
		}
	};

	const checkNickType = () => {
		if (!formData.memberNick) {
			setNickValid(null);
			return;
		}
		setNickValid(nickRegex.test(formData.memberNick));
	};

	const handleProfileImageClick = () => {
		fileInputRef.current?.click();
	};

	const refetchProfile = async () => {
		if (!currentMemberNo) return;
		const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
		setProfileData(homeData);
	};

	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("이미지 파일만 업로드 가능합니다.");
			return;
		}

		try {
			setUploading(true);
			const result = await uploadProfileImage(currentMemberNo, file);
			if (result?.success) {
				await refetchProfile();
				setImageTimestamp(Date.now());
				alert("프로필 사진이 변경되었습니다.");
			}
		} catch (error) {
			console.error("프로필 이미지 업로드 실패:", error);
			alert("프로필 이미지 업로드에 실패했습니다.");
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.memberNick.trim()) {
			alert("닉네임을 입력해주세요.");
			return;
		}

		if (!nickRegex.test(formData.memberNick)) {
			alert("닉네임 형식을 확인해주세요. (2~10자, 한글/영문/숫자/_ /. 만 가능)");
			return;
		}

		try {
			setSaving(true);
			const result = await updateProfile(currentMemberNo, formData);
			if (result?.success) {
				alert("프로필이 저장되었습니다.");
				await refetchProfile();
			} else {
				alert("프로필 수정에 실패했습니다.");
			}
		} catch (error) {
			console.error("프로필 수정 실패:", error);
			alert("프로필 수정 중 오류가 발생했습니다.");
		} finally {
			setSaving(false);
		}
	};

	return {
		fileInputRef,
		currentMemberNo,
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
	};
};
