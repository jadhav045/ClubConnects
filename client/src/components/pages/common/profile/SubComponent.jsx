// import { CardComponent } from "../../../common/CardComponent";
import { TypographyComponent } from "../../../common/TypographyComponent";

import { Card, CardContent, CardHeader, Button } from "@mui/material";
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import { CardComponent } from "../../../common/CardComponent";
import { Grid } from "swiper/modules";
import { useNavigate } from "react-router-dom";
export const Awards = ({ awards }) => {
	if (!awards || awards.length === 0) {
		return (
			<CardComponent title="Awards">
				<TypographyComponent>No awards available.</TypographyComponent>
			</CardComponent>
		);
	}

	return (
		<CardComponent title="Awards">
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
					gap: "16px",
				}}
			>
				{awards.map((award, index) => (
					<div
						key={index}
						style={{
							border: "1px solid #e0e0e0",
							borderRadius: "12px",
							padding: "16px",
							backgroundColor: "#fafafa",
							boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
							transition: "transform 0.2s ease-in-out",
							cursor: "default",
						}}
					>
						<TypographyComponent
							variant="h6"
							style={{ marginBottom: "8px" }}
						>
							{award.title}
						</TypographyComponent>
						<TypographyComponent style={{ marginBottom: "8px" }}>
							{award.description}
						</TypographyComponent>
						<TypographyComponent
							style={{
								fontSize: "14px",
								color: "#757575",
								marginBottom: "12px",
							}}
						>
							{new Date(award.date).toLocaleDateString()}
						</TypographyComponent>

						{award.image && (
							<img
								src={award.image}
								alt={award.title}
								style={{
									width: "100%",
									maxHeight: "150px",
									objectFit: "cover",
									borderRadius: "8px",
								}}
							/>
						)}
					</div>
				))}
			</div>
		</CardComponent>
	);
};

const ICONS = {
	linkedIn: { icon: <FaLinkedin />, color: "primary", label: "LinkedIn" },
	twitter: { icon: <FaTwitter />, color: "info", label: "Twitter" },
	github: { icon: <FaGithub />, color: "secondary", label: "GitHub" },
	personalWebsite: { icon: <FaGlobe />, color: "success", label: "Website" },
};
export const SocialLinks = ({ socialLinks }) => {
	if (!socialLinks) return null;

	return (
		<Card>
			<CardHeader title="Social Links" />
			<CardContent
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "12px",
					justifyContent: "flex-start",
				}}
			>
				{Object.entries(socialLinks).map(([key, url]) => {
					if (!url) return null;

					const iconData = ICONS[key] || {
						icon: <FaGlobe />,
						label: key.charAt(0).toUpperCase() + key.slice(1),
						color: "primary",
					};

					return (
						<Button
							key={key}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							startIcon={iconData.icon}
							variant="contained"
							color={iconData.color}
							style={{ textTransform: "none" }}
						>
							{iconData.label}
						</Button>
					);
				})}
			</CardContent>
		</Card>
	);
};

