// hooks/useEventFilters.js
export const useEventFilters = (events, clubId) => {
	const [filters, setFilters] = useState({
		eventType: "",
		registrationStatus: "",
	});

	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const filteredEvents = events.filter((event) => {
		const isOrganizer = event?.organizer === clubId;
		const matchesType =
			!filters.eventType || event.eventType === filters.eventType;
		const matchesStatus =
			!filters.registrationStatus ||
			event.registrationStatus === filters.registrationStatus;

		return isOrganizer && matchesType && matchesStatus;
	});

	return { filteredEvents, filters, handleFilterChange };
};
