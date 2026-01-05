/**
 * 🏠 Home(entity) API
 *
 * 여러 feature(홈/피드/설정 등)에서 공통으로 사용하는 홈/프로필 API.
 * feature → feature 의존을 피하기 위해 entities로 하향합니다.
 */
import { baseApi, getApiResponseData, uploadApi } from "../../../shared/api";

const normalizeHome = (home) => {
	if (!home || typeof home !== "object") return home;

	const normalizedIsFollowing =
		home.isFollowing ?? home.following ?? home.is_following ?? home.IS_FOLLOWING;

	return {
		...home,
		isFollowing: Boolean(normalizedIsFollowing),
	};
};

/**
 * 회원 번호로 홈 조회 (GET /home/{memberNo})
 */
export const getHomeByMemberNo = async (memberNo, currentMemberNo = null) => {
	try {
		const params = currentMemberNo ? { currentMemberNo } : {};
		const response = await baseApi.get(`/home/${memberNo}`, { params });

		const home = getApiResponseData(response.data, null);
		return home ? normalizeHome(home) : null;
	} catch (error) {
		console.error("홈 조회 실패:", error);
		throw error;
	}
};

/**
 * 회원 닉네임으로 홈 조회 (GET /home/by-nick/{memberNick})
 */
export const getHomeByMemberNick = async (memberNick, currentMemberNo = null) => {
	try {
		const params = currentMemberNo ? { currentMemberNo } : {};
		const encoded = encodeURIComponent(memberNick);
		const response = await baseApi.get(`/home/by-nick/${encoded}`, { params });

		const home = getApiResponseData(response.data, null);
		return home ? normalizeHome(home) : null;
	} catch (error) {
		console.error("홈 조회 실패(닉네임):", error);
		throw error;
	}
};

/**
 * 프로필 이미지 업로드 (POST /home/{memberNo}/profile-image)
 */
export const uploadProfileImage = async (memberNo, file) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await uploadApi.post(`/home/${memberNo}/profile-image`, formData);
		return response.data;
	} catch (error) {
		console.error("프로필 이미지 업로드 실패:", error);
		throw error;
	}
};

/**
 * 프로필 정보 업데이트 (PUT /home/{memberNo}/profile)
 */
export const updateProfile = async (memberNo, profileData) => {
	try {
		const response = await baseApi.put(`/home/${memberNo}/profile`, profileData);
		return response.data;
	} catch (error) {
		console.error("프로필 업데이트 실패:", error);
		throw error;
	}
};
