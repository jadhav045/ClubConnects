// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component wraps your app and provides authentication state
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	// Load user from localStorage (or API) on initial render
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	// Login function: set user data and store it locally
	const login = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	// Logout function: clear user data and remove it from local storage
	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	// Value provided to consuming components
	const value = {
		user,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy access to the AuthContext
export const useAuth = () => {
	return useContext(AuthContext);
};
