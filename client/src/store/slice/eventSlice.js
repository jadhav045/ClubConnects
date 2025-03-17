import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
	name: "event",
	initialState: {
		events: [], // Ensure initial state is an array
	},
	reducers: {
		setEvents: (state, action) => {
			// console.log("Updating Redux store with events:", action.payload); // Debugging log
			state.events = action.payload; // Ensure correct mutation
		},
	},
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;
