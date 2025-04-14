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
		removePost: (state, action) => {
			state.posts = state.posts.filter((post) => post._id !== action.payload);
		},
		removeAllPosts: (state) => {
			state.posts = [];
			state.selectedPost = null;
		},
	},
});

// Export the correct actions
export const { setPosts, setSelectedPost, removePost, removeAllPosts } =
	postSlice.actions;

// Export the reducer correctly
export default postSlice.reducer;
