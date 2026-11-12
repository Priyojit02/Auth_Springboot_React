import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/logout`);
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData(null);
                setDropdownOpen(false);
                toast.success("Logged out successfully");
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to logout");
        }
    };

    // Send account verification OTP and navigate to verify page
    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/send-otp`);
            if (response.status === 200) {
                setDropdownOpen(false);
                navigate("/email-verify");
                toast.success("Verification OTP sent to your email");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to send OTP");
        }
    };

    return (
        <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
            {/* Logo and Brand */}
            <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <img src={assets.logo_home} alt="logo" width={32} height={32} />
                <span className="fw-bold fs-4 text-dark">Authify</span>
            </div>

            {/* User Profile or Login Button */}
            {userData ? (
                <div className="position-relative" ref={dropdownRef}>
                    <div
                        className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            userSelect: "none",
                            fontWeight: "600",
                        }}
                        onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                        {userData.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {dropdownOpen && (
                        <div
                            className="position-absolute bg-white shadow rounded p-2"
                            style={{
                                top: "50px",
                                right: 0,
                                zIndex: 100,
                                minWidth: "150px",
                            }}
                        >
                            {!userData.isAccountVerified && (
                                <div
                                    className="dropdown-item py-2 px-3 rounded"
                                    style={{ cursor: "pointer" }}
                                    onClick={sendVerificationOtp}
                                >
                                    <i className="bi bi-shield-check me-2"></i>Verify Account
                                </div>
                            )}
                            <div
                                className="dropdown-item py-2 px-3 rounded"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/reset-password");
                                }}
                            >
                                <i className="bi bi-key me-2"></i>Reset Password
                            </div>
                            <div
                                className="dropdown-item py-2 px-3 rounded text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>Logout
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className="btn btn-outline-dark rounded-pill px-3"
                    onClick={() => navigate("/login")}
                >
                    Login <i className="bi bi-arrow-right ms-2"></i>
                </div>
            )}
        </nav>
    );
};

export default Menubar;
