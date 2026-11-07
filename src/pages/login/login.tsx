
import axios from "axios";
import { useState } from "react";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { db } from "../../database/dexie";
import "./login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await AuthService.login({
                username,
                password,
            });

            if (response.data.success) {
                const token = response.data.token;

                localStorage.setItem("token", token);

                if (rememberMe) {
                    localStorage.setItem("rememberedUsername", username);
                } else {
                    localStorage.removeItem("rememberedUsername");
                }

                await db.users.put({
                    token,
                });

                navigate("/new-sale");
            } else {
                setError(
                    response.data.message || "Invalid username or password."
                );
            }
        } catch (err) {
            console.error("Login error:", err);

            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response.data?.message ||
                    "Invalid username or password."
                );
            } else {
                setError("Unable to connect to server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mp-login">

            {/* LEFT BRANDING PANEL */}
            <section className="mp-login__brand">

                <div className="mp-login__brand-content">

                    <div className="mp-brand-logo">
                        <div className="mp-brand-logo__icon">M</div>

                        <div className="mp-brand-logo__text">
                            <strong>MASTERPIECE</strong>
                            <span>SOLUTIONS</span>
                        </div>
                    </div>

                    <div className="mp-login__intro">
                        <span className="mp-login__badge">
                            MASTERPIECE POS
                        </span>

                        <h1>
                            Point of Sale &amp;
                            <span> Inventory System</span>
                        </h1>

                        <p>
                            A complete business management solution
                            for retail, wholesale, and distribution.
                        </p>
                    </div>

                    <div className="mp-login__features">

                        <div className="mp-feature">
                            <div className="mp-feature__icon">
                                <i className="bi bi-cart3"></i>
                            </div>
                            <span>Sales &amp; Transactions</span>
                        </div>

                        <div className="mp-feature">
                            <div className="mp-feature__icon">
                                <i className="bi bi-box-seam"></i>
                            </div>
                            <span>Inventory Management</span>
                        </div>

                        <div className="mp-feature">
                            <div className="mp-feature__icon">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <span>Reports &amp; Analytics</span>
                        </div>

                        <div className="mp-feature">
                            <div className="mp-feature__icon">
                                <i className="bi bi-cloud-check"></i>
                            </div>
                            <span>Cloud-Ready &amp; Secure</span>
                        </div>

                    </div>

                    {/* POS DASHBOARD SHOWCASE */}
                    <div className="mp-login__showcase">

                        <div className="mp-showcase-window">

                            <div className="mp-showcase-sidebar">
                                <div className="mp-showcase-logo">
                                    M <span>Masterpiece POS</span>
                                </div>

                                <div className="mp-showcase-menu active">
                                    Dashboard
                                </div>
                                <div className="mp-showcase-menu">Sales</div>
                                <div className="mp-showcase-menu">Inventory</div>
                                <div className="mp-showcase-menu">Purchases</div>
                                <div className="mp-showcase-menu">Reports</div>
                            </div>

                            <div className="mp-showcase-content">
                                <h4>Business Overview</h4>

                                <div className="mp-showcase-stats">
                                    <div>
                                        <small>Today's Sales</small>
                                        <strong>₱25,450</strong>
                                    </div>

                                    <div>
                                        <small>Transactions</small>
                                        <strong>87</strong>
                                    </div>

                                    <div>
                                        <small>Products</small>
                                        <strong>1,248</strong>
                                    </div>
                                </div>

                                <div className="mp-showcase-chart">
                                    <span>Sales Performance</span>
                                    <div className="mp-chart-bars">
                                        {[35, 55, 42, 75, 60, 90, 70, 100].map(
                                            (height, index) => (
                                                <div
                                                    key={index}
                                                    style={{ height: `${height}%` }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="mp-login__brand-footer">
                    Technology Built Around Your Business.
                </div>

            </section>

            {/* RIGHT LOGIN PANEL */}
            <section className="mp-login__form-panel">

                <div className="mp-login__form-wrapper">

                    <div className="mp-login__mobile-logo">
                        <div className="mp-brand-logo__icon">M</div>
                        <strong>MASTERPIECE POS</strong>
                    </div>

                    <div className="mp-login__card">

                        <div className="mp-login__heading">
                            <div className="mp-login__app-icon">M</div>

                            <h2>
                                Masterpiece <span>POS</span>
                            </h2>

                            <p>Sign in to your account</p>
                        </div>

                        {error && (
                            <div className="mp-login__error" role="alert">
                                <i className="bi bi-exclamation-circle"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            {/* USERNAME */}
                            <div className="mp-form-group">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <div className="mp-input-wrapper">
                                    <i className="bi bi-person"></i>

                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        autoComplete="username"
                                        autoFocus
                                        required
                                    />
                                </div>

                            </div>

                            {/* PASSWORD */}
                            <div className="mp-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="mp-input-wrapper">
                                    <i className="bi bi-lock"></i>

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="mp-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <i className={
                                            showPassword
                                                ? "bi bi-eye-slash"
                                                : "bi bi-eye"
                                        }></i>
                                    </button>

                                </div>

                            </div>

                            {/* REMEMBER ME */}
                            <div className="mp-login__options">

                                <label className="mp-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                    />

                                    <span className="mp-checkbox__custom"></span>
                                    Remember me
                                </label>

                                <a href="/forgot-password">
                                    Forgot password?
                                </a>

                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                className="mp-login__submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="mp-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <i className="bi bi-arrow-right"></i>
                                    </>
                                )}
                            </button>

                        </form>

                        <div className="mp-login__security">
                            <i className="bi bi-shield-lock"></i>
                            Secure business access
                        </div>

                    </div>

                    <div className="mp-login__copyright">
                        © {new Date().getFullYear()} Masterpiece Solutions.
                        All rights reserved.
                    </div>

                </div>

            </section>

        </div>
    );
}
