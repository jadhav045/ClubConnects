import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Grid } from "@mui/material";
import ClubCard from "./ClubCard";
import useAllClubs from "../../../hooks/useAllClubs";

const ClubList = () => {
	useAllClubs();

	const { clubs } = useSelector((store) => store.cl);

	const handleEdit = (club) => {
		console.log("Edit club:", club);
	};

	const handleDelete = (id) => {
		console.log("Delete club:", id);
	};

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
			<Typography
				variant="h4"
				gutterBottom
			>
				Clubs
			</Typography>

			<Grid
				container
				spacing={2}
			>
				{clubs && clubs.length > 0 ? (
					clubs.map((club) => (
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
				) : (
					<Box sx={{ width: "100%", textAlign: "center", py: 3 }}>
						<Typography color="text.secondary">No clubs found</Typography>
					</Box>
				)}
			</Grid>
		</Box>
	);
};

export default ClubList;
