import { createSlice } from "@reduxjs/toolkit";
import { fetchClubs } from "../../hooks/useAllClubs";
// import { fetchClubs } from "../hooks/useAllClubs";

const clubsSlice = createSlice({
	name: "clubs",
	initialState: {
		items: [],
		loading: false,
		error: null,
		page: 1,
		limit: 10,
		totalPages: 1,
		type: "",
	},
	reducers: {
		setPage: (state, action) => {
			state.page = action.payload;
		},
		setType: (state, action) => {
			state.type = action.payload;
		},
		removeClub: (state, action) => {
			state.items = state.items.filter((club) => club._id !== action.payload);
		},
		removeAllClubs: (state) => {
			state.items = [];
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchClubs.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClubs.fulfilled, (state, action) => {
				// console.log('Fulfilled payload:', action.payload); // Debug log
				state.loading = false;
				state.items = action.payload.data;
				state.totalPages = action.payload.pagination.totalPages;
				state.page = action.payload.pagination.currentPage;
			})
			.addCase(fetchClubs.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
				state.items = [];
			});
	},
});

// Debug export
// console.log(
// 	"Club slice created with initial state:",
// 	// clubsSlice.getInitialState()
// );

export const { setPage, setType, removeClub, removeAllClubs } =
	clubsSlice.actions;
export default clubsSlice.reducer;