export const Skills = ({ skills }) => {
	if (!skills || skills.length === 0) {
		return (
			<CardComponent title="Skills">
				<TypographyComponent>No skills added yet.</TypographyComponent>
			</CardComponent>
		);
	}

	return (
		<div className="p-6">
			<TypographyComponent
				variant="h4"
				color="#1f2937"
				fontWeight="bold"
				style={{ marginBottom: "20px" }}
			>
				My Skills
			</TypographyComponent>

			<Grid
				container
				spacing={3}
				justifyContent="center"
			>
				{skills.map((skill, index) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						key={index}
					>
						<Tooltip
							title={skill.name}
							arrow
						>
							<div
								style={{
									background: "linear-gradient(145deg, #0f172a, #1e293b)",
									padding: "30px 20px",
									borderRadius: "16px",
									textAlign: "center",
									boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
									color: "#fff",
									transition: "transform 0.3s ease, box-shadow 0.3s ease",
									cursor: "pointer",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.transform = "scale(1.05)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.transform = "scale(1)")
								}
							>
								<div style={{ fontSize: "3rem", marginBottom: "10px" }}>
									{skill.icon}
								</div>
								<TypographyComponent
									variant="h6"
									style={{ fontWeight: 600 }}
								>
									{skill.name}
								</TypographyComponent>
							</div>
						</Tooltip>
					</Grid>
				))}
			</Grid>
		</div>
	);
};
export const ClubsJoined = ({ clubsJoined }) => {
	return (
		<div className="mt-6 px-4">
			<h3 className="text-2xl font-bold text-gray-800 mb-4">Clubs Joined</h3>

			{clubsJoined?.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{clubsJoined.map((club, index) => (
						<div
							key={index}
							className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
						>
							<h4 className="text-lg font-semibold text-indigo-700 mb-1">
								{club?.clubId?.clubName || "Unnamed Club"}
							</h4>
							<p className="text-sm text-gray-700 mb-1">
								<span className="font-medium">Role:</span> {club?.role || "N/A"}
							</p>
							<p className="text-sm text-gray-700">
								<span className="font-medium">Joined on:</span>{" "}
								{club?.joinedDate
									? new Date(club?.joinedDate).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-500 mt-2 text-sm italic">
					No clubs joined yet.
				</p>
			)}
		</div>
	);
};

// Faculty Components

export const FacultyExtra = ({
	qualifications = [],
	researchAreas = [],
	teachingSubjects = [],
}) => {
	return (
		<div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto border border-gray-200">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
				Faculty Profile Highlights
			</h2>

			{/* Qualifications */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-indigo-700 mb-2">
					Qualifications
				</h3>
				{qualifications.length > 0 ? (
					<ul className="list-disc list-inside text-gray-700 space-y-1">
						{qualifications.map((q, index) => (
							<li key={index}>{q}</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 italic">No qualifications listed.</p>
				)}
			</div>

			{/* Research Areas */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-indigo-700 mb-2">
					Research Areas
				</h3>
				{researchAreas.length > 0 ? (
					<ul className="list-disc list-inside text-gray-700 space-y-1">
						{researchAreas.map((area, index) => (
							<li key={index}>{area}</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 italic">No research areas listed.</p>
				)}
			</div>

			{/* Teaching Subjects */}
			<div>
				<h3 className="text-lg font-semibold text-indigo-700 mb-2">
					Teaching Subjects
				</h3>
				{teachingSubjects.length > 0 ? (
					<ul className="list-disc list-inside text-gray-700 space-y-1">
						{teachingSubjects.map((subject, index) => (
							<li key={index}>{subject}</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 italic">No subjects listed.</p>
				)}
			</div>
		</div>
	);
};

// import { useNavigate } from "react-router-dom";

export const CreatedClub = ({ clubs = [], role = "" }) => {
	const navigate = useNavigate();
	const normalizedRole = role.toLowerCase();

	if (clubs.length === 0) {
		return (
			<div className="text-center text-gray-500 mt-8">
				<p>No clubs created yet.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{clubs.map((club) => (
				<div
					key={club._id}
					className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-6 border border-gray-200"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						{club.clubName || "Unnamed Club"}
					</h2>

					<p className="text-gray-600 mb-2">
						<strong>Short Name:</strong> {club.shortName || "N/A"}
					</p>

					<p className="text-gray-600 mb-2">
						<strong>Motto:</strong> {club.motto || "N/A"}
					</p>

					<p className="text-gray-600 mb-4">
						<strong>Description:</strong> {club.description || "N/A"}
					</p>

					<button
						onClick={() => navigate(`/${normalizedRole}/clubs/${club._id}`)}
						className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-all duration-200"
					>
						View Club
					</button>
				</div>
			))}
		</div>
	);
};

export const FacultyPublications = ({ publications = [] }) => {
	return (
		<div className="mt-6 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">Publications</h2>

			{publications.length > 0 ? (
				<ul className="space-y-4 text-gray-700">
					{publications.map((pub, index) => (
						<article
							key={index}
							className="leading-relaxed"
						>
							<li>
								<strong className="text-gray-900">{pub.title}</strong> —{" "}
								<span className="italic">{pub.journal}</span> (
								{pub.date ? new Date(pub.date).toLocaleDateString() : "N/A"})
								{pub.url && (
									<a
										href={pub.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 hover:underline ml-2"
									>
										View
									</a>
								)}
							</li>
						</article>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No publications available.</p>
			)}
		</div>
	);
};
