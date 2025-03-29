import { useState } from "react";
import { useSelector } from "react-redux";
// import { PlusIcon } from "@heroicons/react/24/outline";
import { FiPlus } from 'react-icons/fi';
import useDiscussionLogic from "./useDiscussionLogic";
import DiscussionCard from "./DiscussionCard";
import CreateDiscussion from "./CreateDiscussion";
import {
	DISCUSSION_CATEGORIES,
	SORT_OPTIONS,
} from "../../../constants/discussionContansts";

const MyEditor = () => {
	const {
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
	} = useDiscussionLogic();

	const { user } = useSelector((store) => store.auth);

	return (
		<div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-gray-900">
					Community Discussions
				</h1>
				<button
					onClick={() => setShowEditor(true)}
					className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
				>
					<FiPlus className="w-5 h-5" />
					New Discussion
				</button>
			</header>

			{/* Filters Section */}
			<div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-gray-100">
				<div className="mb-6">
					<h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
						Filter by Categories
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
						{DISCUSSION_CATEGORIES.map((category) => (
							<button
								key={category}
								onClick={() => handleCategoryToggle(category)}
								className={`flex items-center justify-center text-sm px-3 py-1.5 rounded-md transition-all
                  ${
										selectedCategories.includes(category)
											? "bg-indigo-100 text-indigo-700 font-medium ring-1 ring-indigo-500"
											: "text-gray-600 hover:bg-gray-50 hover:ring-1 hover:ring-gray-200"
									}`}
							>
								{category}
							</button>
						))}
					</div>
					{selectedCategories.length > 0 && (
						<button
							onClick={() => setSelectedCategories([])}
							className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
						>
							Clear all filters
						</button>
					)}
				</div>

				<div className="border-t border-gray-200 pt-6">
					<h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
						Sort Options
					</h2>
					<div className="inline-flex rounded-lg bg-gray-50 p-1 border border-gray-200">
						{Object.values(SORT_OPTIONS).map((option) => (
							<button
								key={option}
								onClick={() => handleSortChange(option)}
								className={`px-4 py-2 text-sm font-medium transition-colors rounded-md
                  ${
										sortBy === option
											? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
											: "text-gray-600 hover:text-indigo-600"
									}`}
							>
								{option.replace("_", " ")}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="space-y-6">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-12 space-y-4">
						<div className="animate-pulse rounded-full h-12 w-12 bg-indigo-100"></div>
						<p className="text-gray-600 text-sm">Loading discussions...</p>
					</div>
				) : filteredAndSortedDiscussions.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="mb-4 mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
							<span className="text-3xl">💬</span>
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{getEmptyStateMessage()}
						</h3>
						<p className="text-gray-600 mb-4 max-w-md mx-auto">
							{selectedCategories.length > 0
								? "Try clearing filters or create a new discussion"
								: "Be the first to start a conversation"}
						</p>
						<button
							onClick={() => setShowEditor(true)}
							className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
						>
							Create new discussion
						</button>
					</div>
				) : (
					<div className="grid gap-4">
						{filteredAndSortedDiscussions.map((discussion) => (
							<DiscussionCard
								key={discussion._id}
								discussion={discussion}
								currentUser={user}
								className="hover:shadow-md transition-shadow"
							/>
						))}
					</div>
				)}
			</div>

			{showEditor && <CreateDiscussion onClose={() => setShowEditor(false)} />}
		</div>
	);
};

export default MyEditor;
