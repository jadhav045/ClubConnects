const data = {
	college: {
		_id: "665f1a2d3e4b56789abcdef00",
		name: "Tech University of Innovation",
		collegeCode: "TUI2024",
	},
	clubs: [
		{
			_id: "665f1a2d3e4b56789abcdef01",
			clubName: "Code Masters",
			shortName: "CM",
			description: "Premier coding and software development club",
			collegeId: "665f1a2d3e4b56789abcdef00",
			status: "Active",
			foundingYear: 2018,
			events: [
				"665f1a2d3e4b56789abcdee01",
				"665f1a2d3e4b56789abcdee02",
				"665f1a2d3e4b56789abcdee03",
				"665f1a2d3e4b56789abcdee04",
				"665f1a2d3e4b56789abcdee05",
				"665f1a2d3e4b56789abcdee06",
				"665f1a2d3e4b56789abcdee07",
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdef02",
			clubName: "Robotics Revolution",
			shortName: "RR",
			description: "Advanced robotics and automation club",
			collegeId: "665f1a2d3e4b56789abcdef00",
			status: "Active",
			foundingYear: 2020,
			events: [
				"665f1a2d3e4b56789abcdee08",
				"665f1a2d3e4b56789abcdee09",
				"665f1a2d3e4b56789abcdee0a",
				"665f1a2d3e4b56789abcdee0b",
				"665f1a2d3e4b56789abcdee0c",
				"665f1a2d3e4b56789abcdee0d",
				"665f1a2d3e4b56789abcdee0e",
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdef03",
			clubName: "Digital Artists United",
			shortName: "DAU",
			description: "Club for digital art and creative technologies",
			collegeId: "665f1a2d3e4b56789abcdef00",
			status: "Active",
			foundingYear: 2019,
			events: [
				"665f1a2d3e4b56789abcdee0f",
				"665f1a2d3e4b56789abcdee10",
				"665f1a2d3e4b56789abcdee11",
				"665f1a2d3e4b56789abcdee12",
				"665f1a2d3e4b56789abcdee13",
				"665f1a2d3e4b56789abcdee14",
				"665f1a2d3e4b56789abcdee15",
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdef04",
			clubName: "Quantum Computing Hub",
			shortName: "QCH",
			description: "Exploring quantum computing technologies",
			collegeId: "665f1a2d3e4b56789abcdef00",
			status: "Active",
			foundingYear: 2022,
			events: [
				"665f1a2d3e4b56789abcdee16",
				"665f1a2d3e4b56789abcdee17",
				"665f1a2d3e4b56789abcdee18",
				"665f1a2d3e4b56789abcdee19",
				"665f1a2d3e4b56789abcdee1a",
				"665f1a2d3e4b56789abcdee1b",
				"665f1a2d3e4b56789abcdee1c",
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdef05",
			clubName: "AI Innovators",
			shortName: "AII",
			description: "Artificial Intelligence research club",
			collegeId: "665f1a2d3e4b56789abcdef00",
			status: "Active",
			foundingYear: 2021,
			events: [
				"665f1a2d3e4b56789abcdee1d",
				"665f1a2d3e4b56789abcdee1e",
				"665f1a2d3e4b56789abcdee1f",
				"665f1a2d3e4b56789abcdee20",
				"665f1a2d3e4b56789abcdee21",
				"665f1a2d3e4b56789abcdee22",
				"665f1a2d3e4b56789abcdee23",
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdef06",
			clubName: "Cyber Security Squad",
			shortName: "CSS",
			description: "Cyber security and ethical hacking club",
			collegeId: "665f1a2d3e4b56789abcdef00",
			status: "Active",
			foundingYear: 2020,
			events: [
				"665f1a2d3e4b56789abcdee24",
				"665f1a2d3e4b56789abcdee25",
				"665f1a2d3e4b56789abcdee26",
				"665f1a2d3e4b56789abcdee27",
				"665f1a2d3e4b56789abcdee28",
				"665f1a2d3e4b56789abcdee29",
				"665f1a2d3e4b56789abcdee2a",
				"665f1a2d3e4b56789abcdee31",
			],
		},
	],
	events: [
		// Code Masters Events (7)
		{
			_id: "665f1a2d3e4b56789abcdee01",
			title: "Annual Hackathon",
			eventType: "TECH",
			description: "24-hour coding marathon with industry judges",
			eventDateTime: "2024-03-15T09:00:00Z",
			location: "Main Campus Lab 5",
			organizer: "665f1a2d3e4b56789abcdef01",
			registrationDeadline: "2024-03-10T23:59:59Z",
			maxParticipants: 100,
			tags: ["coding", "competition"],
			resources: [
				{
					fileType: "DOCUMENT",
					fileUrl: "/hackathon-rules.pdf",
					description: "Competition guidelines",
				},
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdee02",
			title: "Web Development Workshop",
			eventType: "TECH",
			description: "Full-stack development with MERN stack",
			eventDateTime: "2024-04-02T14:00:00Z",
			location: "Tech Building Room 301",
			organizer: "665f1a2d3e4b56789abcdef01",
			registrationStatus: "OPEN",
			tags: ["web", "workshop"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee03",
			title: "Algorithm Bootcamp",
			eventType: "TECH",
			description: "Advanced algorithm training for competitions",
			eventDateTime: "2024-05-10T10:00:00Z",
			location: "CS Department Lab 3",
			organizer: "665f1a2d3e4b56789abcdef01",
			maxParticipants: 40,
			tags: ["algorithms", "training"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee04",
			title: "Git & GitHub Masterclass",
			eventType: "TECH",
			description: "Version control system deep dive",
			eventDateTime: "2024-06-05T15:00:00Z",
			location: "Open Source Lab",
			organizer: "665f1a2d3e4b56789abcdef01",
			tags: ["git", "collaboration"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee05",
			title: "Mobile App Development Series",
			eventType: "TECH",
			description: "4-week Flutter development course",
			eventDateTime: "2024-07-01T17:00:00Z",
			location: "Mobile Lab",
			organizer: "665f1a2d3e4b56789abcdef01",
			maxParticipants: 30,
			tags: ["mobile", "flutter"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee06",
			title: "Code Review Workshop",
			eventType: "TECH",
			description: "Learn professional code review techniques",
			eventDateTime: "2024-08-15T11:00:00Z",
			location: "CS Department Room 204",
			organizer: "665f1a2d3e4b56789abcdef01",
			tags: ["best-practices", "workshop"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee07",
			title: "Open Source Contribution Day",
			eventType: "TECH",
			description: "Collaborative open source contribution event",
			eventDateTime: "2024-09-20T10:00:00Z",
			location: "OSS Lab",
			organizer: "665f1a2d3e4b56789abcdef01",
			tags: ["open-source", "community"],
		},

		// Robotics Revolution Events (7)
		{
			_id: "665f1a2d3e4b56789abcdee08",
			title: "Drone Racing Competition",
			eventType: "TECH",
			description: "Inter-college drone racing championship",
			eventDateTime: "2024-05-20T10:00:00Z",
			location: "Sports Complex",
			organizer: "665f1a2d3e4b56789abcdef02",
			maxParticipants: 50,
			tags: ["robotics", "competition"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee09",
			title: "Arduino Workshop",
			eventType: "TECH",
			description: "Introduction to microcontroller programming",
			eventDateTime: "2024-04-10T14:00:00Z",
			location: "Robotics Lab 1",
			organizer: "665f1a2d3e4b56789abcdef02",
			tags: ["arduino", "workshop"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee0a",
			title: "Robotic Arm Building Challenge",
			eventType: "TECH",
			description: "Build functional robotic arms in teams",
			eventDateTime: "2024-06-15T09:00:00Z",
			location: "Engineering Workshop",
			organizer: "665f1a2d3e4b56789abcdef02",
			maxParticipants: 20,
			tags: ["hardware", "competition"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee0b",
			title: "Autonomous Vehicle Demo",
			eventType: "TECH",
			description: "Showcase of self-driving car prototype",
			eventDateTime: "2024-07-22T15:00:00Z",
			location: "Parking Lot A",
			organizer: "665f1a2d3e4b56789abcdef02",
			tags: ["AI", "demonstration"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee0c",
			title: "ROS Workshop",
			eventType: "TECH",
			description: "Robot Operating System training",
			eventDateTime: "2024-08-05T13:00:00Z",
			location: "Robotics Lab 2",
			organizer: "665f1a2d3e4b56789abcdef02",
			tags: ["ros", "training"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee0d",
			title: "Industrial Automation Seminar",
			eventType: "TECH",
			description: "Latest trends in factory automation",
			eventDateTime: "2024-09-10T11:00:00Z",
			location: "Auditorium B",
			organizer: "665f1a2d3e4b56789abcdef02",
			tags: ["industry", "seminar"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee0e",
			title: "Robotics Career Fair",
			eventType: "OTHER",
			description: "Meet industry professionals in robotics",
			eventDateTime: "2024-10-05T10:00:00Z",
			location: "Career Center",
			organizer: "665f1a2d3e4b56789abcdef02",
			tags: ["career", "networking"],
		},

		// Digital Artists United Events (7)
		{
			_id: "665f1a2d3e4b56789abcdee0f",
			title: "Digital Art Exhibition",
			eventType: "CULTURAL",
			description: "Annual student digital art showcase",
			eventDateTime: "2024-06-01T18:00:00Z",
			location: "Art Gallery",
			organizer: "665f1a2d3e4b56789abcdef03",
			tags: ["art", "exhibition"],
			resources: [
				{
					fileType: "IMAGE",
					fileUrl: "/gallery-preview.jpg",
					description: "Exhibition preview",
				},
			],
		},
		{
			_id: "665f1a2d3e4b56789abcdee10",
			title: "3D Modeling Workshop",
			eventType: "TECH",
			description: "Blender 3D modeling fundamentals",
			eventDateTime: "2024-04-20T15:00:00Z",
			location: "Digital Arts Lab",
			organizer: "665f1a2d3e4b56789abcdef03",
			maxParticipants: 25,
			tags: ["3d", "workshop"],
		},
		// ... (Additional events for remaining clubs following similar structure)

		// Quantum Computing Hub Events (7)
		{
			_id: "665f1a2d3e4b56789abcdee16",
			title: "Quantum Algorithms Workshop",
			eventType: "TECH",
			description: "Introduction to Shor's and Grover's algorithms",
			eventDateTime: "2024-04-15T14:00:00Z",
			location: "Quantum Lab 1",
			organizer: "665f1a2d3e4b56789abcdef04",
			maxParticipants: 25,
			tags: ["quantum", "algorithms"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee17",
			title: "Qubit Physics Seminar",
			eventType: "EDUCATION",
			description: "Deep dive into quantum bit fundamentals",
			eventDateTime: "2024-05-22T10:00:00Z",
			location: "Physics Auditorium",
			organizer: "665f1a2d3e4b56789abcdef04",
			tags: ["physics", "seminar"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee18",
			title: "Quantum Programming Hackathon",
			eventType: "TECH",
			description: "24-hour quantum computing challenge",
			eventDateTime: "2024-06-18T09:00:00Z",
			location: "Innovation Hub",
			organizer: "665f1a2d3e4b56789abcdef04",
			maxParticipants: 50,
			tags: ["hackathon", "programming"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee19",
			title: "Quantum Cryptography Demo",
			eventType: "TECH",
			description: "Live demonstration of quantum key distribution",
			eventDateTime: "2024-07-05T15:30:00Z",
			location: "Security Lab",
			organizer: "665f1a2d3e4b56789abcdef04",
			tags: ["crypto", "demo"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee1a",
			title: "Quantum Hardware Workshop",
			eventType: "TECH",
			description: "Hands-on with quantum computing hardware",
			eventDateTime: "2024-08-12T13:00:00Z",
			location: "Quantum Lab 2",
			organizer: "665f1a2d3e4b56789abcdef04",
			maxParticipants: 15,
			tags: ["hardware", "workshop"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee1b",
			title: "Quantum Career Panel",
			eventType: "OTHER",
			description: "Industry experts discuss quantum computing careers",
			eventDateTime: "2024-09-25T16:00:00Z",
			location: "Career Center Hall",
			organizer: "665f1a2d3e4b56789abcdef04",
			tags: ["career", "panel"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee1c",
			title: "Quantum Supremacy Lecture",
			eventType: "EDUCATION",
			description: "Understanding quantum computational advantage",
			eventDateTime: "2024-10-10T11:00:00Z",
			location: "Main Lecture Hall",
			organizer: "665f1a2d3e4b56789abcdef04",
			tags: ["lecture", "theory"],
		},

		// AI Innovators Events (7)
		{
			_id: "665f1a2d3e4b56789abcdee1d",
			title: "Neural Networks Bootcamp",
			eventType: "TECH",
			description: "5-day intensive deep learning workshop",
			eventDateTime: "2024-03-25T09:00:00Z",
			location: "AI Lab 1",
			organizer: "665f1a2d3e4b56789abcdef05",
			maxParticipants: 30,
			tags: ["deep-learning", "workshop"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee1e",
			title: "Computer Vision Challenge",
			eventType: "TECH",
			description: "Image recognition competition",
			eventDateTime: "2024-04-18T10:00:00Z",
			location: "Vision Lab",
			organizer: "665f1a2d3e4b56789abcdef05",
			tags: ["competition", "vision"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee1f",
			title: "Natural Language Processing Seminar",
			eventType: "TECH",
			description: "Latest trends in NLP research",
			eventDateTime: "2024-05-30T14:00:00Z",
			location: "Language Lab",
			organizer: "665f1a2d3e4b56789abcdef05",
			tags: ["nlp", "seminar"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee20",
			title: "AI Ethics Symposium",
			eventType: "EDUCATION",
			description: "Panel discussion on AI ethics",
			eventDateTime: "2024-06-22T16:00:00Z",
			location: "Ethics Auditorium",
			organizer: "665f1a2d3e4b56789abcdef05",
			tags: ["ethics", "discussion"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee21",
			title: "Machine Learning Hackathon",
			eventType: "TECH",
			description: "48-hour ML model building competition",
			eventDateTime: "2024-07-15T09:00:00Z",
			location: "Data Science Lab",
			organizer: "665f1a2d3e4b56789abcdef05",
			maxParticipants: 40,
			tags: ["ml", "hackathon"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee22",
			title: "AI Startup Pitch Night",
			eventType: "OTHER",
			description: "Student AI startup ideas competition",
			eventDateTime: "2024-08-28T18:00:00Z",
			location: "Innovation Theater",
			organizer: "665f1a2d3e4b56789abcdef05",
			tags: ["startup", "pitching"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee23",
			title: "Reinforcement Learning Workshop",
			eventType: "TECH",
			description: "Hands-on RL with OpenAI Gym",
			eventDateTime: "2024-09-12T13:00:00Z",
			location: "RL Lab",
			organizer: "665f1a2d3e4b56789abcdef05",
			maxParticipants: 25,
			tags: ["rl", "workshop"],
		},

		// Cyber Security Squad Events (7)
		{
			_id: "665f1a2d3e4b56789abcdee24",
			title: "Capture The Flag Challenge",
			eventType: "TECH",
			description: "24-hour cybersecurity competition",
			eventDateTime: "2024-05-05T10:00:00Z",
			location: "Cyber Lab 1",
			organizer: "665f1a2d3e4b56789abcdef06",
			maxParticipants: 50,
			tags: ["ctf", "competition"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee25",
			title: "Network Security Workshop",
			eventType: "TECH",
			description: "Hands-on network penetration testing",
			eventDateTime: "2024-06-10T14:00:00Z",
			location: "Networking Lab",
			organizer: "665f1a2d3e4b56789abcdef06",
			tags: ["networking", "security"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee26",
			title: "Dark Web Exploration Seminar",
			eventType: "EDUCATION",
			description: "Understanding dark web technologies",
			eventDateTime: "2024-07-18T11:00:00Z",
			location: "Security Theater",
			organizer: "665f1a2d3e4b56789abcdef06",
			tags: ["dark-web", "education"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee27",
			title: "Bug Bounty Training",
			eventType: "TECH",
			description: "Learn ethical vulnerability disclosure",
			eventDateTime: "2024-08-22T15:00:00Z",
			location: "Hacking Lab",
			organizer: "665f1a2d3e4b56789abcdef06",
			maxParticipants: 30,
			tags: ["bug-bounty", "training"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee28",
			title: "Cyber Law Seminar",
			eventType: "EDUCATION",
			description: "Legal aspects of cybersecurity",
			eventDateTime: "2024-09-05T16:00:00Z",
			location: "Law Auditorium",
			organizer: "665f1a2d3e4b56789abcdef06",
			tags: ["law", "seminar"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee29",
			title: "Red Team vs Blue Team Exercise",
			eventType: "TECH",
			description: "Live cybersecurity simulation",
			eventDateTime: "2024-10-15T09:00:00Z",
			location: "Cyber Range",
			organizer: "665f1a2d3e4b56789abcdef06",
			maxParticipants: 20,
			tags: ["simulation", "exercise"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee31",
			title: "Red Team vs Blue Team Exercise",
			eventType: "TECH",
			description: "Live cybersecurity simulation",
			eventDateTime: "2024-10-15T09:00:00Z",
			location: "Cyber Range",
			organizer: "665f1a2d3e4b56789abcdef06",
			maxParticipants: 20,
			tags: ["simulation", "exercise"],
		},
		{
			_id: "665f1a2d3e4b56789abcdee2a",
			title: "Security Career Fair",
			eventType: "OTHER",
			description: "Meet cybersecurity industry leaders",
			eventDateTime: "2024-11-02T10:00:00Z",
			location: "Career Expo Hall",
			organizer: "665f1a2d3e4b56789abcdef06",
			tags: ["career", "networking"],
		},
	],
};

const analytics = {
	totalClubs: data.clubs.length,
	totalEvents: data.events.length,

	// Count events by type
	eventsByType: data.events.reduce((acc, event) => {
		acc[event.eventType] = (acc[event.eventType] || 0) + 1;
		return acc;
	}, {}),

	// Monthly Event Distribution
	monthlyEventDistribution: data.events.reduce((acc, event) => {
		const month = new Date(event.eventDateTime).toLocaleString("default", {
			month: "short",
		});
		acc[month] = (acc[month] || 0) + 1;
		return acc;
	}, {}),

	// Clubs ranked by number of events
	topClubsByEvents: data.clubs
		.map((club) => ({
			clubName: club.clubName,
			eventCount: club.events.length,
		}))
		.sort((a, b) => b.eventCount - a.eventCount),
};

const getClubAnalytics = (clubIdentifier) => {
	// Find the club by ID or Name
	const club = data.clubs.find(
		(c) =>
			c._id === clubIdentifier ||
			c.clubName.toLowerCase() === clubIdentifier.toLowerCase()
	);

	if (!club) {
		console.log("Club not found!");
		return null;
	}

	// Get all events related to the club
	const clubEvents = data.events.filter((event) =>
		club.events.includes(event._id)
	);

	// Get the current date
	const currentDate = new Date();

	// Calculate analytics
	const analytics = {
		clubName: club.clubName,
		totalEvents: clubEvents.length,

		// Count events by type (TECH, SEMINAR, OTHER, etc.)
		eventsByType: clubEvents.reduce((acc, event) => {
			acc[event.eventType] = (acc[event.eventType] || 0) + 1;
			return acc;
		}, {}),

		// Monthly event distribution
		monthlyEventDistribution: clubEvents.reduce((acc, event) => {
			const month = new Date(event.eventDateTime).toLocaleString("default", {
				month: "short",
			});
			acc[month] = (acc[month] || 0) + 1;
			return acc;
		}, {}),

		// Future vs. Past events
		eventStatus: {
			upcoming: clubEvents.filter(
				(event) => new Date(event.eventDateTime) > currentDate
			).length,
			past: clubEvents.filter(
				(event) => new Date(event.eventDateTime) <= currentDate
			).length,
		},

		// Event Tags Distribution
		eventTags: clubEvents.reduce((acc, event) => {
			event.tags.forEach((tag) => {
				acc[tag] = (acc[tag] || 0) + 1;
			});
			return acc;
		}, {}),

		// Most Active Organizers
		organizers: clubEvents.reduce((acc, event) => {
			acc[event.organizer] = (acc[event.organizer] || 0) + 1;
			return acc;
		}, {}),
	};

	console.log(analytics);
	return analytics;
};
// ✅ Example Usage:
// getClubAnalytics("Capture The Flag Challenge"); // Search by club name
getClubAnalytics("665f1a2d3e4b56789abcdef06"); // Search by club ID

// console.log(analytics);

export const analyzeData = (data) => {
	let clubsAnalysis = data.club.map((club) => {
		const clubEvents = data.events.filter((event) =>
			club.events.includes(event._id)
		);

		// Total events
		const totalEvents = clubEvents.length;

		// Event type distribution
		const eventsByType = {};
		clubEvents.forEach((event) => {
			eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
		});

		// Events per month
		const monthlyEventDistribution = {};
		clubEvents.forEach((event) => {
			const month = new Date(event.eventDateTime).toLocaleString("en-US", {
				month: "short",
			});
			monthlyEventDistribution[month] =
				(monthlyEventDistribution[month] || 0) + 1;
		});

		// Past vs. Upcoming events
		const now = new Date();
		let past = 0,
			upcoming = 0;
		clubEvents.forEach((event) => {
			if (new Date(event.eventDateTime) < now) {
				past++;
			} else {
				upcoming++;
			}
		});

		// Tags frequency
		const eventTags = {};
		clubEvents.forEach((event) => {
			event.tags.forEach((tag) => {
				eventTags[tag] = (eventTags[tag] || 0) + 1;
			});
		});

		return {
			clubName: club.clubName,
			totalEvents,
			eventsByType,
			monthlyEventDistribution,
			eventStatus: { past, upcoming },
			eventTags,
		};
	});

	return clubsAnalysis;
};
// utils/analyzeData.js
export function analyzeClubEventData(data) {
	const { college, clubs, events } = data;

	// Map event ID to event details for fast lookup
	const eventMap = new Map();
	events.forEach((event) => eventMap.set(event._id, event));

	// College level analysis
	const totalClubs = clubs.length;
	const totalEvents = clubs.reduce((acc, club) => acc + club.events.length, 0);

	// Aggregated statistics for charts
	const allEventTypes = {};
	const allTags = {};
	const yearlyEventCount = {}; // New

	// Club level analysis
	const clubAnalysis = clubs.map((club) => {
		const clubEvents = club.events
			.map((id) => eventMap.get(id))
			.filter(Boolean);
		const totalClubEvents = clubEvents.length;
		const totalParticipants = clubEvents.reduce(
			(acc, ev) => acc + ev.maxParticipants,
			0
		);

		const eventTypes = {};
		const tags = {};
		const yearly = {}; // New

		clubEvents.forEach((ev) => {
			eventTypes[ev.eventType] = (eventTypes[ev.eventType] || 0) + 1;
			allEventTypes[ev.eventType] = (allEventTypes[ev.eventType] || 0) + 1;

			ev.tags.forEach((tag) => {
				tags[tag] = (tags[tag] || 0) + 1;
				allTags[tag] = (allTags[tag] || 0) + 1;
			});

			const year = new Date(ev.date).getFullYear();
			yearly[year] = (yearly[year] || 0) + 1;
			yearlyEventCount[year] = (yearlyEventCount[year] || 0) + 1; // Global yearly count
		});

		return {
			clubName: club.clubName,
			shortName: club.shortName,
			totalClubEvents,
			totalParticipants,
			foundingYear: club.foundingYear,
			eventTypes,
			tags,
			yearly,
		};
	});

	return {
		collegeName: college.name,
		totalClubs,
		totalEvents,
		clubAnalysis,
		allEventTypes,
		allTags,
		yearlyEventCount, // Return global yearly count
	};
}

export default data;
