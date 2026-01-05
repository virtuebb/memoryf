import React, { useState } from "react";
import { ConfirmModal, DataTable, Pagination } from "../../../features/admin";

const ReportManagementWidget = () => {
	const [activeTab, setActiveTab] = useState("feed");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages] = useState(5);

	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		type: null,
		id: null,
		title: null,
	});

	const [suspendModal, setSuspendModal] = useState({
		isOpen: false,
		userId: null,
		userName: null,
		suspendPeriod: "3",
	});

	const reportedFeeds = [
		{ id: 1, author: "user001", reason: "욕설/비방", reportCount: 5, content: "부적절한 내용..." },
		{ id: 2, author: "user002", reason: "스팸", reportCount: 3, content: "스팸 게시물..." },
		{ id: 3, author: "user003", reason: "음란물", reportCount: 8, content: "부적절한 이미지..." },
	];

	const reportedComments = [
		{ id: 1, author: "user004", content: "부적절한 댓글 내용입니다...", reason: "욕설/비방" },
		{ id: 2, author: "user005", content: "스팸 댓글입니다...", reason: "스팸" },
	];

	const reportedUsers = [
		{ id: 1, nickname: "user006", reason: "반복적인 신고", reportCount: 15 },
		{ id: 2, nickname: "user007", reason: "부적절한 행동", reportCount: 8 },
	];

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	const handleDeleteClick = (type, id, title) => {
		setDeleteModal({ isOpen: true, type, id, title });
	};

	const handleDeleteConfirm = async () => {
		alert("삭제 처리되었습니다.");
		setDeleteModal({ isOpen: false, type: null, id: null, title: null });
	};

	const handleSuspendClick = (userId, userName) => {
		setSuspendModal({ isOpen: true, userId, userName, suspendPeriod: "3" });
	};

	const handleSuspendConfirm = async () => {
		const periodText = suspendModal.suspendPeriod === "permanent" ? "영구" : `${suspendModal.suspendPeriod}일`;
		alert(`${suspendModal.userName} 회원이 ${periodText} 정지 처리되었습니다.`);
		setSuspendModal({ isOpen: false, userId: null, userName: null, suspendPeriod: "3" });
	};

	const feedColumns = [
		{ key: "id", label: "피드 ID", align: "center" },
		{ key: "author", label: "작성자" },
		{ key: "reason", label: "신고 사유" },
		{
			key: "reportCount",
			label: "신고 횟수",
			align: "center",
			render: (row) => (
				<span
					style={{
						padding: "4px 8px",
						backgroundColor: "#fee2e2",
						color: "#991b1b",
						borderRadius: "4px",
						fontSize: "12px",
						fontWeight: "600",
					}}
				>
					{row.reportCount}회
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
						onClick={() => alert(`피드 ${row.id} 상세보기`)}
						style={{
							padding: "6px 12px",
							backgroundColor: "#3b82f6",
							color: "#ffffff",
							border: "none",
							borderRadius: "6px",
							fontSize: "13px",
							cursor: "pointer",
						}}
					>
						상세
					</button>
					<button
						onClick={() => handleDeleteClick("feed", row.id, `피드 ${row.id}`)}
						style={{
							padding: "6px 12px",
							backgroundColor: "#ef4444",
							color: "#ffffff",
							border: "none",
							borderRadius: "6px",
							fontSize: "13px",
							cursor: "pointer",
						}}
					>
						삭제
					</button>
				</div>
			),
		},
	];

	const commentColumns = [
		{ key: "id", label: "댓글 ID", align: "center" },
		{ key: "author", label: "작성자" },
		{
			key: "content",
			label: "댓글 내용",
			render: (row) => (
				<div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.content}</div>
			),
		},
		{ key: "reason", label: "신고 사유" },
		{
			key: "actions",
			label: "관리",
			align: "center",
			render: (row) => (
				<button
					onClick={() => handleDeleteClick("comment", row.id, `댓글 ${row.id}`)}
					style={{
						padding: "6px 12px",
						backgroundColor: "#ef4444",
						color: "#ffffff",
						border: "none",
						borderRadius: "6px",
						fontSize: "13px",
						cursor: "pointer",
					}}
				>
					삭제
				</button>
			),
		},
	];

	const userColumns = [
		{ key: "id", label: "회원 ID", align: "center" },
		{ key: "nickname", label: "닉네임" },
		{ key: "reason", label: "신고 사유" },
		{
			key: "reportCount",
			label: "누적 신고 횟수",
			align: "center",
			render: (row) => (
				<span
					style={{
						padding: "4px 8px",
						backgroundColor: "#fee2e2",
						color: "#991b1b",
						borderRadius: "4px",
						fontSize: "12px",
						fontWeight: "600",
					}}
				>
					{row.reportCount}회
				</span>
			),
		},
		{
			key: "actions",
			label: "관리",
			align: "center",
			render: (row) => (
				<button
					onClick={() => handleSuspendClick(row.id, row.nickname)}
					style={{
						padding: "6px 12px",
						backgroundColor: "#f59e0b",
						color: "#ffffff",
						border: "none",
						borderRadius: "6px",
						fontSize: "13px",
						cursor: "pointer",
					}}
				>
					정지
				</button>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: "24px" }}>
				<h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>신고 관리</h1>
				<p style={{ fontSize: "14px", color: "#6b7280" }}>신고된 피드, 댓글, 회원을 관리할 수 있습니다.</p>
			</div>

			<div
				style={{
					display: "flex",
					gap: "8px",
					marginBottom: "24px",
					borderBottom: "2px solid #e5e7eb",
				}}
			>
				{[
					{ key: "feed", label: "신고된 피드", count: reportedFeeds.length },
					{ key: "comment", label: "신고된 댓글", count: reportedComments.length },
					{ key: "user", label: "신고된 회원", count: reportedUsers.length },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() => handleTabChange(tab.key)}
						style={{
							padding: "12px 24px",
							backgroundColor: "transparent",
							color: activeTab === tab.key ? "#3b82f6" : "#6b7280",
							border: "none",
							borderBottom: activeTab === tab.key ? "2px solid #3b82f6" : "2px solid transparent",
							fontSize: "15px",
							fontWeight: activeTab === tab.key ? "600" : "400",
							cursor: "pointer",
							marginBottom: "-2px",
							transition: "all 0.2s",
						}}
					>
						{tab.label} ({tab.count})
					</button>
				))}
			</div>

			{activeTab === "feed" && (
				<>
					<DataTable columns={feedColumns} data={reportedFeeds} isLoading={false} emptyMessage="신고된 피드가 없습니다." />
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</>
			)}
			{activeTab === "comment" && (
				<>
					<DataTable columns={commentColumns} data={reportedComments} isLoading={false} emptyMessage="신고된 댓글이 없습니다." />
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</>
			)}
			{activeTab === "user" && (
				<>
					<DataTable columns={userColumns} data={reportedUsers} isLoading={false} emptyMessage="신고된 회원이 없습니다." />
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</>
			)}

			<ConfirmModal
				isOpen={deleteModal.isOpen}
				onConfirm={handleDeleteConfirm}
				onCancel={() => setDeleteModal({ isOpen: false, type: null, id: null, title: null })}
				title="삭제 확인"
				message={`${deleteModal.title}을(를) 삭제하시겠습니까?`}
				confirmText="삭제"
				cancelText="취소"
			/>
			<ConfirmModal
				isOpen={suspendModal.isOpen}
				onConfirm={handleSuspendConfirm}
				onCancel={() => setSuspendModal({ isOpen: false, userId: null, userName: null, suspendPeriod: "3" })}
				title="회원 정지"
				message={`${suspendModal.userName} 회원을 정지 처리하시겠습니까?`}
				confirmText="정지"
				cancelText="취소"
			/>
		</div>
	);
};

export default ReportManagementWidget;
