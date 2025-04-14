import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Tabs,
	Tab,
	TextField,
} from "@mui/material";
import { Description, Schedule } from "@mui/icons-material";
import FormCreator from "../../form/FormCreator";
import DynamicRegistrationForm from "../../form/DynamicRegistrationForm";
// import FormCreator from "./FormCreator/";
// import DynamicRegistrationForm from "./DynamicRegistrationForm";

const EventDialogs = ({
	isDialogVisible,
	handleDialogClose,
	message,
	setMessage,
	handleSendReminder,

	open,
	handleClose,
	tab,
	setTab,
	event,

	isFormRegisterOpen,
	setIsFormRegisterOpen,
	formType,

	isRegisterDialogOpen,
	setRegisterDialogOpen,
	userId,
	handleRegister,
}) => {
	return (
		<>
			{/* Send Reminder Dialog */}
			<Dialog
				open={isDialogVisible}
				onClose={handleDialogClose}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle className="bg-indigo-50 text-indigo-800">
					Send Reminder
				</DialogTitle>
				<DialogContent className="py-4">
					<TextField
						autoFocus
						margin="dense"
						label="Reminder Message"
						fullWidth
						multiline
						rows={4}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions className="px-4 pb-3">
					<Button
						onClick={handleDialogClose}
						className="text-gray-600"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSendReminder}
						variant="contained"
						className="bg-indigo-600 hover:bg-indigo-700"
					>
						Send
					</Button>
				</DialogActions>
			</Dialog>

			{/* Event Details Dialog */}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle className="bg-indigo-600 text-white">
					Event Details
				</DialogTitle>
				<DialogContent className="p-0">
					<Tabs
						value={tab}
						onChange={(_, val) => setTab(val)}
						className="border-b border-gray-200"
						indicatorColor="primary"
						textColor="primary"
					>
						<Tab
							label="Overview"
							icon={<Description fontSize="small" />}
							iconPosition="start"
							className="py-4"
						/>
						<Tab
							label="Schedule"
							icon={<Schedule fontSize="small" />}
							iconPosition="start"
							className="py-4"
						/>
					</Tabs>
					<div className="p-6">
						{tab === 0 && (
							<div className="text-gray-700 leading-relaxed">
								{event.detailedDescription}
							</div>
						)}
						{tab === 1 && (
							<div className="mt-2">
								<h3 className="text-lg font-semibold mb-3">Event Timeline</h3>
								{event.schedule?.length > 0 ? (
									<div className="space-y-3">
										{event.schedule.map((item, i) => (
											<div
												key={i}
												className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
											>
												<div className="w-24 font-medium text-indigo-600">
													{item.time}
												</div>
												<div className="flex-1 text-gray-700">
													{item.activity}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-500 italic">
										No schedule information available.
									</p>
								)}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Create Form Dialog */}
			<Dialog
				open={isFormRegisterOpen}
				onClose={() => setIsFormRegisterOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogContent>
					<FormCreator
						entityId={event._id}
						entityType="Event"
						formType={formType}
						onClose={() => setIsFormRegisterOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Registration Dialog */}
			<Dialog
				open={isRegisterDialogOpen}
				onClose={() => setRegisterDialogOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle className="bg-indigo-50 text-indigo-800">
					Register for Event
				</DialogTitle>
				<DialogContent>
					<DynamicRegistrationForm
						entityType="Event"
						entityId={event._id}
						userId={userId}
						onClose={() => setRegisterDialogOpen(false)}
						onRegister={handleRegister}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EventDialogs;
