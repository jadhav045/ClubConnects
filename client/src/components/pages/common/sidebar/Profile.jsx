import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	Avatar,
	Button,
	Typography,
	Grid,
} from "@mui/material";
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";

const Profile = ({ user }) => {
	return (
		<Grid
			container
			spacing={3}
			justifyContent="center"
			style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}
		>
			{/* Profile Header */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardContent
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Avatar
							src={user?.profilePicture}
							sx={{ width: 80, height: 80 }}
						/>
						<div>
							<Typography variant="h5">{user?.branch || "N/A"}</Typography>
							<Typography color="textSecondary">
								{user?.enrollYear || "-"} - {user?.graduationYear || "-"}
							</Typography>
						</div>
					</CardContent>
				</Card>
			</Grid>

			{/* Personal Details */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardHeader title="Personal Details" />
					<CardContent>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Name:</strong> {user?.fullName}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>PRN:</strong> {user?.prn}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Email:</strong> {user?.email}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Phone:</strong> {user?.phoneNumber || "N/A"}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Gender:</strong> {user?.gender || "N/A"}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Date of Birth:</strong> {user?.dateOfBirth || "N/A"}
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<Typography>
									<strong>Address:</strong> {user?.address?.street || ""},{" "}
									{user?.address?.city || ""}, {user?.address?.state || ""},{" "}
									{user?.address?.zipCode || ""}, {user?.address?.country || ""}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>

			{/* Clubs and Following */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardHeader title="Community" />
					<CardContent>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Following:</strong> {user?.following?.length || 0}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									<strong>Clubs Joined:</strong>{" "}
									{user?.clubsJoined?.join(", ") || "None"}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>

			{/* Social Links */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardHeader title="Social Links" />
					<CardContent>
						<Grid
							container
							spacing={2}
						>
							{user?.socialLinks?.linkedIn && (
								<Grid item>
									<Button
										href={user.socialLinks.linkedIn}
										startIcon={<FaLinkedin />}
										variant="contained"
										color="primary"
									>
										LinkedIn
									</Button>
								</Grid>
							)}
							{user?.socialLinks?.twitter && (
								<Grid item>
									<Button
										href={user.socialLinks.twitter}
										startIcon={<FaTwitter />}
										variant="contained"
										color="info"
									>
										Twitter
									</Button>
								</Grid>
							)}
							{user?.socialLinks?.github && (
								<Grid item>
									<Button
										href={user.socialLinks.github}
										startIcon={<FaGithub />}
										variant="contained"
										color="secondary"
									>
										GitHub
									</Button>
								</Grid>
							)}
							{user?.socialLinks?.personalWebsite && (
								<Grid item>
									<Button
										href={user.socialLinks.personalWebsite}
										startIcon={<FaGlobe />}
										variant="contained"
										color="success"
									>
										Website
									</Button>
								</Grid>
							)}
						</Grid>
					</CardContent>
				</Card>
			</Grid>

			{/* Awards */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardHeader title="Awards" />
					<CardContent>
						<Grid
							container
							spacing={2}
						>
							{user?.awards?.length > 0 ? (
								user.awards.map((award, index) => (
									<Grid
										item
										xs={12}
										md={6}
										key={index}
									>
										<Card>
											<CardContent>
												<Typography variant="h6">{award.title}</Typography>
												<Typography>{award.description}</Typography>
												<Typography color="textSecondary">
													{new Date(award.date).toDateString()}
												</Typography>
												{award.image && (
													<img
														src={award.image}
														alt={award.title}
														style={{
															width: "100%",
															maxWidth: "150px",
															borderRadius: "8px",
															marginTop: "10px",
														}}
													/>
												)}
											</CardContent>
										</Card>
									</Grid>
								))
							) : (
								<Typography>No awards available.</Typography>
							)}
						</Grid>
					</CardContent>
				</Card>
			</Grid>

			{/* Skills */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardHeader title="Skills" />
					<CardContent>
						<Typography>
							{user?.skills?.join(", ") || "No skills listed"}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default Profile;
