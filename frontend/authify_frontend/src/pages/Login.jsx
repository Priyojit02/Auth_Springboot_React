import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";

const Login = () => {
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);

        try {
            if (isCreateAccount) {
                // Register API
                const response = await axios.post(`${backendUrl}/register`, { name, email, password });
                if (response.status === 201) {
                    toast.success("Account created successfully! Please login.");
                    setIsCreateAccount(false);
                    setPassword("");
                }
            } else {
                // Login API
                const response = await axios.post(`${backendUrl}/login`, { email, password });
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    toast.success("Logged in successfully!");
                    getUserData();
                    navigate("/");
                }
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
            style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)" }}
        >
            <div style={{ position: "absolute", top: "20px", left: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Link to="/" style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "24px",
                    textDecoration: "none",
                }}>
                    <img src={assets.logo} alt="Logo" height={32} width={32} />
                    <span className="fw-bold fs-4 text-light">Authify</span>
                </Link>
            </div>

            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}>
                <h2 className="text-center mb-4">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h2>
                <form onSubmit={onSubmitHandler}>
                    {isCreateAccount && (
                        <div className="mb-3">
                            <label htmlFor="fullname" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                className="form-control"
                                placeholder="Enter full name"
                                required
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Id</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="**********"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    {!isCreateAccount && (
                        <div className="d-flex justify-content-between mb-3">
                            <Link to="/reset-password" className="text-decoration-none">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn w-100 text-white"
                        style={{ background: "#6a5af9", border: "none" }}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : isCreateAccount ? "Sign Up" : "Login"}
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    {isCreateAccount ? "Already have an account? " : "Don't have an account? "}
                    <span
                        onClick={() => {
                            setIsCreateAccount(!isCreateAccount);
                            setPassword("");
                        }}
                        style={{ cursor: "pointer", color: "#6a5af9", fontWeight: "500" }}
                    >
                        {isCreateAccount ? "Login here" : "Sign up"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
