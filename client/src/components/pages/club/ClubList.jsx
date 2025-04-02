import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
	Grid,
} from "@mui/material";
import {
	NavigateBefore,
	NavigateNext,
	Add as AddIcon,
} from "@mui/icons-material";
import ClubCard from "./ClubCard";
import { useNavigate } from "react-router-dom";
import { fetchClubs } from "../../../hooks/useAllClubs";
import { setPage, setType } from "../../../store/slice/clubSlice";

const CLUB_TYPES = [
	{ value: "", label: "All" },
	{ value: "Technical", label: "Technical" },
	{ value: "Cultural", label: "Cultural" },
	{ value: "Sports", label: "Sports" },
	{ value: "Social", label: "Social" },
	{ value: "Other", label: "Other" },
];

const ClubList = () => {
	const dispatch = useDispatch();
	const clubState = useSelector((state) => {
		return state.club; // This should match the reducer name in store.js
	});

	const {
		items = [],
		loading = false,
		error,
		page = 1,
		limit = 10,
		totalPages = 1,
		type = "",
	} = clubState ?? {}; // Use nullish coalescing for better null handling

	useEffect(() => {
		dispatch(fetchClubs({ page, limit, type }));
	}, [dispatch, page, limit, type]);

	const handleTypeChange = (event) => {
		dispatch(setType(event.target.value));
		dispatch(setPage(1)); // Reset to first page when filter changes
	};

	console.log(items);
	const handleEdit = (club) => {
		console.log("Edit club:", club);
	};

	const handleDelete = async (id) => {
		console.log("Delete club:", id);
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
					Clubs
				</Typography>
			</Box>

			{/* Filter Box */}
			<Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id="type-filter-label">Filter by Type</InputLabel>
					<Select
						labelId="type-filter-label"
						value={type}
						label="Filter by Type"
						onChange={handleTypeChange}
					>
						{CLUB_TYPES.map((option) => (
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
					<Typography>Loading clubs...</Typography>
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
				{!loading && items && items.length > 0 ? (
					items.map((club) => (
						<Grid
							item
							xs={12}
							md={6}
							key={club._id}
						>
							<ClubCard
								club={club}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						</Grid>
					))
				) : !loading ? (
					<Box sx={{ width: "100%", textAlign: "center", py: 3 }}>
						<Typography color="text.secondary">No clubs found</Typography>
					</Box>
				) : null}
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

export default ClubList;
