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
			{awards.map((award, index) => (
				<CardComponent
					key={index}
					style={{ marginBottom: "10px" }}
				>
					<TypographyComponent variant="h6">{award.title}</TypographyComponent>
					<TypographyComponent>{award.description}</TypographyComponent>
					<TypographyComponent color="textSecondary">
						{new Date(award.date).toDateString()}
					</TypographyComponent>
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
				</CardComponent>
			))}
		</CardComponent>
	);
};
const ICONS = {
	linkedIn: { icon: <FaLinkedin />, color: "primary", label: "LinkedIn" },
	twitter: { icon: <FaTwitter />, color: "info", label: "Twitter" },
	github: { icon: <FaGithub />, color: "secondary", label: "GitHub" },
	personalWebsite: { icon: <FaGlobe />, color: "success", label: "Website" },
};

export const SocialLinks = () => {
	const socialLinks = {
		linkedIn: "https://linkedin.com/in/durgesh",
		twitter: "https://twitter.com/durgesh",
		github: "https://github.com/durgesh",
		personalWebsite: "https://durgesh.com",
	};
	if (!socialLinks) return null;

	return (
		<Card>
			<CardHeader title="Social Links" />
			<CardContent style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
				{Object.entries(socialLinks).map(([key, url]) =>
					url ? (
						<Button
							key={key}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							startIcon={ICONS[key]?.icon}
							variant="contained"
							color={ICONS[key]?.color}
						>
							{ICONS[key]?.label}
						</Button>
					) : null
				)}
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
				color="#374151"
				fontWeight="bold"
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
						<CardComponent
							title={skill.name}
							style={{
								textAlign: "center",
								padding: "20px",
								borderRadius: "12px",
								boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
								transition: "transform 0.3s ease-in-out",
								cursor: "pointer",
								background: "#1e293b",
								color: "#fff",
							}}
						>
							<div className="flex justify-center">{skill.icon}</div>
						</CardComponent>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export const ClubsJoined = ({ clubsJoined }) => {
	return (
		<>
			<div className="mt-4">
				<h3 className="text-xl font-semibold text-gray-800">Clubs Joined</h3>
				{clubsJoined?.length > 0 ? (
					<ul className="space-y-4">
						{clubsJoined?.map((club, index) => (
							<li
								key={index}
								className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
							>
								<div className="mb-2">
									<strong className="text-gray-700">Club Name:</strong>{" "}
									{club?.clubId?.clubName || "N/A"}
								</div>
								<div className="mb-2">
									<strong className="text-gray-700">Role:</strong>{" "}
									{club?.role || "N/A"}
								</div>
								<div>
									<strong className="text-gray-700">Joined on:</strong>
									{club?.joinedDate
										? new Date(club?.joinedDate).toLocaleDateString()
										: "N/A"}
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 mt-2">No clubs joined yet.</p>
				)}
			</div>
		</>
	);
};

// Faculty Components

export const FacultyExtra = ({
	qualifications,
	researchAreas,
	teachingSubjects,
}) => {
	return (
		<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-200">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				Faculty Details
			</h2>

			<div className="mb-4">
				<h3 className="text-lg font-medium text-gray-700">Qualifications: </h3>
				<ul className="list-disc list-inside text-gray-600">
					{qualifications.length > 0 ? (
						qualifications.map((q, index) => <li key={index}>{q}</li>)
					) : (
						<p className="text-gray-500">No qualifications listed.</p>
					)}
				</ul>
			</div>

			<div className="mb-4">
				<h3 className="text-lg font-medium text-gray-700">Research Areas:</h3>
				<ul className="list-disc list-inside text-gray-600">
					{researchAreas.length > 0 ? (
						researchAreas.map((area, index) => <li key={index}>{area}</li>)
					) : (
						<p className="text-gray-500">No research areas listed.</p>
					)}
				</ul>
			</div>

			<div>
				<h3 className="text-lg font-medium text-gray-700">
					Teaching Subjects:
				</h3>
				<ul className="list-disc list-inside text-gray-600">
					{teachingSubjects.length > 0 ? (
						teachingSubjects.map((subject, index) => (
							<li key={index}>{subject}</li>
						))
					) : (
						<p className="text-gray-500">No subjects listed.</p>
					)}
				</ul>
			</div>
		</div>
	);
};

export const CreatedClub = ({ clubs, role }) => {
	role = role.toLowerCase();
	console.log(clubs);
	const navigate = useNavigate();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{clubs.map((club) => (
				<div
					key={club._id}
					className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
				>
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						{club.clubName}
					</h2>
					<p className="text-gray-600 mb-2">
						<strong>Short Name:</strong> {club.shortName}
					</p>
					<p className="text-gray-600 mb-2">
						<strong>Motto:</strong> {club.motto}
					</p>
					<p className="text-gray-600 mb-4">
						<strong>Description:</strong> {club.description}
					</p>

					<button
						onClick={() => navigate(`/${role}/clubs/${club._id}`)}
						className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
					>
						View Club
					</button>
				</div>
			))}
		</div>
	);
};

export const FacultyPublications = ({ publications }) => {
	return (
		<div className="mt-6 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">Publications</h2>
			{publications.length > 0 ? (
				<ul className="list-disc list-inside text-gray-600">
					{publications.map((pub, index) => (
						<li
							key={index}
							className="mb-2"
						>
							<strong>{pub.title}</strong> - {pub.journal} (
							{new Date(pub.date).toLocaleDateString()})
							{pub.url && (
								<a
									href={pub.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline ml-2"
								>
									View Publication
								</a>
							)}
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No publications available.</p>
			)}
		</div>
	);
};
