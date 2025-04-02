import React, { useState } from "react";
import Actions from "./Actions";
import {
  Awards,
  ClubsJoined,
  CreatedClub,
  FacultyExtra,
  FacultyPublications,
  Skills,
  SocialLinks,
} from "./SubComponent";
import { ResponsiveNavigation } from "./ResponsiveNavigation";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "./UpdateProfile";

const StudentAlumniProfile = ({ user }) => {
  const navigate = useNavigate();
  const {
    profileId,
    role,
    fullName,
    prn,
    email,
    phoneNumber,
    gender,
    address,
    socialLinks,
    awards,
  } = user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div>
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-md object-cover"
          />
          <p>Branch: {profileId?.department || "NA"}</p>
          {role === "Faculty" && (
            <>
              <p>Joined On: {profileId.dateOfJoining || "1999"}</p>
              <p>{profileId.designation || "Professor"}</p>
            </>
          )}
          {(role === "Alumni" || role === "Student") && (
            <p>
              {profileId.enrollmentYear || "2022"} -{" "}
              {profileId.graduationYear || "2026"}
            </p>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
          <p className="text-gray-600">PRN: {prn}</p>
          <p className="text-gray-600">Email: {email}</p>
          <p className="text-gray-600">Phone: {phoneNumber}</p>
          <p className="text-gray-600">Gender: {gender}</p>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <strong>Address:</strong> {address?.street || "Unknown"}, {address?.city || "Unknown"}, {address?.state || "Unknown"}, {address?.zipCode || "000000"}, {address?.country || "Unknown"}
      </div>

      {/* Faculty Specific Sections */}
      {role === "Faculty" && profileId && (
        <>
          <FacultyExtra
            qualifications={profileId.qualifications}
            researchAreas={profileId.researchAreas}
            teachingSubjects={profileId.teachingSubjects}
          />
          <CreatedClub
            clubs={profileId.createdClub}
            role={role}
          />
          <FacultyPublications publications={profileId.publications} />
        </>
      )}

      {/* Student/Alumni Specific Sections */}
      {(role === "Alumni" || role === "Student") && (
        <ClubsJoined clubsJoined={profileId?.clubsJoined} />
      )}

      {/* Social Links */}
      <SocialLinks socialLinks={socialLinks} />

      {/* Awards & Skills Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <Awards awards={awards} />
        </div>
        {(role === "Alumni" || role === "Student") && (
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <Skills skills={profileId?.skills} />
          </div>
        )}
      </div>

      {/* Responsive Navigation */}
      <ResponsiveNavigation user={user} />

      {/* Modal for updating profile */}
      {isModalOpen && (
        <div className="modal-container fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-8 rounded-lg">
            <UpdateProfile user={user} closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAlumniProfile;
