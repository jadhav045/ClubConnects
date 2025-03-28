import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";
import DiscussionCard from "./DiscussionCard";

import { useNavigate } from "react-router-dom";
import CreateDiscussion from "./CreateDiscussion";
import {
	DISCUSSION_CATEGORIES,
	SORT_OPTIONS,
} from "../../../constants/discussionContansts";

import useAllDiscussion from "../../../hooks/useAllDiscussions";

const MyEditor = () => {
	const dispatch = useDispatch();
	const { discusss, isLoading } = useSelector((store) => store.discuss);
	const { user } = useSelector((store) => store.auth);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);
	const [showEditor, setShowEditor] = useState(false);

	console.log(discusss);
	useAllDiscussion();

	const filteredAndSortedDiscussions = useMemo(() => {
		let filtered = [...(discusss || [])]; // Create a new array to avoid mutation

		if (selectedCategories?.length > 0) {
			filtered = filtered.filter((discussion) =>
				selectedCategories.includes(discussion?.category)
			);
		}

		return filtered.sort((a, b) => {
			switch (sortBy) {
				case SORT_OPTIONS.RECENT:
					return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
				case SORT_OPTIONS.TRENDING:
					const bEngagement =
						(b?.appreciations?.length || 0) + (b?.comments?.length || 0);
					const aEngagement =
						(a?.appreciations?.length || 0) + (a?.comments?.length || 0);
					return bEngagement - aEngagement;
				case SORT_OPTIONS.MOST_APPRECIATED:
					return (
						(b?.appreciations?.length || 0) - (a?.appreciations?.length || 0)
					);
				case SORT_OPTIONS.MY_DISCUSSIONS:
					if (b?.createdBy?._id === user?._id) return -1;
					if (a?.createdBy?._id === user?._id) return 1;
					return 0;
				default:
					return 0;
			}
		});
	}, [discusss, selectedCategories, sortBy, user?._id]);

	const handleCategoryToggle = (category) => {
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((c) => c !== category);
			}
			return [...prev, category];
		});
	};

	const handleDiscussionChange = async () => {
		await fetchDiscussions();
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

	console.log(filteredAndSortedDiscussions);

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-xl font-bold mb-4">Discussions</h1>

			<div className="mb-6">
				<h2 className="text-lg font-semibold mb-3">Filter by Categories:</h2>
				<div className="flex flex-wrap gap-2">
					{DISCUSSION_CATEGORIES.map((category) => (
						<button
							key={category}
							onClick={() => handleCategoryToggle(category)}
							className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${
									selectedCategories.includes(category)
										? "bg-blue-500 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
						>
							{category}
							{selectedCategories.includes(category) && (
								<span className="ml-2">✓</span>
							)}
						</button>
					))}
				</div>
				{selectedCategories.length > 0 && (
					<button
						onClick={() => setSelectedCategories([])}
						className="mt-2 text-sm text-blue-500 hover:underline"
					>
						Clear filters
					</button>
				)}
			</div>

			<div className="mb-6">
				<h2 className="text-lg font-semibold mb-3">Sort Discussions:</h2>
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => setSortBy(SORT_OPTIONS.RECENT)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
								sortBy === SORT_OPTIONS.RECENT
									? "bg-blue-500 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
					>
						Most Recent
					</button>
					<button
						onClick={() => setSortBy(SORT_OPTIONS.TRENDING)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
								sortBy === SORT_OPTIONS.TRENDING
									? "bg-blue-500 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
					>
						Trending
					</button>
					<button
						onClick={() => setSortBy(SORT_OPTIONS.MOST_APPRECIATED)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
								sortBy === SORT_OPTIONS.MOST_APPRECIATED
									? "bg-blue-500 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
					>
						Most Appreciated
					</button>
					<button
						onClick={() => setSortBy(SORT_OPTIONS.MY_DISCUSSIONS)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
								sortBy === SORT_OPTIONS.MY_DISCUSSIONS
									? "bg-blue-500 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
					>
						My Discussions
					</button>
				</div>
			</div>

			<button
				onClick={() => setShowEditor(true)}
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
			>
				Create New Discussion
			</button>

			{selectedCategories.length > 0 && (
				<div className="mt-4 text-sm text-gray-600">
					Showing discussions in {selectedCategories.length}
					{selectedCategories.length === 1 ? " category" : " categories"}
				</div>
			)}

			<div className="mt-8">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
						<p className="mt-4 text-gray-600">
							{selectedCategories.length > 0
								? "Filtering discussions..."
								: "Loading discussions..."}
						</p>
					</div>
				) : filteredAndSortedDiscussions.length === 0 ? (
					<div className="text-center py-8">
						<div className="text-gray-400 mb-4">
							<svg
								className="mx-auto h-12 w-12"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
								/>
							</svg>
						</div>
						<p className="text-gray-600 text-lg font-medium">
							{getEmptyStateMessage()}
						</p>
						<button
							onClick={() => {
								setSelectedCategories([]);
								setSortBy(SORT_OPTIONS.RECENT);
							}}
							className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
						>
							View all discussions
						</button>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex justify-between items-center mb-4">
							<p className="text-sm text-gray-600">
								Found {filteredAndSortedDiscussions.length}
								{sortBy === SORT_OPTIONS.MY_DISCUSSIONS ? " of your" : ""}
								{selectedCategories.length > 0 ? " filtered" : ""} discussions
							</p>
						</div>

						{filteredAndSortedDiscussions?.map((discussion) => (
							<DiscussionCard
								key={discussion?._id}
								discussion={discussion}
								currentUser={user}
								onDiscussionChange={handleDiscussionChange}
							/>
						))}
					</div>
				)}
			</div>

			{showEditor && (
				<CreateDiscussion
					onClose={(newDiscussion) => {
						if (newDiscussion) {
							setDiscussions((prev) => [...prev, newDiscussion]);
						}
						setShowEditor(false);
					}}
				/>
			)}
		</div>
	);
};

const FilterChips = memo(
	({ categories, selectedCategories, onToggle, onClear }) => {
		return (
			<nav
				aria-label="Discussion categories"
				className="mb-6"
			>
				<h2 className="text-lg font-semibold mb-3">Filter by Categories:</h2>
				<div
					className="flex flex-wrap gap-2"
					role="list"
				>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => onToggle(category)}
							role="listitem"
							aria-pressed={selectedCategories.includes(category)}
							className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
				${
					selectedCategories.includes(category)
						? "bg-blue-500 text-white transform scale-105"
						: "bg-gray-100 text-gray-700 hover:bg-gray-200"
				}`}
						>
							{category}
							{selectedCategories.includes(category) && (
								<span
									className="ml-2"
									aria-hidden="true"
								>
									✓
								</span>
							)}
						</button>
					))}
				</div>
				{selectedCategories.length > 0 && (
					<button
						onClick={onClear}
						className="mt-2 text-sm text-blue-500 hover:underline"
					>
						Clear filters
					</button>
				)}
			</nav>
		);
	}
);
export default MyEditor;
