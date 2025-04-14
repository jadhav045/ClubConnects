import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		selectedUser: null,
		userClub: null,
	},
	reducers: {
		setAuthUser: (state, action) => {
			state.user = action.payload;
			console.log("Redux state updated:", state.user);
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		},
		setUserClub: (state, action) => {
			state.userClub = action.payload;
		},
		logoutUser: (state) => {
			state.user = null;
		},
	},
});

export const {
	setAuthUser,
	setUserProfile,
	setSelectedUser,
	logoutUser,
	setUserClub,
} = authSlice.actions;
export default authSlice.reducer;
