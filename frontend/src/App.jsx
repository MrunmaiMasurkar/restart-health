
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "habits", label: "My Habits", icon: "🌱" },
  { id: "history", label: "History", icon: "↺" },
];

function App() {
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState("");
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("movement");
  const [dailyTarget, setDailyTarget] = useState("10");

  const [selectedHabit, setSelectedHabit] = useState("");
  const [status, setStatus] = useState("completed");
  const [note, setNote] = useState("");
  const [barrier, setBarrier] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!modal) return;

    function handleEscape(event) {
      if (event.key === "Escape" && !saving) {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modal, saving]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [goalsResponse, checkInsResponse] = await Promise.all([
        fetch(`${API_URL}/goals`),
        fetch(`${API_URL}/check-ins`),
      ]);

      if (!goalsResponse.ok || !checkInsResponse.ok) {
        throw new Error("Could not load ReStart data.");
      }

      const [goals, records] = await Promise.all([
        goalsResponse.json(),
        checkInsResponse.json(),
      ]);

      setHabits(goals);
      setCheckIns(records);
    } catch {
      setError(
        "Unable to load data. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateHabit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          daily_target: Number(dailyTarget),
        }),
      });

      if (!response.ok) {
        const details = await response.json();
        throw new Error(
          typeof details.detail === "string"
            ? details.detail
            : "Could not create the habit. Check your inputs."
        );
      }

      const newHabit = await response.json();

      setHabits((current) => [...current, newHabit]);
      setSelectedHabit(String(newHabit.id));
      setTitle("");
      setCategory("movement");
      setDailyTarget("10");
      setMessage("Your new habit has been created!");
      setModal("");
      setView("habits");
    } catch (err) {
      setError(err.message || "Could not create the habit.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckIn(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/check-ins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: Number(selectedHabit),
          status,
          note: note.trim(),
          barrier: status === "missed" && barrier ? barrier : null,
        }),
      });

      if (!response.ok) {
        const details = await response.json();
        throw new Error(
          typeof details.detail === "string"
            ? details.detail
            : "Could not save your check-in."
        );
      }

      const savedCheckIn = await response.json();

      setCheckIns((current) => [savedCheckIn, ...current]);
      setNote("");
      setBarrier("");
      setModal("");
      setView("dashboard");

      if (savedCheckIn.status === "missed") {
        setAiSuggestion("Getting your personalized suggestion...");

        try {
          const suggestionResponse = await fetch(
            `${API_URL}/check-ins/${savedCheckIn.id}/suggestion`
          );

          if (!suggestionResponse.ok) {
            throw new Error("Suggestion unavailable");
          }

          const suggestionData = await suggestionResponse.json();
          setAiSuggestion(suggestionData.suggestion);
        } catch {
          setAiSuggestion(
            "Your check-in was saved, but we couldn't load a suggestion. Please try again later."
          );
        }

        setMessage("");
      } else {
        setAiSuggestion("");
        setMessage("Your daily check-in has been saved. Keep going! 🌱");
      }
    } catch (err) {
      setError(err.message || "Could not save your check-in.");
    } finally {
      setSaving(false);
    }
  }

  const completedCount = checkIns.filter(
    (item) => item.status === "completed"
  ).length;

  const partialCount = checkIns.filter(
    (item) => item.status === "partially_completed"
  ).length;

  const missedCount = checkIns.filter(
    (item) => item.status === "missed"
  ).length;

  const completionPercentage = checkIns.length
    ? Math.round((completedCount / checkIns.length) * 100)
    : 0;

  function habitName(goalId) {
    return (
      habits.find((habit) => habit.id === goalId)?.title ||
      `Habit #${goalId}`
    );
  }

  function formatStatus(value = "") {
    return value.replaceAll("_", " ");
  }

  function openModal(type) {
    setError("");
    setMessage("");

    if (type === "checkin" && !selectedHabit && habits.length > 0) {
      setSelectedHabit(String(habits[0].id));
    }

    setModal(type);
  }

  function closeModal() {
    if (saving) return;
    setModal("");
    setError("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => setView("dashboard")}
          aria-label="Go to ReStart dashboard"
        >
          <span className="brand-mark">🌱</span>
          <span className="brand-copy">
            <strong>ReStart</strong>
            <small>Small steps, every day</small>
          </span>
        </button>

        <p className="sidebar-label">YOUR SPACE</p>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => {
                setView(item.id);
                setError("");
              }}
              aria-current={view === item.id ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <p className="sidebar-label">QUICK ACTIONS</p>

        <button
          className="sidebar-action primary-action"
          onClick={() => openModal("habit")}
        >
          <span className="action-symbol">＋</span>
          <span>Add Habit</span>
        </button>

        <button
          className="sidebar-action secondary-action"
          onClick={() => openModal("checkin")}
        >
          <span className="action-symbol">✓</span>
          <span>Daily Check-in</span>
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-leaf">✳</span>
            <strong>Progress, not perfection.</strong>
            <p>Every day is another chance to begin again.</p>
          </div>
          <span className="sidebar-footer">
            ReStart · Healthy habits
          </span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <span className="topbar-label">
            Your personal wellness space
          </span>
          <span className="online-indicator">
            <span />
            Your journey, your pace
          </span>
        </header>

        <div className="page-content">
          {error && !modal && (
            <div className="alert alert-error" role="alert">
              {error}
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {message && !modal && (
            <div className="alert alert-success" role="status">
              <span>{message}</span>
              <button
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <span className="spinner" />
              <p>Loading your progress...</p>
            </div>
          ) : (
            <>
              {view === "dashboard" && (
                <>
                  <div className="welcome-banner">
                    <div className="welcome-copy">
                      <span className="eyebrow">
                        A FRESH START, EVERY DAY
                      </span>
                      <h1>
                        Small steps.
                        <br />
                        Meaningful progress.
                      </h1>
                      <p>
                        Healthy habits are built one day at a time.
                        Celebrate what you do, learn from what gets in the
                        way, and keep moving forward.
                      </p>
                    </div>

                    <div className="welcome-art" aria-hidden="true">
                      <span className="art-circle art-circle-one" />
                      <span className="art-circle art-circle-two" />
                      <span className="art-plant">🌿</span>
                    </div>
                  </div>

                  {aiSuggestion && (
                    <section
                      className="suggestion-card"
                      aria-live="polite"
                    >
                      <div className="suggestion-icon">🌿</div>
                      <div className="suggestion-content">
                        <span className="eyebrow">
                          A GENTLE NEXT STEP
                        </span>
                        <h2>Your personalized suggestion</h2>
                        <p>{aiSuggestion}</p>
                      </div>
                      <button
                        className="suggestion-dismiss"
                        onClick={() => setAiSuggestion("")}
                        aria-label="Dismiss suggestion"
                      >
                        ×
                      </button>
                    </section>
                  )}

                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">YOUR OVERVIEW</span>
                      <h2>Your progress</h2>
                    </div>
                    <span className="subtle-label">
                      {checkIns.length} check-ins recorded
                    </span>
                  </div>

                  <div className="stats-grid">
                    <article className="stat-card">
                      <div className="stat-top">
                        <span className="stat-icon green-icon">✓</span>
                        <span className="stat-caption">Completed</span>
                      </div>
                      <strong>{completedCount}</strong>
                      <span className="stat-foot">
                        Habits completed fully
                      </span>
                    </article>

                    <article className="stat-card">
                      <div className="stat-top">
                        <span className="stat-icon amber-icon">◐</span>
                        <span className="stat-caption">Partially done</span>
                      </div>
                      <strong>{partialCount}</strong>
                      <span className="stat-foot">
                        Every bit of effort counts
                      </span>
                    </article>

                    <article className="stat-card">
                      <div className="stat-top">
                        <span className="stat-icon rose-icon">↻</span>
                        <span className="stat-caption">Missed</span>
                      </div>
                      <strong>{missedCount}</strong>
                      <span className="stat-foot">
                        Opportunities to try again
                      </span>
                    </article>
                  </div>

                  <article className="panel completion-panel">
                    <div className="completion-heading">
                      <div>
                        <span className="eyebrow">
                          CONSISTENCY OVER TIME
                        </span>
                        <h3>Completion rate</h3>
                        <p>Based on all your recorded check-ins.</p>
                      </div>
                      <strong>{completionPercentage}%</strong>
                    </div>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label="Completed check-ins percentage"
                      aria-valuenow={completionPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-fill"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>

                    <p className="completion-foot">
                      {completedCount} of {checkIns.length} check-ins fully
                      completed.
                    </p>
                  </article>

                  <div className="dashboard-grid">
                    <article className="panel">
                      <div className="panel-heading">
                        <div>
                          <span className="eyebrow">KEEP GROWING</span>
                          <h3>Your habits</h3>
                        </div>
                        <button
                          className="subtle-link"
                          onClick={() => setView("habits")}
                        >
                          View all →
                        </button>
                      </div>

                      {habits.length === 0 ? (
                        <p className="empty-text">
                          Your first habit is waiting for you.
                        </p>
                      ) : (
                        <div className="habit-list">
                          {habits.slice(0, 5).map((habit) => (
                            <div className="habit-row" key={habit.id}>
                              <span className="habit-emoji">🌱</span>
                              <div className="habit-info">
                                <strong>{habit.title}</strong>
                                <span>
                                  {formatStatus(habit.category)} ·{" "}
                                  {habit.daily_target} min/day
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>

                    <article className="panel">
                      <div className="panel-heading">
                        <div>
                          <span className="eyebrow">
                            LOOK BACK GENTLY
                          </span>
                          <h3>Recent check-ins</h3>
                        </div>
                        <button
                          className="subtle-link"
                          onClick={() => setView("history")}
                        >
                          View history →
                        </button>
                      </div>

                      {checkIns.length === 0 ? (
                        <p className="empty-text">
                          Your check-ins will appear here.
                        </p>
                      ) : (
                        <div className="habit-list">
                          {checkIns.slice(0, 5).map((item) => (
                            <div className="habit-row" key={item.id}>
                              <span className="habit-emoji">📝</span>
                              <div className="habit-info">
                                <strong>{habitName(item.goal_id)}</strong>
                                <span>{formatStatus(item.status)}</span>
                              </div>
                              <span
                                className={`status status-${item.status}`}
                              >
                                {item.status === "completed"
                                  ? "Done"
                                  : item.status === "missed"
                                    ? "Missed"
                                    : "Partial"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  </div>
                </>
              )}

              {view === "habits" && (
                <>
                  <div className="page-heading">
                    <span className="eyebrow">YOUR PERSONAL GOALS</span>
                    <h1>My habits</h1>
                    <p>
                      Small, realistic steps that fit into your everyday
                      life.
                    </p>
                  </div>

                  <div className="panel">
                    <div className="panel-heading">
                      <div>
                        <h3>Your habit list</h3>
                        <p>{habits.length} habit(s) created</p>
                      </div>
                    </div>

                    {habits.length === 0 ? (
                      <p className="empty-text">
                        No habits yet. Use Add Habit in the sidebar to get
                        started.
                      </p>
                    ) : (
                      <div className="habit-list habit-list-large">
                        {habits.map((habit) => (
                          <div className="habit-row" key={habit.id}>
                            <span className="habit-emoji">🌱</span>
                            <div className="habit-info">
                              <strong>{habit.title}</strong>
                              <span>
                                {formatStatus(habit.category)} · Daily
                                target: {habit.daily_target} minutes
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {view === "history" && (
                <>
                  <div className="page-heading">
                    <span className="eyebrow">YOUR JOURNEY SO FAR</span>
                    <h1>Check-in history</h1>
                    <p>
                      Look back at your progress with kindness, not
                      judgement.
                    </p>
                  </div>

                  <div className="panel">
                    <div className="panel-heading">
                      <div>
                        <h3>All check-ins</h3>
                        <p>{checkIns.length} recorded check-in(s)</p>
                      </div>
                    </div>

                    {checkIns.length === 0 ? (
                      <p className="empty-text">
                        Your check-ins will appear here when you record
                        them.
                      </p>
                    ) : (
                      <div className="history-list">
                        {checkIns.map((item) => (
                          <article className="history-item" key={item.id}>
                            <div className="history-top">
                              <div>
                                <strong>{habitName(item.goal_id)}</strong>
                                <span>Check-in #{item.id}</span>
                              </div>
                              <span
                                className={`status status-${item.status}`}
                              >
                                {formatStatus(item.status)}
                              </span>
                            </div>

                            {item.note && <p>{item.note}</p>}

                            {item.barrier && (
                              <p className="barrier-note">
                                <strong>What got in the way:</strong>{" "}
                                {formatStatus(item.barrier)}
                              </p>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <footer className="page-footer">
            <span>Made for progress, not perfection.</span>
            <span>
              ReStart <span className="footer-leaf">✳</span>
            </span>
          </footer>
        </div>
      </main>

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-icon">
                  {modal === "habit" ? "🌱" : "✳"}
                </span>
                <span className="eyebrow">
                  {modal === "habit"
                    ? "BUILD YOUR ROUTINE"
                    : "CHECK IN WITH YOURSELF"}
                </span>
                <h2 id="modal-title">
                  {modal === "habit" ? "Add a habit" : "Daily check-in"}
                </h2>
                <p>
                  {modal === "habit"
                    ? "Start small. Choose something achievable."
                    : "Every honest check-in helps you learn."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="alert alert-error modal-alert" role="alert">
                {error}
              </div>
            )}

            {modal === "habit" && (
              <form className="modal-form" onSubmit={handleCreateHabit}>
                <div className="form-field">
                  <label htmlFor="habit-title">Habit name</label>
                  <input
                    id="habit-title"
                    type="text"
                    placeholder="e.g. Walk for 10 minutes"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    minLength={3}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="habit-category">Category</label>
                  <select
                    id="habit-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="movement">Movement</option>
                    <option value="sleep">Sleep</option>
                    <option value="hydration">Hydration</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="daily-target">
                    Daily target (minutes)
                  </label>
                  <input
                    id="daily-target"
                    type="number"
                    min="1"
                    max="1440"
                    value={dailyTarget}
                    onChange={(event) =>
                      setDailyTarget(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={saving}
                  >
                    {saving ? "Creating..." : "Create habit"}
                  </button>
                </div>
              </form>
            )}

            {modal === "checkin" &&
              (habits.length === 0 ? (
                <div className="no-habits">
                  <p>
                    Create a habit first before recording your progress.
                  </p>
                  <button
                    className="submit-button"
                    onClick={() => {
                      setModal("habit");
                      setError("");
                    }}
                  >
                    Create a habit
                  </button>
                </div>
              ) : (
                <form className="modal-form" onSubmit={handleCheckIn}>
                  <div className="form-field">
                    <label htmlFor="checkin-habit">Which habit?</label>
                    <select
                      id="checkin-habit"
                      value={selectedHabit}
                      onChange={(event) =>
                        setSelectedHabit(event.target.value)
                      }
                      required
                    >
                      <option value="">Choose a habit</option>
                      {habits.map((habit) => (
                        <option key={habit.id} value={habit.id}>
                          {habit.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="checkin-status">How did it go?</label>
                    <select
                      id="checkin-status"
                      value={status}
                      onChange={(event) => {
                        setStatus(event.target.value);
                        setBarrier("");
                      }}
                    >
                      <option value="completed">Completed</option>
                      <option value="partially_completed">
                        Partially completed
                      </option>
                      <option value="missed">Missed</option>
                    </select>
                  </div>

                  {status === "missed" && (
                    <div className="form-field">
                      <label htmlFor="checkin-barrier">
                        What got in the way? (optional)
                      </label>
                      <select
                        id="checkin-barrier"
                        value={barrier}
                        onChange={(event) =>
                          setBarrier(event.target.value)
                        }
                      >
                        <option value="">Choose an option</option>
                        <option value="not_enough_time">
                          Not enough time
                        </option>
                        <option value="low_energy">Low energy</option>
                        <option value="forgot">Forgot</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}

                  <div className="form-field">
                    <label htmlFor="checkin-note">
                      A note about today (optional)
                    </label>
                    <textarea
                      id="checkin-note"
                      rows="3"
                      maxLength="300"
                      placeholder="What went well, or what made it difficult?"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                    <span className="field-hint">
                      {note.length}/300
                    </span>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeModal}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={saving || !selectedHabit}
                    >
                      {saving ? "Saving..." : "Save check-in"}
                    </button>
                  </div>
                </form>
              ))}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
