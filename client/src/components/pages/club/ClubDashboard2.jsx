import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import {
	Box,
	Typography,
	Avatar,
	Grid,
	Card,
	CardContent,
	IconButton,
	Divider,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
} from "@mui/material";
import {
	LinkedIn,
	Twitter,
	GitHub,
	Language,
	CalendarToday,
	Article,
	ArrowForwardIos,
} from "@mui/icons-material";
import AddClubMember from "./AddClubMembe";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../routes/apiConfig";

const Dashboard2 = ({ club }) => {
	const {
		clubName,
		shortName,
		motto,
		description,
		logo,
		socialLinks,
		members,
		followers,
		achievements,
		events,
		posts,
		foundingYear,
	} = club;

	const [openAddMember, setOpenAddMember] = React.useState(false);
	const handleOpenAddMember = () => setOpenAddMember(true);
	const handleCloseAddMember = () => setOpenAddMember(false);

	const getMembersByRole = (role) => members.find((m) => m.role === role);

	const statCards = [
		{
			label: "Active Members",
			value: members.length,
			users: members,
		},
		{
			label: "Followers",
			value: followers.length,
			users: followers,
		},
	];
	const socialIcons = [
		{ icon: <LinkedIn />, url: socialLinks?.linkedIn || "link" },
		{ icon: <Twitter />, url: socialLinks?.twitter || "twi" },
		{ icon: <GitHub />, url: socialLinks?.github || "git" },
		{ icon: <Language />, url: socialLinks?.personalWebsite || "lan" },
	];

	console.log("Club Members", club.members[0].userId.fullName);
	// List
	const [openUserList, setOpenUserList] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [selectedTitle, setSelectedTitle] = useState("");

	const user = getUser();
	const navigate = useNavigate();
	const handleViewProfile = () => {
		if (club?._id) {
			navigate(`/${user.role}/clubs/${club._id}`, { state: { club } });
		}
	};

	return (
		<Box p={3}>
			<Grid
				container
				spacing={3}
			>
				{/* Club Overview */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card variant="outlined">
						<CardContent>
							<Box
								display="flex"
								alignItems="center"
								gap={2}
							>
								<Avatar
									src={logo}
									alt={clubName}
									sx={{ width: 64, height: 64 }}
								/>
								<Box>
									<Typography
										variant="h6"
										fontWeight="bold"
									>
										{clubName}
									</Typography>
									<Typography
										variant="subtitle2"
										color="text.secondary"
									>
										{shortName}
									</Typography>
									<Typography
										variant="body2"
										fontStyle="italic"
									>
										{motto}
									</Typography>
								</Box>
							</Box>
							<Typography
								mt={2}
								variant="body2"
							>
								{description} Founded in {foundingYear}.
							</Typography>
							<Box
								mt={2}
								display="flex"
								gap={1}
							>
								{socialIcons.map(
									({ icon, url }, idx) =>
										url && (
											<IconButton
												key={idx}
												href={url}
												target="_blank"
												rel="noopener noreferrer"
											>
												{icon}
											</IconButton>
										)
								)}
								<Button
									variant="outlined"
									size="small"
									onClick={() => handleViewProfile()} // 👈 Your function
								>
									View Profile
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				{/* Stats */}
				<Grid
					item
					xs={12}
					md={8}
				>
					<Grid
						container
						spacing={2}
					>
						{statCards.map((stat) => (
							<Grid
								item
								xs={12}
								sm={4}
								key={stat.label}
							>
								<Card
									variant="outlined"
									sx={{ textAlign: "center", cursor: "pointer" }}
									onClick={() => {
										setSelectedUsers(stat.users);
										setSelectedTitle(stat.label);
										setOpenUserList(true);
									}}
								>
									<CardContent>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{stat.label}
										</Typography>
										<Typography
											variant="h5"
											fontWeight="bold"
										>
											{stat.value}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Grid>
				{/* Member Roles - Leadership Section */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card
						variant="outlined"
						sx={{ height: "100%" }}
					>
						<CardContent>
							{/* Header with title and Add button */}
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								mb={2}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Leadership
								</Typography>
								<Button
									variant="contained"
									size="small"
									onClick={handleOpenAddMember}
								>
									Add Member
								</Button>
							</Box>

							{/* Leader roles display */}
							{["President", "Vice President", "Secretary"].map((role) => {
								const user = getMembersByRole(role);
								return user ? (
									<Box
										key={role}
										display="flex"
										alignItems="center"
										justifyContent="space-between"
										px={1}
										py={1}
										borderRadius={2}
										sx={{
											backgroundColor: "#f9f9f9",
											mb: 1,
											boxShadow: 1,
										}}
									>
										<Box
											display="flex"
											alignItems="center"
											gap={2}
										>
											<Avatar
												src={user.userId?.profilePic || ""}
												alt={user.userId?.name || "Member"}
												sx={{ width: 45, height: 45 }}
											/>
											<Box>
												<Typography
													variant="subtitle1"
													fontWeight="medium"
												>
													{user.userId?.fullName || "Unnamed Member"}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													{role}
												</Typography>
											</Box>
										</Box>
									</Box>
								) : null;
							})}
						</CardContent>
					</Card>
				</Grid>

				{/* Upcoming Events */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card
						variant="outlined"
						sx={{ height: "100%" }}
					>
						<CardContent>
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Typography
									variant="h6"
									fontWeight="600"
								>
									Upcoming Events
								</Typography>
								<Button
									size="small"
									variant="text"
									endIcon={<ArrowForwardIos fontSize="small" />}
									sx={{ textTransform: "none" }}
								>
									View All
								</Button>
							</Box>

							<Divider sx={{ my: 1 }} />

							{events?.slice(0, 2).map((event, i) => (
								<Box
									key={i}
									display="flex"
									alignItems="flex-start"
									gap={1}
									p={1}
									borderRadius={2}
									sx={{
										transition: "0.3s",
										"&:hover": { backgroundColor: "action.hover" },
									}}
								>
									<CalendarToday
										fontSize="small"
										color="primary"
									/>
									<Box>
										<Typography
											variant="subtitle2"
											fontWeight="500"
											noWrap
										>
											{event.title}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											{new Date(event.date).toLocaleDateString()}
										</Typography>
									</Box>
								</Box>
							))}
						</CardContent>
					</Card>
				</Grid>

				{/* Latest Posts */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card
						variant="outlined"
						sx={{ height: "100%" }}
					>
						<CardContent>
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								mb={1}
							>
								<Typography
									variant="h6"
									fontWeight="600"
								>
									Latest Posts
								</Typography>
								<Button
									size="small"
									variant="text"
									sx={{ textTransform: "none" }}
									endIcon={<ArrowForwardIos fontSize="small" />}
								>
									View All
								</Button>
							</Box>

							<Divider sx={{ mb: 1 }} />

							{posts?.slice(0, 2).map((post, i) => (
								<Box
									key={i}
									p={1}
									display="flex"
									alignItems="flex-start"
									gap={1.5}
									borderRadius={2}
									sx={{
										transition: "0.3s",
										"&:hover": {
											backgroundColor: "action.hover",
											cursor: "pointer",
										},
									}}
								>
									<Article
										fontSize="small"
										color="primary"
									/>
									<Box>
										<Typography
											variant="subtitle2"
											fontWeight={500}
											noWrap
										>
											{post.title}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											{new Date(post.createdAt).toLocaleDateString()}
										</Typography>
									</Box>
								</Box>
							))}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Dialog
				open={openAddMember}
				onClose={handleCloseAddMember}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle
					sx={{
						m: 0,
						p: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<span>
						Add Club Member to <strong>{club.clubName}</strong>
					</span>
					<IconButton
						aria-label="close"
						onClick={handleCloseAddMember}
						sx={{
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent dividers>
					<AddClubMember
						clubId={club._id}
						clubName={club.clubName}
						onClose={handleCloseAddMember}
					/>
				</DialogContent>
			</Dialog>

			{/* List */}
			<Dialog
				open={openUserList}
				onClose={() => setOpenUserList(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>
					{selectedTitle} Members
					<IconButton
						aria-label="close"
						onClick={() => setOpenUserList(false)}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent dividers>
					{selectedUsers.length > 0 ? (
						selectedUsers.map((user) => (
							<Box
								key={user._id}
								display="flex"
								alignItems="center"
								gap={2}
								mb={2}
							>
								<Avatar src={user.userId.profilePicture} />
								<Box
									px={1.5}
									py={1}
								>
									<Typography
										variant="subtitle1"
										fontWeight="600"
										gutterBottom
									>
										{user.name}
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
									>
										Full Name:{" "}
										<Typography
											component="span"
											fontWeight="500"
											color="text.primary"
										>
											{user.userId.fullName}
										</Typography>
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
									>
										Role:{" "}
										<Typography
											component="span"
											fontWeight="500"
											color="text.primary"
										>
											{user.role}
										</Typography>
									</Typography>
								</Box>
							</Box>
						))
					) : (
						<Typography>No users found.</Typography>
					)}
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default Dashboard2;
