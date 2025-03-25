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
		removeAllClubs: (state) => {
			state.clubs = [];
			state.selectedClub = null;
		},
	},
});

export const { setClubs, setSelectedClub, removeAllClubs } = clubSlice.actions;
export default clubSlice.reducer;
