import { createPortal } from "react-dom";
import "../css/StoryUploadPage.css";
import { useRef, useState } from "react";
import { storyApi } from "../api";

const StoryUploadModal = ({ isOpen, onClose, onSuccess }) => {
	if (!isOpen) return null;

	const fileInputRef = useRef(null);
	const [items, setItems] = useState([]);

	const isVideoFile = (file) => {
		return !!file?.type && file.type.startsWith("video/");
	};

	const handleSelectImages = () => {
		fileInputRef.current?.click();
	};

	const onChangeFiles = (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newItems = Array.from(files).map((f) => ({
			file: f,
			previewUrl: URL.createObjectURL(f),
			storyText: "",
		}));

		setItems((prev) => prev.concat(newItems));
		e.target.value = "";
	};

	const onChangeText = (index, value) => {
		setItems((prev) => {
			const copy = [...prev];
			copy[index] = { ...copy[index], storyText: value };
			return copy;
		});
	};

	const onRemoveItem = (index) => {
		setItems((prev) => {
			const copy = [...prev];
			if (copy[index]?.previewUrl) URL.revokeObjectURL(copy[index].previewUrl);
			copy.splice(index, 1);
			return copy;
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (items.length === 0) return alert("이미지를 추가해주세요.");

		try {
			const storageData = localStorage.getItem("loginMember");
			console.log("저장된 유저 정보:", storageData);

			if (!storageData) {
				alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
				return;
			}

			const loginMember = JSON.parse(storageData);
			const memberNo = loginMember.memberNo;

			if (!memberNo) {
				alert("사용자 번호(memberNo)를 찾을 수 없습니다.");
				return;
			}

			const fd = new FormData();
			fd.append(
				"detail",
				JSON.stringify({
					story: { memberNo: memberNo },
					items: items.map((it) => ({ storyText: it.storyText })),
				})
			);

			items.forEach((it) => fd.append("files", it.file));

			const res = await storyApi.insertStory(fd);
			if (res?.success) {
				window.dispatchEvent(new Event("storyChanged"));
				alert("업로드 완료");
				setItems([]);
				onSuccess?.(res.data);
				onClose();
			} else {
				alert(res?.message || "업로드에 실패했습니다.");
			}
		} catch (err) {
			console.error("업로드 에러 상세:", err);
			alert("업로드 실패: 서버 로그를 확인하세요.");
		}
	};

	return createPortal(
		<div className="story-upload-overlay" onClick={onClose}>
			<div className="story-upload-modal" onClick={(e) => e.stopPropagation()}>
				<div className="story-upload-header">
					<button className="btn-back" type="button" onClick={onClose}>
						✕
					</button>
					<h2 className="story-upload-title">스토리 업로드</h2>
					{items.length > 0 && (
						<button type="submit" className="btn-submit-text" form="storyUploadForm">
							공유
						</button>
					)}
				</div>

				<form id="storyUploadForm" className="story-upload-body" onSubmit={onSubmit}>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,video/*"
						multiple
						onChange={onChangeFiles}
						style={{ display: "none" }}
					/>

					<div className="story-upload-list">
						{items.length === 0 ? (
							<div className="story-upload-empty" onClick={handleSelectImages}>
								<div className="empty-icon-wrapper">
									<span className="empty-icon-plus">＋</span>
								</div>
								<p>사진을 선택하여 스토리를 시작하세요.</p>
								<button type="button" className="btn-add-main">
									이미지 선택
								</button>
							</div>
						) : (
							<>
								<button type="button" className="btn-add-more" onClick={handleSelectImages}>
									+ 이미지 추가 선택
								</button>
								{items.map((it, idx) => (
									<div className="story-upload-item" key={idx}>
										<div className="preview-wrap">
											{isVideoFile(it.file) ? (
												<video
													className="story-upload-preview"
													src={it.previewUrl}
													controls
													playsInline
												/>
											) : (
												<img className="story-upload-preview" src={it.previewUrl} alt="" />
											)}
											<button type="button" className="btn-remove" onClick={() => onRemoveItem(idx)}>
												✕
											</button>
										</div>
										<textarea
											className="story-upload-text"
											placeholder="텍스트 입력 (선택)"
											value={it.storyText}
											onChange={(e) => onChangeText(idx, e.target.value)}
										/>
									</div>
								))}
							</>
						)}
					</div>
				</form>
			</div>
		</div>,
		document.body
	);
};

export default StoryUploadModal;
