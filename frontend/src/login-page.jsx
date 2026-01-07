import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.svg";
import API_URL from "./config";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Get selected location from localStorage
            const location = localStorage.getItem("selectedLocation");

            if (!location) {
                alert("Please select a location first");
                navigate("/");
                return;
            }

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, location }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user)); // Store user info including isOwner
                navigate("/dashboard");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundPattern}></div>

            <div style={styles.contentWrapper}>
                <div style={styles.loginCard}>
                    <div style={styles.header}>
                        <div style={styles.logoContainer}>
                            <img
                                src={logo}
                                alt="StaffTable Logo"
                                style={styles.logo}
                            />
                        </div>
                        <h1 style={styles.title}>Welcome back</h1>
                        <p style={styles.subtitle}>
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>
                                Email address
                            </label>
                            <div style={styles.inputWrapper}>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    style={styles.input}
                                    onFocus={(e) =>
                                        (e.target.parentElement.style.borderColor =
                                            "#1a1a1a")
                                    }
                                    onBlur={(e) =>
                                        (e.target.parentElement.style.borderColor =
                                            "#d4d4d4")
                                    }
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>
                                Password
                            </label>
                            <div style={styles.inputWrapper}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    style={styles.input}
                                    onFocus={(e) =>
                                        (e.target.parentElement.style.borderColor =
                                            "#1a1a1a")
                                    }
                                    onBlur={(e) =>
                                        (e.target.parentElement.style.borderColor =
                                            "#d4d4d4")
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={styles.showPasswordBtn}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line
                                                x1="1"
                                                y1="1"
                                                x2="23"
                                                y2="23"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div style={styles.rememberForgotRow}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    style={styles.checkbox}
                                />
                                <span style={styles.checkboxText}>
                                    Remember me
                                </span>
                            </label>
                            <a href="#" style={styles.forgotLink}>
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                ...styles.submitBtn,
                                ...(isLoading ? styles.submitBtnLoading : {}),
                            }}
                        >
                            {isLoading ? (
                                <span style={styles.loadingSpinner}></span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerText}>or continue with</span>
                    </div>

                    <div style={styles.socialButtons}>
                        <button style={styles.socialBtn}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p style={styles.signupText}>
                        Don't have an account?{" "}
                        <a href="#" style={styles.signupLink}>
                            Sign up
                        </a>
                    </p>
                </div>

                <div style={styles.featuresSection}>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>🔒</div>
                        <div>
                            <h3 style={styles.featureTitle}>
                                Secure & encrypted
                            </h3>
                            <p style={styles.featureDesc}>
                                Your data is protected with enterprise-grade
                                encryption
                            </p>
                        </div>
                    </div>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>⚡</div>
                        <div>
                            <h3 style={styles.featureTitle}>Lightning fast</h3>
                            <p style={styles.featureDesc}>
                                Access your account instantly from anywhere
                            </p>
                        </div>
                    </div>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>🌐</div>
                        <div>
                            <h3 style={styles.featureTitle}>
                                Works everywhere
                            </h3>
                            <p style={styles.featureDesc}>
                                Seamless experience across all your devices
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #fafafa inset !important;
          -webkit-text-fill-color: #1a1a1a !important;
        }
      `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f3ef 0%, #e8e4dc 100%)",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
    },
    backgroundPattern: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(210, 180, 140, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(160, 140, 120, 0.1) 0%, transparent 50%),
      repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(139, 115, 85, 0.02) 60px, rgba(139, 115, 85, 0.02) 62px)
    `,
        animation: "float 20s ease-in-out infinite",
    },
    contentWrapper: {
        display: "flex",
        gap: "4rem",
        maxWidth: "1200px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        animation: "fadeInUp 0.6s ease-out",
    },
    loginCard: {
        background: "#fafafa",
        padding: "3rem",
        borderRadius: "24px",
        boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.05)",
        width: "100%",
        maxWidth: "460px",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        animation: "fadeInUp 0.6s ease-out 0.1s both",
    },
    header: {
        marginBottom: "2.5rem",
        textAlign: "center",
    },
    logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
    },
    logo: {
        width: "72px",
        height: "72px",
        padding: "0.75rem",
        background: "#1a1a1a",
        borderRadius: "16px",
        animation: "float 3s ease-in-out infinite",
    },
    title: {
        fontSize: "2.25rem",
        fontFamily: "'Crimson Pro', serif",
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: "0.5rem",
        letterSpacing: "-0.02em",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#666",
        fontWeight: 400,
        lineHeight: 1.5,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    label: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#1a1a1a",
        letterSpacing: "0.01em",
    },
    inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        border: "1.5px solid #d4d4d4",
        borderRadius: "12px",
        background: "#ffffff",
        transition: "all 0.2s ease",
    },
    input: {
        width: "100%",
        padding: "0.875rem 1rem",
        fontSize: "0.95rem",
        border: "none",
        borderRadius: "12px",
        outline: "none",
        background: "transparent",
        color: "#1a1a1a",
        fontFamily: "inherit",
    },
    showPasswordBtn: {
        position: "absolute",
        right: "0.75rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#666",
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.2s ease",
    },
    rememberForgotRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "-0.5rem",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        fontSize: "0.875rem",
        color: "#4a4a4a",
    },
    checkbox: {
        width: "16px",
        height: "16px",
        cursor: "pointer",
        accentColor: "#1a1a1a",
    },
    checkboxText: {
        userSelect: "none",
    },
    forgotLink: {
        fontSize: "0.875rem",
        color: "#1a1a1a",
        textDecoration: "none",
        fontWeight: 500,
        transition: "opacity 0.2s ease",
    },
    submitBtn: {
        width: "100%",
        padding: "1rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "#ffffff",
        background: "#1a1a1a",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginTop: "0.5rem",
        fontFamily: "inherit",
        letterSpacing: "0.02em",
    },
    submitBtnLoading: {
        opacity: 0.7,
        cursor: "not-allowed",
    },
    loadingSpinner: {
        width: "20px",
        height: "20px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderTop: "2px solid #ffffff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.6s linear infinite",
    },
    divider: {
        position: "relative",
        textAlign: "center",
        margin: "2rem 0 1.5rem",
    },
    dividerText: {
        fontSize: "0.8rem",
        color: "#999",
        background: "#fafafa",
        padding: "0 1rem",
        position: "relative",
        zIndex: 1,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: 500,
    },
    socialButtons: {
        display: "flex",
        gap: "0.75rem",
    },
    socialBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.875rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#4a4a4a",
        background: "#ffffff",
        border: "1.5px solid #d4d4d4",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
    },
    signupText: {
        textAlign: "center",
        fontSize: "0.875rem",
        color: "#666",
        marginTop: "2rem",
    },
    signupLink: {
        color: "#1a1a1a",
        textDecoration: "none",
        fontWeight: 600,
        transition: "opacity 0.2s ease",
    },
    featuresSection: {
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: "320px",
        animation: "fadeInUp 0.6s ease-out 0.2s both",
    },
    feature: {
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
    },
    featureIcon: {
        fontSize: "1.75rem",
        background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))",
        width: "3rem",
        height: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "14px",
        flexShrink: 0,
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    },
    featureTitle: {
        fontSize: "1rem",
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: "0.25rem",
        fontFamily: "'Crimson Pro', serif",
        letterSpacing: "-0.01em",
    },
    featureDesc: {
        fontSize: "0.875rem",
        color: "#666",
        lineHeight: 1.5,
    },
};
