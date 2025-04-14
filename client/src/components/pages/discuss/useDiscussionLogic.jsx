import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { SORT_OPTIONS } from "../../../constants/discussionContansts";
import useAllDiscussions from "../../../hooks/useAllDiscussions";

const useDiscussionLogic = () => {
	const { discusss, isLoading } = useSelector((store) => store.discuss);
	const { user } = useSelector((store) => store.auth);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);
	const [showEditor, setShowEditor] = useState(false);

	useAllDiscussions();

	const filteredAndSortedDiscussions = useMemo(() => {
		let filtered = discusss ? [...discusss] : [];

		if (selectedCategories.length > 0) {
			filtered = filtered.filter((discussion) =>
				selectedCategories.includes(discussion?.category)
			);
		}

		return [...filtered].sort((a, b) => {
			switch (sortBy) {
				case SORT_OPTIONS.RECENT:
					return new Date(b?.createdAt) - new Date(a?.createdAt);
				case SORT_OPTIONS.TRENDING:
					return (
						(b?.appreciations?.length || 0) +
						(b?.comments?.length || 0) -
						((a?.appreciations?.length || 0) + (a?.comments?.length || 0))
					);
				case SORT_OPTIONS.MOST_APPRECIATED:
					return (
						(b?.appreciations?.length || 0) - (a?.appreciations?.length || 0)
					);
				case SORT_OPTIONS.MY_DISCUSSIONS:
					return b?.createdBy?._id === user?._id ? 1 : -1;
				default:
					return 0;
			}
		});
	}, [discusss, selectedCategories, sortBy, user]);

	const handleCategoryToggle = (category) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category]
		);
	};

	const handleSortChange = (sortOption) => {
		setSortBy(sortOption);
	};

	const getEmptyStateMessage = () => {
		if (
			selectedCategories.length > 0 &&
			sortBy === SORT_OPTIONS.MY_DISCUSSIONS
		) {
			return "You haven't created any discussions in these categories yet";
		}
		if (selectedCategories.length > 0) {
			return "No discussions found in selected categories";
		}
		if (sortBy === SORT_OPTIONS.MY_DISCUSSIONS) {
			return "You haven't created any discussions yet";
		}
		if (sortBy === SORT_OPTIONS.MOST_APPRECIATED) {
			return "No appreciated discussions found";
		}
		if (sortBy === SORT_OPTIONS.TRENDING) {
			return "No trending discussions at the moment";
		}
		return "No discussions found";
	};

	return {
		isLoading,
		filteredAndSortedDiscussions,
		selectedCategories,
		sortBy,
		showEditor,
		setShowEditor,
		handleCategoryToggle,
		handleSortChange,
		setSelectedCategories,
		getEmptyStateMessage,
	};
};

export default useDiscussionLogic;
