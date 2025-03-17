import { createSlice } from "@reduxjs/toolkit";

const clubSlice = createSlice({
	name: "club",
	initialState: {
		clubs: [],
		selectedClub: null,
	},
	reducers: {
		setClubs: (state, action) => {
			state.clubs = action.payload;
			console.log("Redux state updated:", state.user);
		},

		setSelectedClub: (state, action) => {
			state.selectedClub = action.payload;
		},
		logoutUser: (state) => {
			state.clubs = [];
			state.selectedClub = null;
		},
	},
});

export const { setClubs, setSelectedClub } = clubSlice.actions;
export default clubSlice.reducer;
