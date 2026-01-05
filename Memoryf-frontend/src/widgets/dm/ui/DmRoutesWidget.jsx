import "./DmRoutesWidget.css";

import React, { useCallback, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import { useTheme } from "../../../shared/lib";
import { ChatList, ChatRoom, ThemeSelector, UserSearchModal, useDm } from "../../../features/dm";

export default function DmRoutesWidget() {
	const navigate = useNavigate();
	const location = useLocation();

	const { theme } = useTheme();
	const isDark = theme?.name === "Night";
	const themeClass = isDark ? "dark" : "light";

	const {
		allChats,
		isSearchModalOpen,
		handleMarkAsRead,
		handleAddUser,
		handleSendMessage,
		handleDeleteChat,
		openSearchModal,
		closeSearchModal,
	} = useDm();

	const onAddUser = async (user) => {
		try {
			const newChat = await handleAddUser(user);
			closeSearchModal();
			navigate(`/messages/${newChat.id}`);
		} catch (error) {
			console.error("새 채팅 생성 실패:", error);
			closeSearchModal();
		}
	};

	const onSendMessage = useCallback(
		(chatId, messageText) => {
			const activatedChat = handleSendMessage(chatId, messageText);
			if (activatedChat) {
				navigate(`/messages/${activatedChat.id}`);
			}
		},
		[handleSendMessage, navigate]
	);

	const routesElement = useMemo(
		() => (
			<Routes location={location} key={location.pathname}>
				<Route
					index
					element={
						<DmRoomListPage
							allChats={allChats}
							themeClass={themeClass}
							openSearch={openSearchModal}
							navigateToChat={(chatId) => navigate(`/messages/${chatId}`)}
							onDeleteChat={handleDeleteChat}
						/>
					}
				/>
				<Route
					path=":chatId"
					element={
						<DmChatPage
							allChats={allChats}
							onBack={() => navigate("/messages")}
							onSendMessage={onSendMessage}
							onMarkAsRead={handleMarkAsRead}
							themeClass={themeClass}
						/>
					}
				/>
			</Routes>
		),
		[allChats, themeClass, openSearchModal, navigate, onSendMessage, handleMarkAsRead, location, handleDeleteChat]
	);

	return (
		<div className="dm-container">
			<div className="dm-card">{routesElement}</div>

			{isSearchModalOpen && (
				<UserSearchModal
					onClose={closeSearchModal}
					onAddUser={onAddUser}
					existingUserIds={allChats.map((chat) => chat.userId)}
				/>
			)}
		</div>
	);
}

function DmRoomListPage({ allChats, themeClass, openSearch, navigateToChat, onDeleteChat }) {
	return (
		<div className="dm-room-list-page">
			<ChatList
				chats={allChats}
				onSelectChat={navigateToChat}
				onOpenSearch={openSearch}
				onDeleteChat={onDeleteChat}
				themeClass={themeClass}
			/>
			<ThemeSelector />
		</div>
	);
}

const DmChatPage = React.memo(function DmChatPage({ allChats, onBack, onSendMessage, onMarkAsRead, themeClass }) {
	const { chatId } = useParams();
	const selectedChat = allChats.find((chat) => String(chat.id) === String(chatId));

	if (!selectedChat) {
		return <div className="dm-not-found">채팅을 찾을 수 없습니다.</div>;
	}

	return (
		<ChatRoom
			chat={selectedChat}
			onBack={onBack}
			onSendMessage={onSendMessage}
			onMarkAsRead={onMarkAsRead}
			themeClass={themeClass}
		/>
	);
});
