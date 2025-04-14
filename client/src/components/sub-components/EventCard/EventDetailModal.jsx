import { Description, ListAlt, Schedule } from "@mui/icons-material";

// Event Detail Modal Component
const EventDetailModal = ({ event, onClose }) => {
	if (!event) return null;

	const renderResource = (resource, index) => {
		switch (resource.fileType) {
			case "IMAGE":
				return (
					<div
						key={index}
						className="mb-4 bg-gray-50 p-3 rounded-lg"
					>
						<p className="font-medium mb-2 text-gray-800">
							{resource.description}
						</p>
						<img
							src={resource.fileUrl}
							alt={resource.description}
							className="w-full max-h-60 object-contain rounded-md border border-gray-200"
						/>
					</div>
				);
			case "VIDEO":
				return (
					<div
						key={index}
						className="mb-4 bg-gray-50 p-3 rounded-lg"
					>
						<p className="font-medium mb-2 text-gray-800">
							{resource.description}
						</p>
						<video
							controls
							className="w-full rounded-md border border-gray-200"
						>
							<source src={resource.fileUrl} />
							Your browser does not support the video tag.
						</video>
					</div>
				);
			case "DOCUMENT":
			case "URL":
				return (
					<div
						key={index}
						className="mb-4 bg-gray-50 p-3 rounded-lg flex items-center"
					>
						<div className="flex-1">
							<p className="font-medium text-gray-800">
								{resource.description}
							</p>
							<a
								href={resource.fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
							>
								View Resource <span className="ml-1">↗</span>
							</a>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto pt-10 p-4">
			<div className="bg-white rounded-xl w-full max-w-2xl p-0 shadow-lg overflow-hidden">
				{/* Header with gradient background */}
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-bold">{event.title}</h2>
						<button
							onClick={onClose}
							className="text-white bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition focus:outline-none"
							aria-label="Close"
						>
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
					<div className="text-white text-opacity-90 mt-2 text-sm">
						<div className="inline-block bg-black bg-opacity-20 rounded-full px-3 py-1 mr-2 mb-2">
							{event.eventType}
						</div>
						<div className="inline-block bg-black bg-opacity-20 rounded-full px-3 py-1 mr-2 mb-2">
							{event.location}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 max-h-[70vh] overflow-y-auto">
					{/* Description */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2 flex items-center">
							<Description
								fontSize="small"
								className="mr-2 text-indigo-600"
							/>
							About This Event
						</h3>
						<p className="text-gray-700 leading-relaxed">
							{event.detailedDescription || event.description}
						</p>
					</div>

					{/* Schedule */}
					{event.schedule?.length > 0 && (
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3 flex items-center">
								<Schedule
									fontSize="small"
									className="mr-2 text-indigo-600"
								/>
								Event Schedule
							</h3>
							<div className="border rounded-lg overflow-hidden">
								{event.schedule.map((item, idx) => (
									<div
										key={idx}
										className={`flex p-3 ${
											idx % 2 === 0 ? "bg-gray-50" : "bg-white"
										}`}
									>
										<div className="w-32 font-medium text-indigo-600">
											{item.time}
										</div>
										<div className="flex-1">{item.activity}</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Resources */}
					{event.resources?.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-3 flex items-center">
								<ListAlt
									fontSize="small"
									className="mr-2 text-indigo-600"
								/>
								Event Resources
							</h3>
							<div className="grid grid-cols-1 gap-4">
								{event.resources.map((res, idx) => renderResource(res, idx))}
							</div>
						</div>
					)}
				</div>

				{/* Footer with action button */}
				<div className="border-t border-gray-200 p-4 flex justify-end bg-gray-50">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default EventDetailModal;
