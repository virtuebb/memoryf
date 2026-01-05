import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getLikedFeeds, getCommentedFeeds, toggleLike, getAccountHistory } from '../api';
import { deleteComment } from '../../../entities/comment';
import { getMemberNoFromToken } from '../../../shared/lib';

export function useActivitySection() {
	const navigate = useNavigate();
	const location = useLocation();

	const [activeSidebar, setActiveSidebar] = useState('interactions');
	const [activeTab, setActiveTab] = useState('likes');
	const [items, setItems] = useState([]);
	const [historyItems, setHistoryItems] = useState([]);
	const [loading, setLoading] = useState(false);

	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedItems, setSelectedItems] = useState(new Set());

	const [filter, setFilter] = useState({
		sortBy: 'recent',
		startDate: '',
		endDate: '',
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [tempFilter, setTempFilter] = useState({ ...filter });
	const [dateSelection, setDateSelection] = useState({
		startYear: '',
		startMonth: '',
		startDay: '',
		endYear: '',
		endMonth: '',
		endDay: '',
	});

	const tokenMemberNo = getMemberNoFromToken();
	const memberNo = tokenMemberNo || localStorage.getItem('memberNo');

	const sidebarItems = useMemo(
		() => [
			{
				id: 'interactions',
				icon: '⇄',
				title: '반응',
				desc: '좋아요, 댓글 및 회원님의 기타 반응을 검토하고 삭제합니다.',
			},
			{
				id: 'history',
				icon: '📅',
				title: '계정 내역',
				desc: '계정을 만든 이후 적용한 변경 사항을 검토해보세요.',
			},
		],
		[]
	);

	const tabs = useMemo(
		() => [
			{ id: 'likes', label: '좋아요', icon: '♡' },
			{ id: 'comments', label: '댓글', icon: '💬' },
		],
		[]
	);

	const { years, months, days } = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return {
			years: Array.from({ length: 30 }, (_, i) => currentYear - i),
			months: Array.from({ length: 12 }, (_, i) => i + 1),
			days: Array.from({ length: 31 }, (_, i) => i + 1),
		};
	}, []);

	const fetchItems = async () => {
		if (!memberNo) return;
		setLoading(true);
		try {
			const params = {
				memberNo,
				sortBy: filter.sortBy,
				startDate: filter.startDate,
				endDate: filter.endDate,
			};

			const data = activeTab === 'likes' ? await getLikedFeeds(params) : await getCommentedFeeds(params);
			setItems(data.list || []);
		} catch (error) {
			console.error('데이터 로딩 실패:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchHistory = async () => {
		if (!memberNo) return;
		setLoading(true);
		try {
			const params = {
				sortBy: filter.sortBy === 'recent' ? 'newest' : 'oldest',
				startDate: filter.startDate,
				endDate: filter.endDate,
			};
			const data = await getAccountHistory(memberNo, params);
			setHistoryItems(data.list || []);
		} catch (error) {
			console.error('계정 내역 로딩 실패:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!memberNo) {
			console.warn('회원 정보를 찾을 수 없어 활동/계정 내역을 불러오지 않습니다.');
			return;
		}

		if (activeSidebar === 'interactions') {
			fetchItems();
			setIsSelectionMode(false);
			setSelectedItems(new Set());
			return;
		}

		if (activeSidebar === 'history') {
			fetchHistory();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeSidebar, activeTab, filter, memberNo]);

	const handleOpenModal = () => {
		setTempFilter({ ...filter });

		const parseDate = (dateStr, prefix) => {
			if (!dateStr)
				return { [`${prefix}Year`]: '', [`${prefix}Month`]: '', [`${prefix}Day`]: '' };
			const [y, m, d] = dateStr.split('-');
			return {
				[`${prefix}Year`]: parseInt(y),
				[`${prefix}Month`]: parseInt(m),
				[`${prefix}Day`]: parseInt(d),
			};
		};

		setDateSelection({
			...parseDate(filter.startDate, 'start'),
			...parseDate(filter.endDate, 'end'),
		});

		setIsModalOpen(true);
	};

	const handleApplyFilter = () => {
		const formatDate = (y, m, d) => {
			if (!y || !m || !d) return '';
			return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
		};

		const newStartDate = formatDate(dateSelection.startYear, dateSelection.startMonth, dateSelection.startDay);
		const newEndDate = formatDate(dateSelection.endYear, dateSelection.endMonth, dateSelection.endDay);

		setFilter({
			sortBy: tempFilter.sortBy,
			startDate: newStartDate,
			endDate: newEndDate,
		});
		setIsModalOpen(false);
	};

	const handleDateSelect = (field, value) => {
		setDateSelection((prev) => ({ ...prev, [field]: value }));
	};

	const toggleSelectionMode = () => {
		if (isSelectionMode) {
			setIsSelectionMode(false);
			setSelectedItems(new Set());
			return;
		}
		setIsSelectionMode(true);
	};

	const handleItemClick = (item) => {
		const itemId = activeTab === 'likes' ? item.feedNo : item.commentNo;

		if (isSelectionMode) {
			const newSelected = new Set(selectedItems);
			if (newSelected.has(itemId)) {
				newSelected.delete(itemId);
			} else {
				newSelected.add(itemId);
			}
			setSelectedItems(newSelected);
			return;
		}

		navigate(`/feeds/${item.feedNo}`, { state: { backgroundLocation: location } });
	};

	const handleActionSelected = async () => {
		if (selectedItems.size === 0) return;

		const actionName = activeTab === 'likes' ? '좋아요 취소' : '삭제';
		if (!window.confirm(`${selectedItems.size}개의 항목을 ${actionName}하시겠습니까?`)) return;

		try {
			const promises = Array.from(selectedItems).map((id) => {
				if (activeTab === 'likes') {
					return toggleLike(id, memberNo);
				}

				const comment = items.find((it) => it.commentNo === id);
				if (!comment) return Promise.resolve();

				return deleteComment(comment.feedNo, id).then((res) => {
					if (res?.success === false) {
						throw new Error(res?.message || '댓글 삭제에 실패했습니다.');
					}
				});
			});

			await Promise.all(promises);

			await fetchItems();
			setIsSelectionMode(false);
			setSelectedItems(new Set());
		} catch (error) {
			console.error('작업 처리 실패:', error);
			alert('일부 작업을 처리하는 중 오류가 발생했습니다.');
		}
	};

	return {
		memberNo,
		// ui constants
		sidebarItems,
		tabs,
		years,
		months,
		days,
		// state
		activeSidebar,
		setActiveSidebar,
		activeTab,
		setActiveTab,
		items,
		historyItems,
		loading,
		isSelectionMode,
		selectedItems,
		filter,
		isModalOpen,
		setIsModalOpen,
		tempFilter,
		setTempFilter,
		dateSelection,
		// handlers
		handleOpenModal,
		handleApplyFilter,
		handleDateSelect,
		toggleSelectionMode,
		handleItemClick,
		handleActionSelected,
	};
}
