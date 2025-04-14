import { createSlice } from "@reduxjs/toolkit";

const discussSlice = createSlice({
	name: "discuss",
	initialState: {
		discusss: [],
		isLoading: false,
		error: null,
	},
	reducers: {
		setDiscusss: (state, action) => {
			state.discusss = action.payload
				? [...action.payload].sort((a, b) => a.date - b.date)
				: [];
		},

		addDiscussion: (state, action) => {
			state.discusss.push(action.payload);
		},
		updateDiscussion: (state, action) => {
			const index = state.discusss.findIndex(
				(d) => d._id === action.payload._id
			);
			if (index !== -1) {
				state.discusss[index] = action.payload;
			}
		},
		deleteDiscussion: (state, action) => {
			state.discusss = state.discusss.filter((d) => d._id !== action.payload);
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		removeAllDiscuss: (state, action) => {
			state.discusss = [];
		},
	},
});

export const {
	setDiscusss,
	addDiscussion,
	updateDiscussion,
	deleteDiscussion,
	setLoading,
	setError,
	removeAllDiscuss,
} = discussSlice.actions;

export default discussSlice.reducer;
