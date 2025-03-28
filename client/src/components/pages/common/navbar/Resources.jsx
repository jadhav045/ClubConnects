import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAllDiscuss } from "../../../../store/slice/discussSlice";

const Resources = () => {
	return (
		<div>
			Resources Section 📄
			<h2>
				Think of the Resources section like Google Drive for your club where
				members can:
			</h2>
			<h2>
				Upload Study Materials or Guides: Example: Upload a PDF on "Python
				Basics" for the Coding Club.
			</h2>
			<h2>
				Share Project Files or Event Documents: Example: Event posters,
				presentation templates, or club guidelines.{" "}
			</h2>
			<h2>
				Download Materials: Members can download the files uploaded by others.
			</h2>
			<h2>
				Categorize Files: Example: Study Materials Event Guidelines Club Rules
			</h2>
		</div>
	);
};

export default Resources;
