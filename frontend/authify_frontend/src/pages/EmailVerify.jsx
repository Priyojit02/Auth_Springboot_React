import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const { getUserData, backendUrl, userData, isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    // Auto-advance cursor to next input box when typing a digit
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        e.target.value = value;
        if (value && index < 5 && inputRef.current[index + 1]) {
            inputRef.current[index + 1].focus();
        }
    };

    // Auto-retreat cursor on backspace if current box is empty
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0 && inputRef.current[index - 1]) {
            inputRef.current[index - 1].focus();
        }
    };

    // Handle pasting the full 6-digit OTP at once
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

    // Verify OTP API submission
    const handleVerify = async () => {
        const otp = inputRef.current.map((input) => input?.value || "").join("");
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/verify-otp`, { otp });
            if (response.status === 200) {
                toast.success("Email verified successfully");
                await getUserData();
                navigate("/");
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    // Redirect to home if user is ALREADY verified
    useEffect(() => {
        if (isLoggedIn && userData && userData.isAccountVerified) {
            navigate("/");
        }
    }, [isLoggedIn, userData, navigate]);

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100 position-relative"
            style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)" }}
        >
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

            <div className="card p-4 shadow-sm bg-white" style={{ maxWidth: "420px", width: "100%", borderRadius: "10px" }}>
                <h3 className="text-center fw-bold mb-2">Email Verify OTP</h3>
                <p className="text-center text-muted mb-4">
                    Enter the 6-digit code sent to your email
                </p>

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
                    className="btn w-100 text-white fw-semibold py-2"
                    style={{ background: "#6a5af9", border: "none" }}
                    disabled={loading}
                    onClick={handleVerify}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    );
};

export default EmailVerify;
