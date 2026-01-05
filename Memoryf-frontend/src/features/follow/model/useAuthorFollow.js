import { useEffect, useState } from "react";

import { getHomeByMemberNo } from "../../../entities/home";
import { getMemberNoFromToken } from "../../../shared/lib";

import { followMember, unfollowMember } from "../api";

export function useAuthorFollow(targetMemberNo, { targetMemberStatus } = {}) {
	const [followStatus, setFollowStatus] = useState("N");

	useEffect(() => {
		const loadFollowStatus = async () => {
			try {
				const me = getMemberNoFromToken();
				if (!me || !targetMemberNo || me === targetMemberNo) {
					setFollowStatus("N");
					return;
				}
				if (targetMemberStatus === "Y") {
					setFollowStatus("N");
					return;
				}

				const homeData = await getHomeByMemberNo(targetMemberNo, me);
				setFollowStatus(homeData?.followStatus || (homeData?.isFollowing ? "Y" : "N"));
			} catch (err) {
				console.error("작성자 팔로우 상태 조회 실패:", err);
				setFollowStatus("N");
			}
		};

		if (targetMemberNo) {
			void loadFollowStatus();
		}
	}, [targetMemberNo, targetMemberStatus]);

	const toggleFollow = async () => {
		const me = getMemberNoFromToken();
		if (!me || !targetMemberNo || me === targetMemberNo) return { success: false };
		if (targetMemberStatus === "Y") return { success: false };

		if (followStatus === "P") {
			return { success: false, needsCancelConfirm: true };
		}

		try {
			const result =
				followStatus === "Y"
					? await unfollowMember(targetMemberNo, me)
					: await followMember(targetMemberNo, me);

			if (!result?.success) {
				return { success: false, message: result?.message };
			}

			const nextStatus = result?.data?.status ?? result?.status ?? null;
			setFollowStatus(nextStatus || "N");
			return { success: true, nextStatus, result };
		} catch (err) {
			console.error("팔로우 처리 실패:", err);
			return { success: false };
		}
	};

	const cancelFollowRequest = async () => {
		const me = getMemberNoFromToken();
		if (!me || !targetMemberNo) return { success: false };

		try {
			const result = await unfollowMember(targetMemberNo, me);
			if (!result?.success) {
				return { success: false, message: result?.message };
			}
			setFollowStatus("N");
			return { success: true, result };
		} catch (err) {
			console.error("요청 취소 실패:", err);
			return { success: false };
		}
	};

	return {
		followStatus,
		setFollowStatus,
		toggleFollow,
		cancelFollowRequest,
	};
}
