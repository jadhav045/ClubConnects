import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		userProfile: null,
		selectedUser: null,
	},
	reducers: {
		setAuthUser: (state, action) => {
			state.user = action.payload;
			console.log("Redux state updated:", state.user);
		},

		setUserProfile: (state, action) => {
			state.userProfile = action.payload;
		},
		
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		},
		logoutUser: (state) => {
			state.user = null;
		},
	},
});

export const { setAuthUser, setUserProfile, setSelectedUser, logoutUser } =
	authSlice.actions;
export default authSlice.reducer;
