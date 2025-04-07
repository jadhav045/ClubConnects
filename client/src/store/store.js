import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist"; // Import persistStore

import authSlice from "./slice/authSlice";
import requestSlice from "./slice/requestSlice";
import clubSlice from "./slice/clubSlice";
import eventSlice from "./slice/eventSlice";
import postSlice from "./slice/postSlice";
import discussSlice from "./slice/discussSlice";
import opportunitiesSlice from "./slice/opportunitySlice";

const persistConfig = {
	key: "root",
	version: 1,
	storage,
};

const staticReducers = {
	auth: authSlice,
	request: requestSlice,
	event: eventSlice,
	post: postSlice,
	discuss: discussSlice,
	opportunities: opportunitiesSlice,
	cl: clubSlice,
};

// Dynamic Reducer Handling
let dynamicReducers = { club: clubSlice };

// Create Reducer Function
const createRootReducer = () =>
	combineReducers({
		...staticReducers,
		...dynamicReducers,
	});

const persistedReducer = persistReducer(persistConfig, createRootReducer());

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				ignoredActionPaths: ["payload.data"],
				ignoredPaths: ["clubs.items"],
			},
		}),
});

// Persistor
export const persistor = persistStore(store);

// Debug store setup
if (process.env.NODE_ENV === "development") {
	console.log("Initial store state:", store.getState());
	store.subscribe(() => {
		// console.log("Updated store state:", store.getState());
	});
}

export default store;
