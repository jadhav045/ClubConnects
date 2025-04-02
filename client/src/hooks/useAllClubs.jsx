import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../routes/apiConfig";

export const fetchClubs = createAsyncThunk(
	"clubs/fetchClubs",
	async ({ page, limit, type }) => {
		try {
			console.log("Fetching clubs with params:", { page, limit, type }); // Debug log

			const response = await axios.get(`${API_URL}/student/clubs`, {
				params: {
					page,
					limit,
					type: type || undefined,
				},
			});

			console.log("API response:", response.data.data); // Debug log

			if (!response.data.data) {
				throw new Error("Invalid response format");
			}

			return {
				data: response.data.data,
				pagination: {
					totalPages: response.data.totalPages || 1,
					currentPage: page,
				},
			};
		} catch (error) {
			console.error("Fetch error:", error);
			throw error.response?.data?.message || "Failed to fetch clubs";
		}
	}
);
