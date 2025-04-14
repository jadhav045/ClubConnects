import React from "react";
import { TextField, Button, Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import { PlusCircle, Trash, Upload, FileText, Link } from "lucide-react";

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

export const ResourceUploader = ({ resources, setFormData }) => {
	const handleAddResource = () => {
		setFormData((prev) => ({
			...prev,
			resources: [
				...prev.resources,
				{ fileType: "", fileUrl: "", description: "" },
			],
		}));
	};

	const handleChange = (index, field, value) => {
		setFormData((prev) => {
			const updatedResources = [...prev.resources];
			updatedResources[index][field] = value;
			return { ...prev, resources: updatedResources };
		});
	};

	const handleRemove = (index) => {
		setFormData((prev) => ({
			...prev,
			resources: prev.resources.filter((_, i) => i !== index),
		}));
	};

	return (
		<div className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
			<h2 className="text-lg font-semibold text-gray-700">Upload Resources</h2>
			{resources.map((resource, index) => (
				<div
					key={index}
					className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm"
				>
					<select
						className="p-2 border rounded-lg"
						value={resource.fileType}
						onChange={(e) => handleChange(index, "fileType", e.target.value)}
					>
						<option value="">Select Type</option>
						<option value="IMAGE">Image</option>
						<option value="VIDEO">Video</option>
						<option value="DOCUMENT">Document</option>
						<option value="URL">URL</option>
					</select>

					<input
						type={resource.fileType === "URL" ? "text" : "file"}
						className="p-2 border rounded-lg flex-1"
						placeholder={
							resource.fileType === "URL" ? "Enter URL" : "Upload File"
						}
						onChange={(e) =>
							handleChange(
								index,
								"fileUrl",
								resource.fileType === "URL" ? e.target.value : e.target.files[0]
							)
						}
					/>

					<input
						type="text"
						className="p-2 border rounded-lg flex-1"
						placeholder="Description (Optional)"
						value={resource.description}
						onChange={(e) => handleChange(index, "description", e.target.value)}
					/>

					<button
						onClick={() => handleRemove(index)}
						className="text-red-500 hover:text-red-700"
					>
						<Trash size={20} />
					</button>
				</div>
			))}

			<Button
				onClick={handleAddResource}
				className="flex items-center gap-2 w-full justify-center"
			>
				<PlusCircle /> Add Resource
			</Button>
		</div>
	);
};

export default ScheduleResourceForm;
