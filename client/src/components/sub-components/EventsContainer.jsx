import React, { useState } from "react";
import { useSelector } from "react-redux";

// import EventsPresentation from "./EventsPresentation";
import useAllEvents from "../../hooks/useAllEvents";
import EventsPresentation from "./EventPresentation";

const EventsContainer = () => {
	const { events } = useSelector((store) => store.event);
	useAllEvents();

	const [selectedEventType, setSelectedEventType] = useState("");
	const [selectedRegistrationStatus, setSelectedRegistrationStatus] =
		useState("");

	const filteredEvents = events.filter((event) => {
		const matchesEventType = selectedEventType
			? event.eventType === selectedEventType
			: true;
		const matchesRegistrationStatus = selectedRegistrationStatus
			? event.registrationStatus === selectedRegistrationStatus
			: true;
		return matchesEventType && matchesRegistrationStatus;
	});

	return (
		<EventsPresentation
			filteredEvents={filteredEvents}
			selectedEventType={selectedEventType}
			setSelectedEventType={setSelectedEventType}
			selectedRegistrationStatus={selectedRegistrationStatus}
			setSelectedRegistrationStatus={setSelectedRegistrationStatus}
		/>
	);
};

export default EventsContainer;
