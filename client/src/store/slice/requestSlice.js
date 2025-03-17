import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
	name: "request",
	initialState: {
		selectedRequest: null,
		requests: [],
	},
	reducers: {
		setRequests: (state, action) => {
			state.requests = action.payload;
			// console.log("Redux state updated:", state.requests); // Fixed log
		},

		setSelectedRequests: (state, action) => {
			state.selectedRequest = action.payload;
		},
	},
});
export const { setRequests, setSelectedRequests } = requestSlice.actions;
export default requestSlice.reducer;
