import { useCallback, useEffect, useMemo, useState } from "react";

import { searchFeedsByTag, searchMembers } from "../api";

export const useSearch = () => {
	const [keyword, setKeyword] = useState("");
	const [searchType, setSearchType] = useState("account"); // 'account' | 'tag'
	const [members, setMembers] = useState([]);
	const [feeds, setFeeds] = useState([]);
	const [loading, setLoading] = useState(false);

	const executeSearch = useCallback(async (searchKeyword) => {
		if (!searchKeyword.trim()) {
			setMembers([]);
			setFeeds([]);
			return;
		}

		setLoading(true);
		try {
			if (searchKeyword.startsWith("#")) {
				setSearchType("tag");

				const tagKeyword = searchKeyword.substring(1);
				if (!tagKeyword.trim()) {
					setFeeds([]);
					return;
				}

				const data = await searchFeedsByTag(tagKeyword);
				setFeeds(data);
				setMembers([]);
			} else {
				setSearchType("account");
				const data = await searchMembers(searchKeyword);
				setMembers(data);
				setFeeds([]);
			}
		} catch (error) {
			console.error("검색 오류:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			executeSearch(keyword);
		}, 300);

		return () => clearTimeout(timer);
	}, [keyword, executeSearch]);

	const isTagKeyword = useMemo(() => keyword.startsWith("#"), [keyword]);

	return {
		keyword,
		setKeyword,
		searchType,
		isTagKeyword,
		members,
		feeds,
		loading,
	};
};
