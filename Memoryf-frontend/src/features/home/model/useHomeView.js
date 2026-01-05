import { useEffect, useMemo, useState } from "react";

import { getHomeByMemberNick, getHomeByMemberNo } from "../../../entities/home";
import { visitHome } from "../../../entities/visitor";
import { getMemberNoFromToken, onFollowChange } from "../../../shared/lib";

export const useHomeView = ({ memberNoParam, memberNick }) => {
	const currentMemberNo = getMemberNoFromToken();

	const [homeNo, setHomeNo] = useState(null);
	const [targetMemberNo, setTargetMemberNo] = useState(null);
	const [homeData, setHomeData] = useState(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const fetchHome = async () => {
			try {
				setNotFound(false);
				const parsedMemberNo = memberNoParam ? Number(memberNoParam) : null;

				let data = null;
				if (Number.isFinite(parsedMemberNo) && parsedMemberNo > 0) {
					data = await getHomeByMemberNo(parsedMemberNo, currentMemberNo);
				} else if (memberNick) {
					data = await getHomeByMemberNick(memberNick, currentMemberNo);
				} else if (currentMemberNo) {
					data = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
				}

				if (cancelled) return;

				if (memberNick && !data) {
					setHomeNo(null);
					setTargetMemberNo(null);
					setHomeData(null);
					setNotFound(true);
					return;
				}

				setHomeData(data);
				setHomeNo(data?.homeNo ?? null);
				setTargetMemberNo(data?.memberNo ?? parsedMemberNo ?? currentMemberNo ?? null);
			} catch (error) {
				console.error("홈 번호 조회 실패:", error);
				if (!cancelled) {
					setHomeNo(null);
					setTargetMemberNo(null);
					setHomeData(null);
					setNotFound(Boolean(memberNick));
				}
			}
		};

		fetchHome();

		return () => {
			cancelled = true;
		};
	}, [currentMemberNo, memberNick, memberNoParam]);

	useEffect(() => {
		if (!homeNo) return;
		visitHome(homeNo);
	}, [homeNo]);

	useEffect(() => {
		if (!currentMemberNo) return;

		return onFollowChange(({ targetMemberNo, actorMemberNo, status }) => {
			if (!targetMemberNo || !actorMemberNo) return;
			if (Number(actorMemberNo) !== Number(currentMemberNo)) return;

			setHomeData((prev) => {
				if (!prev) return prev;
				if (Number(prev.memberNo) !== Number(targetMemberNo)) return prev;

				const nextStatus = status ?? null; // 'Y' | 'P' | null
				const nextIsFollowing = nextStatus === "Y" || nextStatus === "P";

				if ((prev.followStatus ?? null) === nextStatus && Boolean(prev.isFollowing) === nextIsFollowing) {
					return prev;
				}

				const prevCount = Number(prev.followerCount ?? 0);
				let nextCount = prevCount;
				if (prev.followStatus === "Y" && nextStatus !== "Y") {
					nextCount = Math.max(0, prevCount - 1);
				} else if (prev.followStatus !== "Y" && nextStatus === "Y") {
					nextCount = prevCount + 1;
				}

				return {
					...prev,
					followStatus: nextStatus,
					isFollowing: nextIsFollowing,
					followerCount: nextCount,
				};
			});
		});
	}, [currentMemberNo]);

	const resolvedMemberNo = useMemo(() => targetMemberNo ?? currentMemberNo, [targetMemberNo, currentMemberNo]);

	const isOwner = useMemo(() => {
		if (resolvedMemberNo == null || currentMemberNo == null) return false;
		return Number(resolvedMemberNo) === Number(currentMemberNo);
	}, [resolvedMemberNo, currentMemberNo]);

	const canView = useMemo(() => {
		const isPrivate = homeData?.isPrivateProfile === "Y";
		const isFollowing = homeData?.isFollowing === true;
		const isFollowAccepted = homeData?.followStatus === "Y";
		return isOwner || !isPrivate || (isFollowing && isFollowAccepted);
	}, [homeData, isOwner]);

	return {
		currentMemberNo,
		homeNo,
		homeData,
		notFound,
		resolvedMemberNo,
		isOwner,
		canView,
	};
};
