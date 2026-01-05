import { useCallback, useEffect, useMemo, useState } from "react";

import { chargePoint, fetchMemberPoint } from "../api";
import { getMemberNoFromToken } from "../../../shared/lib";

export const usePointCharge = () => {
	const [currentPoint, setCurrentPoint] = useState(0);
	const [selectedAmount, setSelectedAmount] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const memberNo = getMemberNoFromToken();

	const chargeAmounts = useMemo(
		() => [
			{ amount: 1000, label: "1,000원" },
			{ amount: 3000, label: "3,000원" },
			{ amount: 5000, label: "5,000원" },
			{ amount: 10000, label: "10,000원" },
			{ amount: 30000, label: "30,000원" },
			{ amount: 50000, label: "50,000원" },
		],
		[]
	);

	const loadCurrentPoint = useCallback(async () => {
		if (!memberNo) return;
		try {
			const response = await fetchMemberPoint(memberNo);
			if (response.success) {
				setCurrentPoint(response.point);
			}
		} catch (error) {
			console.error("포인트 조회 실패:", error);
		}
	}, [memberNo]);

	useEffect(() => {
		loadCurrentPoint();
	}, [loadCurrentPoint]);

	const requestPayment = useCallback(async () => {
		if (!selectedAmount) {
			alert("충전할 금액을 선택해주세요.");
			return;
		}

		setIsLoading(true);

		if (!window.IMP) {
			alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
			setIsLoading(false);
			return;
		}

		const IMP = window.IMP;
		const impCode = import.meta.env.VITE_PORTONE_IMP_CODE || "imp00000000";
		IMP.init(impCode);

		const merchantUid = `charge_${Date.now()}_${memberNo}`;

		IMP.request_pay(
			{
				pg: "kakaopay",
				pay_method: "card",
				merchant_uid: merchantUid,
				name: `포인트 ${selectedAmount.toLocaleString()}원 충전`,
				amount: selectedAmount,
				buyer_name: "회원" + memberNo,
				buyer_tel: "010-0000-0000",
				buyer_email: "test@test.com",
			},
			async (rsp) => {
				if (rsp.success) {
					try {
						const chargeData = {
							impUid: rsp.imp_uid,
							merchantUid: rsp.merchant_uid,
							amount: rsp.paid_amount,
						};

						const result = await chargePoint(memberNo, chargeData);

						if (result.success) {
							alert(`${selectedAmount.toLocaleString()}원이 충전되었습니다!`);
							setCurrentPoint(result.currentPoint);
							setSelectedAmount(null);
						} else {
							alert("포인트 충전에 실패했습니다: " + result.message);
						}
					} catch (error) {
						console.error("포인트 충전 처리 실패:", error);
						const errorMessage =
							error.response?.data?.message || error.message || "포인트 충전 처리 중 오류가 발생했습니다.";
						alert("포인트 충전 실패: " + errorMessage);
					}
				} else {
					alert("결제에 실패했습니다: " + rsp.error_msg);
				}
				setIsLoading(false);
			}
		);
	}, [memberNo, selectedAmount]);

	return {
		memberNo,
		chargeAmounts,
		currentPoint,
		selectedAmount,
		setSelectedAmount,
		isLoading,
		requestPayment,
		reloadCurrentPoint: loadCurrentPoint,
	};
};
