import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
	name: "post",
	initialState: {
		// Fixed typo
		posts: [],
		selectedPost: null,
	},
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
		},
		setSelectedPost: (state, action) => {
			state.selectedPost = action.payload;
		},
	},
});

// Export the correct actions
export const { setPosts, setSelectedPost } = postSlice.actions;

// Export the reducer correctly
export default postSlice.reducer;
