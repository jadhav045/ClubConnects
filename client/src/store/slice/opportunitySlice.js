import { createSlice } from "@reduxjs/toolkit";
import { fetchOpportunities } from "../../hooks/useAllOpportunity";

const opportunitiesSlice = createSlice({
	name: "opportunities",
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
		removeOpportunity: (state, action) => {
			state.items = state.items.filter((opp) => opp._id !== action.payload);
		},
		removeAllOpportunities: (state, action) => {
			state.items = [];
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchOpportunities.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOpportunities.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.data;
				state.totalPages = action.payload.pagination.totalPages;
			})
			.addCase(fetchOpportunities.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			});
	},
});

export const { setPage, setType, removeOpportunity } =
	opportunitiesSlice.actions;
export default opportunitiesSlice.reducer;
