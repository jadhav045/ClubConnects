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
			<CollegeList />
		</div>
	);
};

export default InstitutionManagement;
