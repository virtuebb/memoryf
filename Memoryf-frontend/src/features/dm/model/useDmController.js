import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import { getBaseURL } from '../../../shared/api';
import { getAccessToken, getUserIdFromToken } from '../../../shared/lib';
import {
	createDmRoom,
	deleteDmRoom,
	markMessageAsRead,
	selectDmMessages,
	selectDmRoomList,
} from '../api';

const WS_URL = import.meta.env.VITE_WS_URL || `${getBaseURL()}/ws`;

const getCurrentUserId = () => {
	const userId = getUserIdFromToken();
	if (userId) return userId;
	return 'guest';
};

export function useDmController() {
	// 💬 채팅방 목록 (실제 대화가 있는 방)
	const [chatRooms, setChatRooms] = useState([]);

	// 🔍 사용자 검색 모달 열기/닫기
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

	// 🔌 WebSocket 연결 상태
	const [isConnected, setIsConnected] = useState(false);
	const stompClientRef = useRef(null);

	// 👤 현재 사용자 ID
	const [myUserId] = useState(() => getCurrentUserId());

	// 👁️ 현재 보고 있는 채팅방의 상대방 ID
	const currentViewingUserIdRef = useRef(null);

	// 📌 최신 state 접근용 ref
	const chatRoomsRef = useRef(chatRooms);
	useEffect(() => {
		chatRoomsRef.current = chatRooms;
	}, [chatRooms]);

	const allChats = chatRooms;
	const totalUnread = useMemo(
		() => allChats.reduce((sum, chat) => sum + (chat.unread || 0), 0),
		[allChats]
	);

	const disconnectWebSocket = useCallback(() => {
		if (stompClientRef.current) {
			stompClientRef.current.deactivate();
			stompClientRef.current = null;
			setIsConnected(false);
		}
	}, []);

	const loadData = useCallback(async () => {
		try {
			const response = await selectDmRoomList();
			const payload = response?.data ?? response;

			let roomList = [];
			if (Array.isArray(payload)) {
				roomList = payload;
			} else if (payload && typeof payload === 'object') {
				if (payload.chatRooms && Array.isArray(payload.chatRooms)) {
					roomList = payload.chatRooms;
				} else if (payload.data && Array.isArray(payload.data)) {
					roomList = payload.data;
				}
			}

			const mapped = roomList.map((room) => {
				const time = room.lastSendDate
					? (() => {
						try {
							let dateStr = room.lastSendDate;
							if (!dateStr.includes(':')) {
								dateStr = dateStr + ' 00:00:00';
							}
							const [datePart, timePart] = dateStr.split(' ');
							const [year, month, day] = datePart.split('-');
							const [hours = 0, minutes = 0, seconds = 0] = (timePart || '00:00:00').split(':');
							const date = new Date(year, parseInt(month) - 1, day, hours, minutes, seconds);
							return date.toLocaleTimeString('ko-KR', {
								hour: '2-digit',
								minute: '2-digit',
								hour12: true,
							});
						} catch {
							return String(room.lastSendDate || '');
						}
					})()
					: room.time || '대기';

				const opponentId =
					room.targetUserId ||
					room.target_user_id ||
					room.targetUser ||
					room.roomName ||
					room.room_name ||
					room.roomNm ||
					room.room_nm ||
					room.room;

				return {
					id: room.roomNo,
					userId: opponentId || String(room.roomNo),
					userName: room.targetUserName || opponentId || room.roomName || String(room.roomNo),
					lastMessage: room.lastMessage || '대화 없음',
					time,
					unread: room.unreadCount || 0,
					avatar: room.avatar || '👤',
					messages: room.messages || [],
					isPending: false,
				};
			});

			setChatRooms(mapped);
		} catch (error) {
			console.error('❌ 채팅방 로드 실패:', error);
		}
	}, []);

	const handleReceiveMessage = useCallback(
		async (data) => {
			const { type, sender, content, roomNo, recipientId, messageId } = data;

			if (type === 'delete') {
				setChatRooms((prevRooms) =>
					prevRooms.map((room) => {
						if (String(room.id) === String(roomNo)) {
							return {
								...room,
								messages: room.messages.filter((msg) => String(msg.id) !== String(messageId)),
							};
						}
						return room;
					})
				);
				return;
			}

			if (type === 'read' || (content === '' && type !== 'message')) {
				setChatRooms((prevRooms) =>
					prevRooms.map((room) => {
						if (room.userId === sender) {
							return {
								...room,
								messages: room.messages.map((msg) => (msg.isMine ? { ...msg, isRead: true } : msg)),
							};
						}
						return room;
					})
				);
				return;
			}

			if (!content || content.trim() === '') return;
			if (String(sender) === String(myUserId)) return;

			const isCurrentlyViewing =
				currentViewingUserIdRef.current === sender || currentViewingUserIdRef.current === recipientId;

			if (isCurrentlyViewing && stompClientRef.current) {
				stompClientRef.current.publish({
					destination: '/pub/chat/private',
					body: JSON.stringify({
						type: 'read',
						roomId: sender,
						sender: myUserId,
						content: '',
					}),
				});
			}

			const newMessage = {
				id: Date.now(),
				text: content,
				time: new Date().toLocaleTimeString('ko-KR', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				}),
				isMine: false,
				isRead: false,
			};

			const roomIndex = chatRoomsRef.current.findIndex(
				(room) => (roomNo != null && String(room.id) === String(roomNo)) || room.userId === sender
			);

			if (roomIndex !== -1) {
				setChatRooms((prevRooms) => {
					const index = prevRooms.findIndex(
						(room) => (roomNo != null && String(room.id) === String(roomNo)) || room.userId === sender
					);
					if (index === -1) return prevRooms;

					const roomToUpdate = prevRooms[index];
					const otherRooms = prevRooms.filter((_, i) => i !== index);

					const updatedRoom = {
						...roomToUpdate,
						messages: [...roomToUpdate.messages, newMessage],
						lastMessage: content,
						time: newMessage.time,
						unread: isCurrentlyViewing ? 0 : (roomToUpdate.unread || 0) + 1,
					};

					return [updatedRoom, ...otherRooms];
				});
			} else {
				loadData();
			}
		},
		[myUserId, loadData]
	);

	const connectWebSocket = useCallback(() => {
		if (stompClientRef.current || isConnected) return;

		const token = getAccessToken();
		if (!token || myUserId === 'guest') return;

		try {
			const stompClient = new Client({
				webSocketFactory: () => new SockJS(WS_URL),
				connectHeaders: {
					Authorization: `Bearer ${token}`,
					'user-id': myUserId,
					login: myUserId,
				},
				reconnectDelay: 5000,
				onConnect: () => {
					setIsConnected(true);
					stompClientRef.current = stompClient;

					stompClient.subscribe(`/sub/private/${myUserId}`, (msg) => {
						const data = JSON.parse(msg.body);
						handleReceiveMessage(data);
					});
					stompClient.subscribe('/user/queue/private', (msg) => {
						const data = JSON.parse(msg.body);
						handleReceiveMessage(data);
					});
				},
				onWebSocketError: (event) => {
					console.error('❌ WebSocket 에러:', event);
				},
				onDisconnect: () => {
					setIsConnected(false);
				},
			});

			stompClient.activate();
		} catch (error) {
			console.error('❌ WebSocket 연결 오류:', error);
		}
	}, [handleReceiveMessage, isConnected, myUserId]);

	useEffect(() => {
		loadData();
		connectWebSocket();
		return () => {
			disconnectWebSocket();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleMarkAsRead = useCallback(
		(chatId) => {
			const numericChatId = Number(chatId);
			const chat = chatRoomsRef.current.find((c) => Number(c.id) === numericChatId);
			if (!chat) return;

			currentViewingUserIdRef.current = chat.userId;

			setChatRooms((prevRooms) =>
				prevRooms.map((room) => (Number(room.id) === Number(chatId) ? { ...room, unread: 0 } : room))
			);

			if (chat.id) {
				markMessageAsRead(chat.id, myUserId).catch(() => {});
			}

			if (stompClientRef.current && isConnected) {
				stompClientRef.current.publish({
					destination: '/pub/chat/private',
					body: JSON.stringify({
						type: 'read',
						roomId: chat.userId,
						sender: myUserId,
						content: '',
					}),
				});
			}
		},
		[isConnected, myUserId]
	);

	const handleLeaveChatRoom = useCallback(() => {
		currentViewingUserIdRef.current = null;
	}, []);

	const openSearchModal = useCallback(() => setIsSearchModalOpen(true), []);
	const closeSearchModal = useCallback(() => setIsSearchModalOpen(false), []);

	const handleDeleteChat = useCallback(async (chatId) => {
		await deleteDmRoom(chatId);
		setChatRooms((prevRooms) => prevRooms.filter((room) => String(room.id) !== String(chatId)));
	}, []);

	const handleAddUser = useCallback(async (user) => {
		const targetUserId = user.userId;
		const created = await createDmRoom(targetUserId);
		const createdData = created?.data ?? created;

		let roomNo = createdData?.roomNo || createdData?.roomNoString || null;
		if (!roomNo) {
			const listResp = await selectDmRoomList();
			const payload = listResp?.data ?? listResp;
			const list = Array.isArray(payload) ? payload : payload?.chatRooms || [];
			const found = list.find(
				(r) =>
					String(r.roomName) === String(targetUserId) ||
					String(r.targetUserId) === String(targetUserId) ||
					String(r.target_user_id) === String(targetUserId)
			);
			if (found) roomNo = found.roomNo || found.ROOM_NO || found.room_no;
		}

		if (!roomNo) {
			throw new Error('생성된 채팅방의 roomNo를 확인할 수 없습니다.');
		}

		const newChat = {
			id: roomNo,
			userId: user.userId,
			userName: user.userName,
			lastMessage: createdData?.lastMessage || '대화 없음',
			time: createdData?.lastSendDate || '방금',
			unread: createdData?.unreadCount || 0,
			avatar: user.profileImg || createdData?.avatar,
			messages: createdData?.messages || [],
			isPending: false,
		};

		setChatRooms((prev) => [newChat, ...prev]);
		return newChat;
	}, []);

	const handleSendMessage = useCallback(
		(chatId, messageText) => {
			const chat = chatRoomsRef.current.find((c) => String(c.id) === String(chatId));
			if (!chat) return null;

			if (stompClientRef.current && isConnected) {
				stompClientRef.current.publish({
					destination: '/pub/chat/private',
					body: JSON.stringify({
						type: 'message',
						roomNo: chat.id,
						roomId: chat.userId,
						recipientId: chat.userId,
						sender: myUserId,
						content: messageText,
					}),
				});
			}

			const newMessage = {
				id: Date.now(),
				text: messageText,
				time: new Date().toLocaleTimeString('ko-KR', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				}),
				isMine: true,
				isRead: false,
			};

			setChatRooms((prevRooms) => {
				const index = prevRooms.findIndex((room) => String(room.id) === String(chatId));
				if (index === -1) return prevRooms;

				const roomToUpdate = prevRooms[index];
				const otherRooms = prevRooms.filter((_, i) => i !== index);

				const updatedRoom = {
					...roomToUpdate,
					messages: [...roomToUpdate.messages, newMessage],
					lastMessage: messageText,
					time: newMessage.time,
				};

				return [updatedRoom, ...otherRooms];
			});

			return null;
		},
		[isConnected, myUserId]
	);

	const fetchMessages = useCallback(
		async (roomId) => {
			const resp = await selectDmMessages(roomId);
			const msgs = resp?.data ?? resp;
			if (!Array.isArray(msgs)) return msgs;

			const mapped = msgs.map((m) => {
				const rawTime =
					m.sendDate ||
					m.SEND_DATE ||
					m.createDate ||
					m.CREATE_DATE ||
					m.create_date ||
					m.createAt ||
					'';

				let timeStr = '';
				try {
					if (rawTime) {
						const str = String(rawTime);
						let dateObj = null;
						if (!isNaN(Number(str)) && !str.includes('-') && !str.includes(':')) {
							dateObj = new Date(Number(str));
						} else if (str.includes('T')) {
							dateObj = new Date(str);
						} else if (str.includes(' ')) {
							const [d, t] = str.split(' ');
							const [yyyy, mm, dd] = d.split('-').map(Number);
							const [hh, min, ss] = t.split(':').map(Number);
							dateObj = new Date(yyyy, mm - 1, dd, hh || 0, min || 0, ss || 0);
						} else {
							dateObj = new Date(str);
						}
						if (dateObj && !isNaN(dateObj.getTime())) {
							timeStr = dateObj.toLocaleTimeString('ko-KR', {
								hour: '2-digit',
								minute: '2-digit',
								hour12: true,
							});
						}
					}
				} catch {
					timeStr = String(rawTime || '');
				}

				const sender =
					m.senderId || m.senderNo || m.SENDER_NO || m.sender || m.SENDER_ID || m.senderIdString;

				return {
					id: m.messageNo || m.MESSAGE_NO || m.id || Date.now(),
					text: m.content || m.CONTENT || m.text || '',
					time: timeStr,
					isMine: String(sender) === String(myUserId),
					isRead: m.readCheck === 0 || m.readCount === 0 || m.isRead === true,
				};
			});

			setChatRooms((prev) => prev.map((room) => (String(room.id) === String(roomId) ? { ...room, messages: mapped } : room)));
			return mapped;
		},
		[myUserId]
	);

	return {
		chatRooms,
		allChats,
		totalUnread,
		isSearchModalOpen,
		isConnected,
		myUserId,
		handleMarkAsRead,
		handleLeaveChatRoom,
		handleAddUser,
		handleSendMessage,
		handleDeleteChat,
		fetchMessages,
		openSearchModal,
		closeSearchModal,
		connectWebSocket,
		disconnectWebSocket,
	};
}
