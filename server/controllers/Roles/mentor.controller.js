import { StudentAlumni } from "../../models/Roles/StudentAlumni.Model.js";
import { User } from "../../models/User.Model.js";

// 1. Update Alumni Availability
export const updateMentorshipAvailability = async (req, res) => {
	const userId = req.user.id; // from auth middleware
	const { status } = req.body;

	// const userId = user.id;
	console.log("Update Mentorshp", req.body);
	console.log("id", userId);

	try {
		const user = await User.findById(userId);
		const alumni = await StudentAlumni.findById(user.profileId);

		if (!alumni) {
			return res.status(404).json({ message: "Alumni profile not found" });
		}

		alumni.availableForMentorship = status;
		await alumni.save();

		res.status(200).json({ message: `Availability set to ${status}` });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// 2. Student Sends Mentorship Request
export const sendMentorshipRequest = async (req, res) => {
	const userId = req.user.id;
	const { alumniId } = req.body;

	try {
		const user = await User.findById(userId);
		const student = await StudentAlumni.findById(user.profileId);

		const alumniUser = await User.findById(alumniId);
		const alumni = await StudentAlumni.findById(alumniUser.profileId);

		if (!student || student.role !== "student") {
			return res.status(404).json({ message: "Student profile not found" });
		}

		if (!alumni || alumni.role !== "alumni") {
			return res.status(404).json({ message: "Alumni profile not found" });
		}

		if (!alumni.availableForMentorship) {
			return res
				.status(400)
				.json({ message: "Alumni not available for mentorship" });
		}

		if (student.mentorshipRequests.includes(alumni._id)) {
			return res
				.status(400)
				.json({ message: "Request already sent to this alumni" });
		}

		student.mentorshipRequests.push(alumni._id);
		alumni.receivedMentorshipRequests.push(student._id);

		await student.save();
		await alumni.save();

		res.status(200).json({ message: "Mentorship request sent" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// 3. Alumni Accepts or Rejects Request
export const handleMentorshipRequest = async (req, res) => {
	const { id: userId } = req.user;
	const { studentId, action } = req.body; // "accept" or "reject"

	try {
		const alumniUser = await User.findById(userId);
		const alumni = await StudentAlumni.findById(alumniUser.profileId);

		const studentUser = await User.findById(studentId);
		const student = await StudentAlumni.findById(studentUser.profileId);

		if (!alumni || alumni.role !== "alumni") {
			return res.status(404).json({ message: "Alumni profile not found" });
		}

		if (!student || student.role !== "student") {
			return res.status(404).json({ message: "Student profile not found" });
		}

		const studentObjectId = student._id.toString();
		const alumniObjectId = alumni._id.toString();

		const requestExists = alumni.receivedMentorshipRequests
			.map((id) => id.toString())
			.includes(studentObjectId);

		if (!requestExists) {
			return res
				.status(400)
				.json({ message: "No such mentorship request found" });
		}

		if (action === "accept") {
			student.mentor = alumni._id;
			alumni.mentees.push(student._id);
		}

		// Remove the mentorship request from both
		alumni.receivedMentorshipRequests =
			alumni.receivedMentorshipRequests.filter(
				(id) => id.toString() !== studentObjectId
			);
		student.mentorshipRequests = student.mentorshipRequests.filter(
			(id) => id.toString() !== alumniObjectId
		);

		await alumni.save();
		await student.save();

		res.status(200).json({
			message:
				action === "accept"
					? "Mentorship request accepted"
					: "Mentorship request rejected",
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
