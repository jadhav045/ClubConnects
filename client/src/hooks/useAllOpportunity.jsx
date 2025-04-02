import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3002/opportunities"; // Update API URL

// 🔹 Async Thunk: Fetch Opportunities with Pagination & Filtering
export const fetchOpportunities = createAsyncThunk(
	"opportunities/fetchOpportunities",
	async ({ page = 1, limit = 10, type = "" }, { rejectWithValue }) => {
		try {
			console.log(type);
			const response = await axios.get(
				`${API_URL}?page=${page}&limit=${limit}&type=${type}`
			);

			console.log(response.data);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
