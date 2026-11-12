import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../util/constant.js";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Fetch user profile from backend
    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get(backendUrl + "/profile");
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                toast.error("Unable to retrieve profile");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Restore authentication session on page load/refresh
    const getAuthState = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get(backendUrl + "/is-authenticated");
            if (response.status === 200 && response.data === true) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            console.error("Auth check failed:", error.message);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const contextValue = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};
