import React, { useState, useMemo, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	CircularProgress,
	Alert,
	Box,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	TextField,
	MenuItem,
	Button,
	Stack,
	Typography,
	IconButton,
	Tooltip,
	Checkbox,
	FormControlLabel,
	TextField as MuiTextField,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	FilterList as FilterIcon,
	ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

// Add this helper function to determine filter operators based on question type
const getOperatorsForType = (questionType) => {
	switch (questionType) {
		case "NUMBER":
			return ["equals", "greater than", "less than", "between"];
		case "TEXT":
			return ["contains", "equals", "starts with", "ends with"];
		case "MULTIPLE_CHOICE":
		case "CHECKBOX":
			return ["equals", "contains"];
		default:
			return ["equals", "contains"];
	}
};

const ResponseDialog = ({
	open,
	onClose,
	title,
	responses = [],
	loading,
	error,
	onFilteredUsers,
	entityType,
	onMoveToNextRound, // Add this prop
}) => {
	const [filters, setFilters] = useState([]);
	const [showFilters, setShowFilters] = useState(false);
	const [filteredResponses, setFilteredResponses] = useState(responses);
	const [selectedUsers, setSelectedUsers] = useState([]); // Add state for selected users
	const [selectAll, setSelectAll] = useState(false);
	const [numberOfUsersToSelect, setNumberOfUsersToSelect] = useState("");

	const determineQuestionType = (answer) => {
		if (typeof answer === "number") return "NUMBER";
		if (Array.isArray(answer)) return "MULTIPLE_CHOICE";
		if (typeof answer === "boolean") return "CHECKBOX";
		return "TEXT";
	};

	const questions = useMemo(() => {
		if (!responses?.length) return [];

		const questionMap = new Map();

		responses[0]?.answers?.forEach((answer) => {
			if (!questionMap?.has(answer?.questionId)) {
				questionMap?.set(answer?.questionId, {
					id: answer?.questionId,
					text: answer?.questionText || "Unnamed Question",
					type: determineQuestionType(answer?.answer),
				});
			}
		});

		return Array.from(questionMap?.values());
	}, [responses]);

	// console.log("w", questions);
	// Helper function to determine question type

	// Add a new empty filter
	const addFilter = () => {
		setFilters([
			...filters,
			{ questionId: "", operator: "", value: "", questionType: "" },
		]);
	};

	// Update filter handling
	const updateFilter = (index, field, value) => {
		const newFilters = [...filters];
		newFilters[index] = { ...newFilters[index], [field]: value };

		if (field === "questionId") {
			const question = questions.find((q) => q.id === value);
			if (question) {
				newFilters[index].questionType = question.type;
				newFilters[index].operator = getDefaultOperator(question.type);
				newFilters[index].value = getDefaultValue(question.type);
			}
		}

		setFilters(newFilters);
		console.log("Updated filters:", newFilters); // Debug log
	};

	// Helper function to get default operator
	const getDefaultOperator = (questionType) => {
		switch (questionType) {
			case "NUMBER":
				return "equals";
			case "MULTIPLE_CHOICE":
				return "contains";
			case "CHECKBOX":
				return "equals";
			default:
				return "contains";
		}
	};

	// Helper function to get default value
	const getDefaultValue = (questionType) => {
		switch (questionType) {
			case "NUMBER":
				return "";
			case "MULTIPLE_CHOICE":
				return "";
			case "CHECKBOX":
				return "false";
			default:
				return "";
		}
	};

	// Remove a filter
	const removeFilter = (index) => {
		setFilters(filters.filter((_, i) => i !== index));
	};

	// Apply filters and get matching user IDs
	const applyFilters = () => {
		const matchingResponses = responses?.filter((response) => {
			return filters?.every((filter) => {
				const answer = response?.answers?.find(
					(a) => a?.questionId === filter?.questionId
				);
				if (!answer) return false;

				const value = answer?.answer;
				switch (filter?.operator) {
					case "equals":
						return value === filter?.value;
					case "contains":
						return value?.toString()?.toLowerCase()?.includes(filter?.value?.toLowerCase());
					case "greater than":
						return Number(value) > Number(filter?.value);
					case "less than":
						return Number(value) < Number(filter?.value);
					case "between":
						const [min, max] = filter?.value?.split(",")?.map(Number);
						return Number(value) >= min && Number(value) <= max;
					case "starts with":
						return value?.toString()?.toLowerCase()?.startsWith(filter?.value?.toLowerCase());
					case "ends with":
						return value?.toString()?.toLowerCase()?.endsWith(filter?.value?.toLowerCase());
					default:
						return true;
				}
			});
		});

		setFilteredResponses(matchingResponses);
		setSelectedUsers(matchingResponses?.map((response) => response?.user?.userId));
		onFilteredUsers?.(matchingResponses?.map((response) => response?.user?.userId));
	};

	const handleSelectAll = (event) => {
		setSelectAll(event?.target?.checked);
		setNumberOfUsersToSelect("");

		if (event?.target?.checked) {
			const allUserIds = filteredResponses?.map(
				(response) => response?.user?.userId
			);
			setSelectedUsers(allUserIds);
		} else {
			setSelectedUsers([]);
		}
	};

	const handleNumberOfUsersChange = (event) => {
		const value = event?.target?.value;
		setNumberOfUsersToSelect(value);
		setSelectAll(false);

		if (value && !isNaN(value)) {
			const numUsers = Math.min(Number(value), filteredResponses?.length || 0);
			const sortedResponses = [...(filteredResponses || [])]?.sort(
				(a, b) => new Date(a?.submittedAt) - new Date(b?.submittedAt)
			);

			const topNUsers = sortedResponses
				?.slice(0, numUsers)
				?.map((response) => response?.user?.userId);

			setSelectedUsers(topNUsers);
		} else {
			setSelectedUsers([]);
		}
	};

	useEffect(() => {
		// Reset selections when responses change
		setSelectedUsers([]);
		setSelectAll(false);
		setNumberOfUsersToSelect("");
	}, [filteredResponses]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="xl"
		>
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "primary.contrastText",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				{title}
				<Button
					startIcon={<FilterIcon />}
					onClick={() => setShowFilters(!showFilters)}
					variant="contained"
					color="inherit"
					size="small"
				>
					Filters
				</Button>
			</DialogTitle>

			<DialogContent>
				{/* Filters Section */}
				<Accordion
					expanded={showFilters}
					onChange={() => setShowFilters(!showFilters)}
					sx={{ mb: 2 }}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<FilterIcon />
							<span>Filters ({filters.length})</span>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={2}>
							{filters.map((filter, index) => (
								<Box
									key={index}
									sx={{
										display: "flex",
										gap: 2,
										alignItems: "center",
										bgcolor: "background.paper",
										p: 2,
										borderRadius: 1,
										boxShadow: 1,
									}}
								>
									<TextField
										select
										label="Question"
										value={filter.questionId || ""}
										onChange={(e) =>
											updateFilter(index, "questionId", e.target.value)
										}
										sx={{ minWidth: 250 }}
									>
										{questions.map((q) => (
											<MenuItem
												key={q.id}
												value={q.id}
											>
												{q.text} ({q.type.toLowerCase()})
											</MenuItem>
										))}
									</TextField>

									{filter.questionId && (
										<>
											<TextField
												select
												label="Operator"
												value={filter.operator || ""}
												onChange={(e) =>
													updateFilter(index, "operator", e.target.value)
												}
												sx={{ minWidth: 150 }}
											>
												{getOperatorsForType(filter.questionType).map((op) => (
													<MenuItem
														key={op}
														value={op}
													>
														{op}
													</MenuItem>
												))}
											</TextField>

											<TextField
												label="Value"
												value={filter.value}
												onChange={(e) =>
													updateFilter(index, "value", e.target.value)
												}
												sx={{ minWidth: 200 }}
												helperText={
													filter.operator === "between"
														? "Enter as: min,max"
														: ""
												}
											/>
										</>
									)}

									<Button
										color="error"
										variant="outlined"
										onClick={() => removeFilter(index)}
									>
										Remove
									</Button>
								</Box>
							))}

							<Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
								<Button onClick={addFilter}>Add Filter</Button>
								<Button
									variant="contained"
									onClick={applyFilters}
									disabled={filters.length === 0}
								>
									Apply Filters
								</Button>
							</Box>
						</Stack>
					</AccordionDetails>
				</Accordion>

				{loading && (
					<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
						<CircularProgress />
					</Box>
				)}

				{error && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{error}
					</Alert>
				)}

				{!loading && !responses?.length && (
					<Alert severity="info">No responses found</Alert>
				)}

				{responses?.length > 0 && (
					<>
						<Typography
							variant="h6"
							gutterBottom
						>
							{filters?.length > 0
								? `Showing ${filteredResponses?.length} of ${responses?.length} responses`
								: `All responses (${responses?.length})`}
						</Typography>
						<div className="overflow-x-auto">
							<table className="w-full text-sm border-collapse">
								<thead>
									<tr className="bg-gray-50">
										<th className="sticky left-0 z-10 p-4 text-left border-b border-gray-200 bg-gray-50">
											User Email
										</th>
										<th className="sticky left-40 z-10 p-4 text-left border-b border-gray-200 bg-gray-50">
											Submission Date
										</th>

										{/* Dynamically Render Question Headers */}
										{questions.map((question, index) => (
											<th
												key={index}
												className="p-4 text-left border-b border-gray-200 bg-gray-50"
											>
												<div className="flex items-center gap-2">
													<span
														className={`inline-block w-2 h-2 rounded-full 
				${
					question.type === "TEXT"
						? "bg-green-500"
						: question.type === "MULTIPLE_CHOICE"
						? "bg-blue-500"
						: "bg-purple-500"
				}`}
													/>
													{question.text || "Unnamed Question"}
												</div>
											</th>
										))}
									</tr>
								</thead>

								<tbody>
									{(filters?.length > 0 ? filteredResponses : responses)?.map(
										(response, index) => (
											<tr
												key={index}
												className={`hover:bg-gray-50 ${
													index % 2 === 0 ? "bg-white" : "bg-gray-50"
												}`}
											>
												<td className="sticky left-0 p-4 border-b border-gray-200 bg-white">
													{response?.user?.email || "Unknown"}
												</td>
												<td className="sticky left-40 p-4 border-b border-gray-200 bg-white">
													{response?.submittedAt
														? new Date(
																response.submittedAt
														  ).toLocaleDateString()
														: "N/A"}
												</td>

												{/* Dynamically Render Answers */}
												{response.answers && response.answers.length > 0 ? (
													response.answers.map((answer, idx) => (
														<td
															key={idx}
															className="p-4 border-b border-gray-200"
														>
															{Array?.isArray(answer?.answer)
																? answer?.answer?.join(", ")
																: answer?.answer || "No response"}
														</td>
													))
												) : (
													<td
														colSpan={questions.length}
														className="p-4 text-center border-b border-gray-200"
													>
														No answers provided
													</td>
												)}
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
						{/* Add this after the table div */}
						{entityType !== "Event" && filteredResponses?.length > 0 && (
							<Box
								sx={{
									mt: 2,
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									flexWrap: "wrap",
									gap: 2,
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
									<FormControlLabel
										control={
											<Checkbox
												checked={selectAll}
												onChange={handleSelectAll}
												color="primary"
											/>
										}
										label="Select All"
									/>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<MuiTextField
											type="number"
											size="small"
											label="Select Top N"
											value={numberOfUsersToSelect}
											onChange={handleNumberOfUsersChange}
											inputProps={{
												min: 1,
												max: filteredResponses.length,
												step: 1,
											}}
											sx={{ width: 120 }}
											error={numberOfUsersToSelect > filteredResponses.length}
											helperText={
												numberOfUsersToSelect > filteredResponses.length
													? `Max ${filteredResponses.length}`
													: ""
											}
											onBlur={() => {
												if (numberOfUsersToSelect > filteredResponses.length) {
													setNumberOfUsersToSelect(
														filteredResponses.length.toString()
													);
													handleNumberOfUsersChange({
														target: {
															value: filteredResponses.length.toString(),
														},
													});
												}
											}}
										/>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											of {filteredResponses.length}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{selectedUsers.length} users selected
									</Typography>
									<Tooltip title="Move selected users to next round">
										<Button
											variant="contained"
											color="primary"
											startIcon={<ArrowForwardIcon />}
											onClick={() => onMoveToNextRound?.(selectedUsers)}
											disabled={selectedUsers.length === 0}
										>
											Move to Next Round
										</Button>
									</Tooltip>
								</Box>
							</Box>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ResponseDialog;
