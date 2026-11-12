import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    // Auto-advance cursor to next input box when typing a digit
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        e.target.value = value;
        if (value && index < 5 && inputRef.current[index + 1]) {
            inputRef.current[index + 1].focus();
        }
    };

    // Auto-retreat cursor on backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0 && inputRef.current[index - 1]) {
            inputRef.current[index - 1].focus();
        }
    };

    // Paste full 6-digit OTP
    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
        paste.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char;
            }
        });
        const nextIndex = paste.length < 6 ? paste.length : 5;
        if (inputRef.current[nextIndex]) {
            inputRef.current[nextIndex].focus();
        }
    };

    // Step 1: Submit Email to get Reset OTP
    const handleSendResetOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/send-reset-otp`, { email });
            if (response.status === 200) {
                toast.success("Password reset OTP sent to your email");
                setIsEmailSent(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit OTP
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const enteredOtp = inputRef.current.map((input) => input?.value || "").join("");
        if (enteredOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        setOtp(enteredOtp);
        setIsOtpSubmitted(true);
    };

    // Step 3: Submit New Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/reset-password`, {
                email,
                otp,
                newPassword,
            });
            if (response.status === 200) {
                toast.success("Password reset successfully! Please login.");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
            style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)" }}
        >
            {/* Top Logo */}
            <div style={{ position: "absolute", top: "20px", left: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                    to="/"
                    style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "24px",
                        textDecoration: "none",
                    }}
                >
                    <img src={assets.logo} alt="Logo" height={32} width={32} />
                    <span className="fw-bold fs-4 text-light">Authify</span>
                </Link>
            </div>

            {/* Step 1: Enter Email */}
            {!isEmailSent && (
                <div className="card p-4 shadow-sm bg-white" style={{ maxWidth: "420px", width: "100%", borderRadius: "10px" }}>
                    <h3 className="text-center fw-bold mb-2">Reset Password</h3>
                    <p className="text-center text-muted mb-4">Enter your registered email address</p>
                    <form onSubmit={handleSendResetOtp}>
                        <div className="mb-3">
                            <label className="form-label">Email Id</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-100 text-white fw-semibold py-2"
                            style={{ background: "#6a5af9", border: "none" }}
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: Enter 6-digit OTP */}
            {isEmailSent && !isOtpSubmitted && (
                <div className="card p-4 shadow-sm bg-white" style={{ maxWidth: "420px", width: "100%", borderRadius: "10px" }}>
                    <h3 className="text-center fw-bold mb-2">Enter Reset OTP</h3>
                    <p className="text-center text-muted mb-4">Enter the 6-digit code sent to your email</p>
                    <form onSubmit={handleOtpSubmit}>
                        <div className="d-flex justify-content-between gap-2 mb-4">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="form-control text-center fw-bold fs-5"
                                    style={{ width: "48px", height: "52px" }}
                                    ref={(el) => (inputRef.current[i] = el)}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onPaste={handlePaste}
                                    required
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="btn w-100 text-white fw-semibold py-2"
                            style={{ background: "#6a5af9", border: "none" }}
                        >
                            Verify OTP
                        </button>
                    </form>
                </div>
            )}

            {/* Step 3: Enter New Password */}
            {isEmailSent && isOtpSubmitted && (
                <div className="card p-4 shadow-sm bg-white" style={{ maxWidth: "420px", width: "100%", borderRadius: "10px" }}>
                    <h3 className="text-center fw-bold mb-2">New Password</h3>
                    <p className="text-center text-muted mb-4">Enter your new password</p>
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                                minLength={6}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-100 text-white fw-semibold py-2"
                            style={{ background: "#6a5af9", border: "none" }}
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Submit New Password"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
