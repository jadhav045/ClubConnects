import { useState } from "react";
import AddCollege from "../../form/AddCollege";
import AddFaculty from "../../form/AddFaculty";

import FacultyList from "../../form/FacultyList";
import CollegeList from "../../form/CollegeList";
// import AddFacultyForm from "../../form/AddFacultyForm";
const InstitutionManagement = () => {
	const [openForm, setOpenForm] = useState(null);

	const handleOpen = (form) => setOpenForm(form);
	const handleClose = () => setOpenForm(null);

	return (
		<div>
			<button
				onClick={() => handleOpen("college")}
				className="bg-green-500 text-white p-2 rounded"
			>
				Add College
			</button>

			{openForm === "college" && <AddCollege onClose={handleClose} />}

			<button
				onClick={() => handleOpen("faculty")}
				className="bg-green-500 text-white p-2 rounded ml-4"
			>
				Add Faculty
			</button>

			{openForm === "faculty" && <AddFaculty onClose={handleClose} />}
			<FacultyList />
			<CollegeList />
		</div>
	);
};

export default InstitutionManagement;
