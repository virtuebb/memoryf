import React, { useEffect, useState } from "react";
import {
	ConfirmModal,
	DataTable,
	Pagination,
	deleteUser as deleteUserApi,
	selectUserCount as selectUserCountApi,
	selectUsers as selectUsersApi,
} from "../../../features/admin";

const UserManagementWidget = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages] = useState(10);

	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		userId: null,
		userName: null,
	});

	const [isLoading] = useState(false);
	const [userList, setUserList] = useState([]);
	const [userCount, setUserCount] = useState(0);

	async function loadUserCount() {
		try {
			const count = await selectUserCountApi();
			setUserCount(count);
		} catch {
			// noop
		}
	}

	async function loadUsers() {
		try {
			const users = await selectUsersApi();
			setUserList(users);
		} catch (error) {
			console.error("회원 정보 조회 실패", error);
			return null;
		}
	}

	useEffect(() => {
		void loadUsers();
		void loadUserCount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDeleteClick = (userId, userName) => {
		setDeleteModal({ isOpen: true, userId, userName });
	};

	const handleDeleteConfirm = async () => {
		try {
			await deleteUserApi(deleteModal.userId);
			alert(`${deleteModal.userName} 회원이 탈퇴 처리되었습니다.`);
			await loadUsers();
			await loadUserCount();
		} catch (e) {
			console.error("회원 탈퇴 실패 : " + e);
			return null;
		}

		setDeleteModal({ isOpen: false, userId: null, userName: null });
	};

	const handleDeleteCancel = () => {
		setDeleteModal({ isOpen: false, userId: null, userName: null });
	};

	const columns = [
		{ key: "memberId", label: "회원 ID", align: "center" },
		{ key: "memberName", label: "회원 이름" },
		{ key: "memberNick", label: "닉네임" },
		{ key: "email", label: "이메일" },
		{ key: "createDate", label: "가입일", align: "center" },
		{
			key: "status",
			label: "상태",
			align: "center",
			render: (row) => (
				<span
					style={{
						padding: "4px 12px",
						borderRadius: "12px",
						fontSize: "12px",
						fontWeight: "500",
						backgroundColor: row.status === "Y" ? "#fee2e2" : "#d1fae5",
						color: row.status === "Y" ? "#991b1b" : "#065f46",
					}}
				>
					{row.status}
				</span>
			),
		},
		{
			key: "actions",
			label: "관리",
			align: "center",
			render: (row) => (
				<div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
					<button
						onClick={() => handleDeleteClick(row.memberId, row.memberName)}
						style={{
							padding: "6px 12px",
							backgroundColor: "#ef4444",
							color: "#ffffff",
							border: "none",
							borderRadius: "6px",
							fontSize: "13px",
							cursor: "pointer",
							transition: "background-color 0.2s",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#dc2626";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#ef4444";
						}}
					>
						탈퇴
					</button>
				</div>
			),
		},
	];

	return (
		<div>
			<div
				style={{
					marginBottom: "24px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div>
					<h1
						style={{
							fontSize: "24px",
							fontWeight: "700",
							color: "#1f2937",
							marginBottom: "8px",
						}}
					>
						회원 관리
					</h1>
					<p style={{ fontSize: "14px", color: "#6b7280" }}>전체 회원 목록을 조회하고 관리할 수 있습니다.</p>
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "16px",
					marginBottom: "24px",
				}}
			>
				<div
					style={{
						padding: "20px",
						backgroundColor: "#ffffff",
						borderRadius: "8px",
						border: "1px solid #e5e7eb",
					}}
				>
					<div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>전체 회원</div>
					<div style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>{userCount.toLocaleString()}</div>
				</div>
				<div
					style={{
						padding: "20px",
						backgroundColor: "#ffffff",
						borderRadius: "8px",
						border: "1px solid #e5e7eb",
					}}
				>
					<div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>정상 회원</div>
					<div style={{ fontSize: "24px", fontWeight: "700", color: "#10b981" }}>1,200</div>
				</div>
				<div
					style={{
						padding: "20px",
						backgroundColor: "#ffffff",
						borderRadius: "8px",
						border: "1px solid #e5e7eb",
					}}
				>
					<div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>탈퇴 회원</div>
					<div style={{ fontSize: "24px", fontWeight: "700", color: "#ef4444" }}>34</div>
				</div>
				<div
					style={{
						padding: "20px",
						backgroundColor: "#ffffff",
						borderRadius: "8px",
						border: "1px solid #e5e7eb",
					}}
				>
					<div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>신규 가입</div>
					<div style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6" }}>12</div>
				</div>
			</div>

			<DataTable columns={columns} data={userList} isLoading={isLoading} emptyMessage="회원 정보가 없습니다." />
			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

			<ConfirmModal
				isOpen={deleteModal.isOpen}
				onConfirm={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				title="회원 탈퇴"
				message={`${deleteModal.userName} 회원을 탈퇴 처리하시겠습니까?`}
				confirmText="탈퇴"
				cancelText="취소"
			/>
		</div>
	);
};

export default UserManagementWidget;
