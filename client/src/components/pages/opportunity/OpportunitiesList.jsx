import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpportunities } from "../../../hooks/useAllOpportunity";
import { setPage, setType } from "../../../store/slice/opportunitySlice";
import {
	Box,
	Typography,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Stack,
	Pagination,
	Button,
	Grid, // Add this import
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import OpportunityCard from "./OpportunityCard";
import { useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";

const OPPORTUNITY_TYPES = [
	{ value: "", label: "All" },
	{ value: "Industry Project", label: "Industry Project" },
	{ value: "Internship", label: "Internship" },
	{ value: "Job", label: "Job" },
	{ value: "Research", label: "Research" },
	{ value: "Other", label: "Other" },
];

const OpportunitiesList = () => {
	const dispatch = useDispatch();

	const { items, loading, error, page, limit, totalPages, type } = useSelector(
		(state) => state.opportunities
	);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchOpportunities({ page, limit, type }));
	}, [dispatch, page, type]);

	const handleTypeChange = (event) => {
		dispatch(setType(event.target.value));
		dispatch(setPage(1)); // Reset to first page when filter changes
	};

	const handleEdit = (opportunity) => {
		// Add edit logic here
		console.log("Edit opportunity:", opportunity);
	};

	const handleDelete = async (id) => {
		// Add delete logic here
		console.log("Delete opportunity:", id);
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			dispatch(setPage(page - 1));
		}
	};

	const handleNextPage = () => {
		if (page < totalPages) {
			dispatch(setPage(page + 1));
		}
	};

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography
					variant="h4"
					gutterBottom
				>
					Opportunities
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={() => navigate("/alumni/opportunities/create")}
				>
					Create Opportunity
				</Button>
			</Box>

			{/* Move the filter box below the header */}
			<Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id="type-filter-label">Filter by Type</InputLabel>
					<Select
						labelId="type-filter-label"
						value={type}
						label="Filter by Type"
						onChange={handleTypeChange}
					>
						{OPPORTUNITY_TYPES.map((option) => (
							<MenuItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{loading && (
				<Box sx={{ textAlign: "center", py: 3 }}>
					<Typography>Loading opportunities...</Typography>
				</Box>
			)}

			{error && (
				<Box sx={{ textAlign: "center", py: 3, color: "error.main" }}>
					<Typography>Error: {error}</Typography>
				</Box>
			)}

			<Grid
				container
				spacing={2}
			>
				{items.map((opportunity) => (
					<Grid
						item
						xs={12}
						md={6}
						key={opportunity._id}
					>
						<OpportunityCard opportunity={opportunity} />
					</Grid>
				))}
			</Grid>

			{totalPages > 1 && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mt: 3,
						px: 2,
					}}
				>
					<Button
						startIcon={<NavigateBefore />}
						onClick={handlePreviousPage}
						disabled={page === 1 || loading}
						variant="outlined"
					>
						Previous
					</Button>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Page {page} of {totalPages}
					</Typography>
					<Button
						endIcon={<NavigateNext />}
						onClick={handleNextPage}
						disabled={page === totalPages || loading}
						variant="outlined"
					>
						Next
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default OpportunitiesList;
