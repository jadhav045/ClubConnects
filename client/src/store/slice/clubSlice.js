import { createSlice } from "@reduxjs/toolkit";

const clubSlice = createSlice({
	name: "cl",
	initialState: {
		clubs: [], // Initial state as empty array
	},
	reducers: {
		setClubs: (state, action) => {
			console.log("Updating Redux store with clubs:", action.payload);
			state.clubs = action.payload;
		},
		removeAllClubs: (state) => {
			state.clubs = [];
		},
	},
});

export const { setClubs, removeAllClubs } = clubSlice.actions;
export default clubSlice.reducer;
