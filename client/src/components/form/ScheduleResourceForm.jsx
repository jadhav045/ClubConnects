import React from "react";
import { TextField, Button, Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ScheduleResourceForm = ({ label, data, setData, fields }) => {
	const addItem = () => {
		const newItem = fields.reduce((acc, field) => {
			if (field === "speaker") {
				acc[field] = { name: "", title: "", photo: "" };
			} else {
				acc[field] = "";
			}
			return acc;
		}, {});
		setData([...data, newItem]);
	};

	const handleChange = (index, field, value) => {
		const updated = [...data];
		if (field.includes("speaker.")) {
			const subField = field.split(".")[1];
			updated[index].speaker[subField] = value;
		} else {
			updated[index][field] = value;
		}
		setData(updated);
	};

	return (
		<div>
			<h3>{label}</h3>
			{data.map((item, index) => (
				<Grid
					container
					spacing={2}
					key={index}
				>
					{fields.map((field) =>
						field === "speaker" ? (
							<>
								<Grid
									item
									xs={4}
									key={`${index}-name`}
								>
									<TextField
										label="Speaker Name"
										fullWidth
										value={item.speaker.name}
										onChange={(e) =>
											handleChange(index, "speaker.name", e.target.value)
										}
									/>
								</Grid>
								<Grid
									item
									xs={4}
									key={`${index}-title`}
								>
									<TextField
										label="Speaker Title"
										fullWidth
										value={item.speaker.title}
										onChange={(e) =>
											handleChange(index, "speaker.title", e.target.value)
										}
									/>
								</Grid>
							</>
						) : (
							<Grid
								item
								xs={4}
								key={`${index}-${field}`}
							>
								<TextField
									label={field
										.replace(/([A-Z])/g, " $1")
										.replace(/^./, (str) => str.toUpperCase())}
									fullWidth
									value={item[field]}
									onChange={(e) => handleChange(index, field, e.target.value)}
								/>
							</Grid>
						)
					)}
				</Grid>
			))}
			<Button
				onClick={addItem}
				startIcon={<AddCircleIcon />}
			>
				Add {label} Item
			</Button>
		</div>
	);
};

export default ScheduleResourceForm;

// Let me know if you’d like any adjustments! 🚀
