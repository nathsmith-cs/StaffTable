import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.svg";

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("schedule");
    const [currentWeekStart, setCurrentWeekStart] = useState(
        getWeekStart(new Date())
    );
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isOwner = user.isOwner || false;

    // New shift form state
    const [newShift, setNewShift] = useState({
        date: "",
        startTime: "",
        endTime: "",
        employeeName: "",
        role: "Server",
        notes: "",
    });

    // Helper function to get the start of the current week (Monday)
    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    // Generate days for current week
    function getWeekDays() {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + i);
            days.push(date);
        }
        return days;
    }

    // Generate calendar days for current month
    function getMonthDays() {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (
            let i = 0;
            i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1);
            i++
        ) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }

    // Fetch shifts from backend
    const fetchShifts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const startDate = currentWeekStart.toISOString().split("T")[0];
            const endDate = weekEnd.toISOString().split("T")[0];

            const response = await fetch(
                `http://localhost:5001/api/shifts/week?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setShifts(data.shifts);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Error fetching shifts:", err);
            setError("Failed to load shifts");
        } finally {
            setLoading(false);
        }
    };

    // Fetch shifts when week changes
    useEffect(() => {
        if (activeSection === "schedule") {
            fetchShifts();
        }
    }, [currentWeekStart, activeSection]);

    // Navigate week
    const previousWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    // Navigate month
    const previousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        );
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Handle shift creation
    const handleCreateShift = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5001/api/shifts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newShift),
            });

            const data = await response.json();

            if (data.success) {
                alert("Shift created successfully!");
                // Reset form
                setNewShift({
                    date: "",
                    startTime: "",
                    endTime: "",
                    employeeName: "",
                    role: "Server",
                    notes: "",
                });
                // Refresh shifts if we're on the schedule view
                if (activeSection === "schedule") {
                    fetchShifts();
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Error creating shift:", err);
            setError("Failed to create shift");
        } finally {
            setLoading(false);
        }
    };

    // Handle shift deletion
    const handleDeleteShift = async (shiftId) => {
        if (!window.confirm("Are you sure you want to delete this shift?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5001/api/shifts/${shiftId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Shift deleted successfully!");
                fetchShifts();
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Error deleting shift:", err);
            setError("Failed to delete shift");
        }
    };

    // Get shifts for a specific date
    const getShiftsForDate = (date) => {
        const dateString = date.toISOString().split("T")[0];
        return shifts.filter((shift) => {
            const shiftDate = new Date(shift.date).toISOString().split("T")[0];
            return shiftDate === dateString;
        });
    };

    // Get shifts count for calendar
    const getShiftsCountForDate = (date) => {
        if (!date) return 0;
        return getShiftsForDate(date).length;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const formatDayName = (date) => {
        return date.toLocaleDateString("en-US", { weekday: "short" });
    };

    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Convert 24-hour time to 12-hour AM/PM format
    const formatTime = (time) => {
        if (!time) return "";

        // Parse the time string (e.g., "14:30" or "09:00")
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours);
        const minute = minutes;

        // Determine AM or PM
        const period = hour >= 12 ? "PM" : "AM";

        // Convert to 12-hour format
        if (hour === 0) {
            hour = 12; // Midnight
        } else if (hour > 12) {
            hour = hour - 12;
        }

        return `${hour}:${minute} ${period}`;
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.logo}>
                        <img
                            src={logo}
                            alt="StaffTable"
                            style={styles.logoImage}
                        />
                        <h1 style={styles.logoText}>StaffTable</h1>
                    </div>
                </div>

                <nav style={styles.nav}>
                    <button
                        onClick={() => setActiveSection("schedule")}
                        style={{
                            ...styles.navItem,
                            ...(activeSection === "schedule"
                                ? styles.navItemActive
                                : {}),
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Schedule</span>
                    </button>

                    {isOwner && (
                        <button
                            onClick={() => setActiveSection("assign")}
                            style={{
                                ...styles.navItem,
                                ...(activeSection === "assign"
                                    ? styles.navItemActive
                                    : {}),
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span>Assign Shifts</span>
                        </button>
                    )}

                    <button
                        onClick={() => setActiveSection("calendar")}
                        style={{
                            ...styles.navItem,
                            ...(activeSection === "calendar"
                                ? styles.navItemActive
                                : {}),
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                        </svg>
                        <span>Calendar</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("messages")}
                        style={{
                            ...styles.navItem,
                            ...(activeSection === "messages"
                                ? styles.navItemActive
                                : {}),
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Messages</span>
                    </button>
                </nav>

                <div style={styles.sidebarFooter}>
                    <div style={styles.userProfile}>
                        <div style={styles.avatar}>
                            {user.name
                                ? user.name.substring(0, 2).toUpperCase()
                                : user.email?.substring(0, 2).toUpperCase() ||
                                  "U"}
                        </div>
                        <div style={styles.userInfo}>
                            <div style={styles.userName}>
                                {user.name || user.email || "User"}
                            </div>
                            <div style={styles.userEmail}>
                                {isOwner ? "Owner" : "Employee"}
                            </div>
                        </div>
                    </div>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                {error && (
                    <div style={styles.errorBanner}>
                        {error}
                        <button
                            onClick={() => setError(null)}
                            style={styles.errorClose}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Schedule View */}
                {activeSection === "schedule" && (
                    <div style={styles.content}>
                        <div style={styles.contentHeader}>
                            <div>
                                <h2 style={styles.contentTitle}>
                                    Weekly Schedule
                                </h2>
                                <p style={styles.contentSubtitle}>
                                    {formatDate(getWeekDays()[0])} -{" "}
                                    {formatDate(getWeekDays()[6])}
                                </p>
                            </div>
                            <div style={styles.weekNavigation}>
                                <button
                                    onClick={previousWeek}
                                    style={styles.navButton}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextWeek}
                                    style={styles.navButton}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={styles.loadingState}>
                                Loading shifts...
                            </div>
                        ) : (
                            <div style={styles.scheduleGrid}>
                                {getWeekDays().map((date, index) => {
                                    const dayShifts = getShiftsForDate(date);

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                ...styles.dayColumn,
                                                ...(isToday(date)
                                                    ? styles.dayColumnToday
                                                    : {}),
                                            }}
                                        >
                                            <div style={styles.dayHeader}>
                                                <div style={styles.dayName}>
                                                    {formatDayName(date)}
                                                </div>
                                                <div
                                                    style={{
                                                        ...styles.dayNumber,
                                                        ...(isToday(date)
                                                            ? styles.dayNumberToday
                                                            : {}),
                                                    }}
                                                >
                                                    {date.getDate()}
                                                </div>
                                            </div>
                                            <div style={styles.shiftsContainer}>
                                                {dayShifts.length > 0 ? (
                                                    dayShifts.map((shift) => (
                                                        <div
                                                            key={shift._id}
                                                            style={
                                                                styles.shiftCard
                                                            }
                                                        >
                                                            <div
                                                                style={
                                                                    styles.shiftTime
                                                                }
                                                            >
                                                                {formatTime(
                                                                    shift.startTime
                                                                )}{" "}
                                                                -{" "}
                                                                {formatTime(
                                                                    shift.endTime
                                                                )}
                                                            </div>
                                                            <div
                                                                style={
                                                                    styles.shiftEmployee
                                                                }
                                                            >
                                                                {
                                                                    shift.employeeName
                                                                }
                                                            </div>
                                                            <div
                                                                style={
                                                                    styles.shiftRole
                                                                }
                                                            >
                                                                {shift.role}
                                                            </div>
                                                            {shift.notes && (
                                                                <div
                                                                    style={
                                                                        styles.shiftNotes
                                                                    }
                                                                >
                                                                    {
                                                                        shift.notes
                                                                    }
                                                                </div>
                                                            )}
                                                            {isOwner && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteShift(
                                                                            shift._id
                                                                        )
                                                                    }
                                                                    style={
                                                                        styles.deleteShiftBtn
                                                                    }
                                                                    title="Delete shift"
                                                                >
                                                                    <svg
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                    >
                                                                        <polyline points="3 6 5 6 21 6" />
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div
                                                        style={styles.noShifts}
                                                    >
                                                        No shifts scheduled
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Assign Shifts View */}
                {activeSection === "assign" && (
                    <div style={styles.content}>
                        <div style={styles.contentHeader}>
                            <div>
                                <h2 style={styles.contentTitle}>
                                    Assign New Shift
                                </h2>
                                <p style={styles.contentSubtitle}>
                                    Create and schedule employee shifts
                                </p>
                            </div>
                        </div>

                        <div style={styles.assignContainer}>
                            <form
                                onSubmit={handleCreateShift}
                                style={styles.assignForm}
                            >
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newShift.date}
                                            onChange={(e) =>
                                                setNewShift({
                                                    ...newShift,
                                                    date: e.target.value,
                                                })
                                            }
                                            required
                                            style={styles.formInput}
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Employee Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newShift.employeeName}
                                            onChange={(e) =>
                                                setNewShift({
                                                    ...newShift,
                                                    employeeName:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="e.g., John Smith"
                                            required
                                            style={styles.formInput}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={newShift.startTime}
                                            onChange={(e) =>
                                                setNewShift({
                                                    ...newShift,
                                                    startTime: e.target.value,
                                                })
                                            }
                                            required
                                            style={styles.formInput}
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={newShift.endTime}
                                            onChange={(e) =>
                                                setNewShift({
                                                    ...newShift,
                                                    endTime: e.target.value,
                                                })
                                            }
                                            required
                                            style={styles.formInput}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Role</label>
                                    <select
                                        value={newShift.role}
                                        onChange={(e) =>
                                            setNewShift({
                                                ...newShift,
                                                role: e.target.value,
                                            })
                                        }
                                        style={styles.formSelect}
                                    >
                                        <option value="Server">Server</option>
                                        <option value="Busser">Busser</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={newShift.notes}
                                        onChange={(e) =>
                                            setNewShift({
                                                ...newShift,
                                                notes: e.target.value,
                                            })
                                        }
                                        placeholder="Any additional notes..."
                                        rows="3"
                                        style={styles.formTextarea}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.submitButton,
                                        ...(loading
                                            ? {
                                                  opacity: 0.6,
                                                  cursor: "not-allowed",
                                              }
                                            : {}),
                                    }}
                                >
                                    {loading ? "Creating..." : "Create Shift"}
                                </button>
                            </form>

                            <div style={styles.assignTips}>
                                <h3 style={styles.tipsTitle}>Quick Tips</h3>
                                <ul style={styles.tipsList}>
                                    <li>
                                        Shifts can be viewed in the Schedule tab
                                    </li>
                                    <li>
                                        Use the calendar view to see monthly
                                        overview
                                    </li>
                                    <li>
                                        Employees will be notified of new shifts
                                        (coming soon)
                                    </li>
                                    <li>
                                        You can delete shifts from the Schedule
                                        view
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar View */}
                {activeSection === "calendar" && (
                    <div style={styles.content}>
                        <div style={styles.contentHeader}>
                            <div>
                                <h2 style={styles.contentTitle}>
                                    Monthly Calendar
                                </h2>
                                <p style={styles.contentSubtitle}>
                                    {formatMonthYear(currentMonth)}
                                </p>
                            </div>
                            <div style={styles.weekNavigation}>
                                <button
                                    onClick={previousMonth}
                                    style={styles.navButton}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextMonth}
                                    style={styles.navButton}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div style={styles.calendarGrid}>
                            {[
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                            ].map((day) => (
                                <div key={day} style={styles.calendarDayName}>
                                    {day}
                                </div>
                            ))}
                            {getMonthDays().map((date, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.calendarDay,
                                        ...(date && isToday(date)
                                            ? styles.calendarDayToday
                                            : {}),
                                        ...(!date
                                            ? styles.calendarDayEmpty
                                            : {}),
                                    }}
                                >
                                    {date && (
                                        <>
                                            <div
                                                style={styles.calendarDayNumber}
                                            >
                                                {date.getDate()}
                                            </div>
                                            {getShiftsCountForDate(date) >
                                                0 && (
                                                <div
                                                    style={
                                                        styles.calendarShiftIndicator
                                                    }
                                                >
                                                    {getShiftsCountForDate(
                                                        date
                                                    )}{" "}
                                                    shift
                                                    {getShiftsCountForDate(
                                                        date
                                                    ) !== 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages View */}
                {activeSection === "messages" && (
                    <div style={styles.content}>
                        <div style={styles.contentHeader}>
                            <div>
                                <h2 style={styles.contentTitle}>Messages</h2>
                                <p style={styles.contentSubtitle}>
                                    Team communications
                                </p>
                            </div>
                        </div>

                        <div style={styles.emptyState}>
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ccc"
                                strokeWidth="1.5"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <h3 style={styles.emptyStateTitle}>
                                No messages yet
                            </h3>
                            <p style={styles.emptyStateText}>
                                Start a conversation with your team members
                            </p>
                            <button style={styles.emptyStateButton}>
                                New Message
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Newsreader:wght@400;600&display=swap');
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
        display: "flex",
        minHeight: "100vh",
        background: "#f8f9fa",
        fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    sidebar: {
        width: "280px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
    },
    sidebarHeader: {
        padding: "2rem 1.5rem",
        borderBottom: "1px solid #e5e7eb",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
    },
    logoImage: {
        width: "36px",
        height: "36px",
        padding: "0.5rem",
        background: "#1a1a1a",
        borderRadius: "8px",
        boxSizing: "content-box",
    },
    logoText: {
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#1a1a1a",
        fontFamily: "'Newsreader', serif",
    },
    nav: {
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flex: 1,
    },
    navItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.875rem 1rem",
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#6b7280",
        background: "transparent",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        textAlign: "left",
    },
    navItemActive: {
        background: "#f3f4f6",
        color: "#1a1a1a",
    },
    sidebarFooter: {
        padding: "1.5rem",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    userProfile: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "0.875rem",
        fontWeight: 600,
    },
    userInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "0.125rem",
    },
    userName: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#1a1a1a",
    },
    userEmail: {
        fontSize: "0.75rem",
        color: "#9ca3af",
    },
    logoutBtn: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: "transparent",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: "#6b7280",
    },
    main: {
        flex: 1,
        overflow: "auto",
    },
    content: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "3rem",
        animation: "fadeIn 0.4s ease",
    },
    contentHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "2rem",
    },
    contentTitle: {
        fontSize: "2rem",
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: "0.25rem",
        fontFamily: "'Newsreader', serif",
    },
    contentSubtitle: {
        fontSize: "0.95rem",
        color: "#6b7280",
        fontWeight: 500,
    },
    weekNavigation: {
        display: "flex",
        gap: "0.5rem",
    },
    navButton: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: "#4b5563",
    },
    errorBanner: {
        maxWidth: "1400px",
        margin: "0 auto 2rem",
        padding: "1rem 1.5rem",
        background: "#fee",
        color: "#c00",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    errorClose: {
        background: "none",
        border: "none",
        fontSize: "1.5rem",
        cursor: "pointer",
        color: "#c00",
    },
    loadingState: {
        textAlign: "center",
        padding: "4rem",
        color: "#6b7280",
        fontSize: "1.1rem",
    },
    scheduleGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
    },
    dayColumn: {
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        minHeight: "250px",
        display: "flex",
        flexDirection: "column",
    },
    dayColumnToday: {
        border: "2px solid #3b82f6",
    },
    dayHeader: {
        padding: "1rem",
        borderBottom: "1px solid #e5e7eb",
        background: "#fafbfc",
    },
    dayName: {
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "0.25rem",
    },
    dayNumber: {
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "#1a1a1a",
    },
    dayNumberToday: {
        color: "#3b82f6",
    },
    shiftsContainer: {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        flex: 1,
        overflow: "auto",
    },
    shiftCard: {
        padding: "0.875rem",
        background: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        position: "relative",
    },
    shiftTime: {
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#4b5563",
        marginBottom: "0.5rem",
    },
    shiftEmployee: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#1a1a1a",
        marginBottom: "0.25rem",
    },
    shiftRole: {
        fontSize: "0.75rem",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
    },
    shiftNotes: {
        fontSize: "0.75rem",
        color: "#6b7280",
        marginTop: "0.5rem",
        fontStyle: "italic",
    },
    deleteShiftBtn: {
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        background: "#fee",
        border: "none",
        borderRadius: "4px",
        padding: "0.25rem",
        cursor: "pointer",
        color: "#c00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
        transition: "opacity 0.2s",
    },
    noShifts: {
        padding: "2rem 1rem",
        textAlign: "center",
        color: "#9ca3af",
        fontSize: "0.875rem",
    },
    assignContainer: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "2rem",
        maxWidth: "1200px",
    },
    assignForm: {
        background: "#ffffff",
        padding: "2rem",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
    },
    formRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1.5rem",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    formLabel: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#1a1a1a",
    },
    formInput: {
        padding: "0.75rem 1rem",
        fontSize: "0.95rem",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.2s",
    },
    formSelect: {
        padding: "0.75rem 1rem",
        fontSize: "0.95rem",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontFamily: "inherit",
        outline: "none",
        background: "#ffffff",
        cursor: "pointer",
    },
    formTextarea: {
        padding: "0.75rem 1rem",
        fontSize: "0.95rem",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontFamily: "inherit",
        outline: "none",
        resize: "vertical",
    },
    submitButton: {
        width: "100%",
        padding: "1rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "#ffffff",
        background: "#1a1a1a",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
    },
    assignTips: {
        background: "#f9fafb",
        padding: "1.5rem",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
    },
    tipsTitle: {
        fontSize: "1rem",
        fontWeight: 600,
        color: "#1a1a1a",
        marginBottom: "1rem",
    },
    tipsList: {
        paddingLeft: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    calendarGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "1px",
        background: "#e5e7eb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
    },
    calendarDayName: {
        background: "#fafbfc",
        padding: "1rem",
        textAlign: "center",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    calendarDay: {
        background: "#ffffff",
        padding: "1rem",
        minHeight: "120px",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s ease",
    },
    calendarDayEmpty: {
        background: "#f9fafb",
        cursor: "default",
    },
    calendarDayToday: {
        background: "#eff6ff",
    },
    calendarDayNumber: {
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "#1a1a1a",
        marginBottom: "0.5rem",
    },
    calendarShiftIndicator: {
        fontSize: "0.75rem",
        color: "#6b7280",
        background: "#f3f4f6",
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        display: "inline-block",
        marginTop: "0.5rem",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        textAlign: "center",
        minHeight: "500px",
    },
    emptyStateTitle: {
        fontSize: "1.5rem",
        fontWeight: 600,
        color: "#1a1a1a",
        marginTop: "1.5rem",
        marginBottom: "0.5rem",
    },
    emptyStateText: {
        fontSize: "0.95rem",
        color: "#6b7280",
        marginBottom: "2rem",
        maxWidth: "400px",
    },
    emptyStateButton: {
        padding: "0.875rem 1.5rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "#ffffff",
        background: "#1a1a1a",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
    },
};
