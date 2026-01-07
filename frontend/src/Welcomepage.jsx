import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.svg";

export default function WelcomePage() {
    const [selectedLocation, setSelectedLocation] = useState("");
    const navigate = useNavigate();

    const locations = [
        { value: "becker", label: "Il Bosco - Becker" },
        { value: "tempe", label: "Il Bosco - Tempe" },
        { value: "downtown", label: "Il Bosco - Downtown" },
        { value: "north-scottsdale", label: "Il Bosco - North Scottsdale" },
    ];

    const handleContinue = () => {
        if (selectedLocation) {
            // Store selected location in localStorage
            localStorage.setItem("selectedLocation", selectedLocation);
            // Navigate to login
            navigate("/login");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundPattern}></div>

            <div style={styles.content}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Il Bosco Logo" style={styles.logo} />
                </div>

                <h1 style={styles.title}>Welcome to Il Bosco</h1>
                <p style={styles.subtitle}>Select your location to continue</p>

                <div style={styles.selectContainer}>
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        style={{
                            ...styles.select,
                            ...(selectedLocation ? styles.selectFilled : {}),
                        }}
                    >
                        <option value="" disabled>
                            Choose a location
                        </option>
                        {locations.map((location) => (
                            <option key={location.value} value={location.value}>
                                {location.label}
                            </option>
                        ))}
                    </select>

                    <svg
                        style={styles.selectIcon}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selectedLocation}
                    style={{
                        ...styles.continueBtn,
                        ...(selectedLocation
                            ? styles.continueBtnActive
                            : styles.continueBtnDisabled),
                    }}
                >
                    Continue
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>

                <div style={styles.locationsList}>
                    {locations.map((location, index) => (
                        <div
                            key={location.value}
                            style={{
                                ...styles.locationItem,
                                animationDelay: `${index * 0.1}s`,
                            }}
                        >
                            <div style={styles.locationDot}></div>
                            <span style={styles.locationName}>
                                {location.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
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
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        fontFamily:
            "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
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
      radial-gradient(circle at 20% 30%, rgba(139, 115, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(184, 134, 11, 0.08) 0%, transparent 50%),
      repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255, 255, 255, 0.02) 100px, rgba(255, 255, 255, 0.02) 102px)
    `,
    },
    content: {
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        maxWidth: "600px",
        width: "100%",
        animation: "fadeIn 0.8s ease-out",
    },
    logoContainer: {
        marginBottom: "3rem",
        animation: "fadeInUp 0.6s ease-out",
    },
    logo: {
        width: "120px",
        height: "120px",
        padding: "1.5rem",
        background: "#1a1a1a",
        borderRadius: "24px",
        border: "2px solid rgba(184, 134, 11, 0.3)",
        boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(184, 134, 11, 0.2)",
        animation: "float 4s ease-in-out infinite",
    },
    title: {
        fontSize: "4rem",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        color: "#ffffff",
        marginBottom: "1rem",
        letterSpacing: "0.02em",
        textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        animation: "fadeInUp 0.6s ease-out 0.1s both",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "rgba(255, 255, 255, 0.7)",
        marginBottom: "4rem",
        fontWeight: 400,
        letterSpacing: "0.05em",
        animation: "fadeInUp 0.6s ease-out 0.2s both",
    },
    selectContainer: {
        position: "relative",
        marginBottom: "2rem",
        animation: "fadeInUp 0.6s ease-out 0.3s both",
    },
    select: {
        width: "100%",
        padding: "1.25rem 3.5rem 1.25rem 1.5rem",
        fontSize: "1.1rem",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.5)",
        background: "rgba(255, 255, 255, 0.05)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        outline: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.3s ease",
        appearance: "none",
        backdropFilter: "blur(10px)",
    },
    selectFilled: {
        color: "#ffffff",
        background: "rgba(255, 255, 255, 0.1)",
        border: "2px solid rgba(184, 134, 11, 0.5)",
        boxShadow: "0 8px 32px rgba(184, 134, 11, 0.2)",
    },
    selectIcon: {
        position: "absolute",
        right: "1.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "rgba(255, 255, 255, 0.5)",
    },
    continueBtn: {
        width: "100%",
        padding: "1.25rem 2rem",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#1a1a1a",
        background: "linear-gradient(135deg, #b8860b 0%, #daa520 100%)",
        border: "none",
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: "inherit",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        boxShadow: "0 8px 32px rgba(184, 134, 11, 0.3)",
        animation: "fadeInUp 0.6s ease-out 0.4s both",
    },
    continueBtnActive: {
        transform: "translateY(0)",
    },
    continueBtnDisabled: {
        opacity: 0.4,
        cursor: "not-allowed",
        boxShadow: "none",
    },
    locationsList: {
        marginTop: "4rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
    },
    locationItem: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "0.95rem",
        fontWeight: 500,
        animation: "fadeInUp 0.6s ease-out both",
        transition: "color 0.2s ease",
    },
    locationDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #b8860b 0%, #daa520 100%)",
        boxShadow: "0 0 10px rgba(184, 134, 11, 0.5)",
        animation: "pulse 2s ease-in-out infinite",
    },
    locationName: {
        letterSpacing: "0.03em",
    },
};
