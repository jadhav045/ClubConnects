import React from "react";

import UpdateProfile from "../profile/updateProfile";

const user = {
	fullName: "Durgesh Anna bai",
	prn: "23",
	email: "durgesh@viit.ac.in",
	phoneNumber: "+91 9876543210",
	gender: "Male",
	dateOfBirth: "2001-07-20",
	profilePicture: "https://example.com/profile.jpg",
	branch: "Computer Science",
	enrollYear: "2021",
	graduationYear: "2025",
	socialLinks: {
		linkedIn: "https://linkedin.com/in/durgesh",
		twitter: "https://twitter.com/durgesh",
		github: "https://github.com/durgesh",
		personalWebsite: "https://durgesh.com",
	},
	address: {
		street: "123 Main St",
		city: "Pune",
		state: "Maharashtra",
		zipCode: "411001",
		country: "India",
	},
	posts: ["67e8dc4555e1b51647339f33"],
	role: "Student",
	awards: [
		{
			title: "Best Coder",
			description: "Won 1st place in the coding competition",
			date: "2023-10-10",
			image: "https://example.com/award.jpg",
		},
	],
	profileId: "67ea2b9a2d6b6ccfa8a6d8f3",
	following: ["67de92be70535572da315bfd"],
};

const Resources = () => {
	return (
		<div>
			{/* <Profile user={user} /> */}
			<UpdateProfile user={user} />
		</div>
	);
};

export default Resources;
