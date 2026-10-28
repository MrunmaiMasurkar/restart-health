
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("movement");
  const [dailyTarget, setDailyTarget] = useState("10");
  const [saving, setSaving] = useState(false);

  const [selectedHabit, setSelectedHabit] = useState("");
  const [status, setStatus] = useState("completed");
  const [note, setNote] = useState("");
  const [barrier, setBarrier] = useState("");
  const [checkInMessage, setCheckInMessage] = useState("");
  const [checkInSaving, setCheckInSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      setError("");

      const [habitsResponse, checkInsResponse] = await Promise.all([
        fetch(`${API_URL}/goals`),
        fetch(`${API_URL}/check-ins`),
      ]);

      if (!habitsResponse.ok || !checkInsResponse.ok) {
        throw new Error("Could not load your ReStart data.");
      }

      const [habitsData, checkInsData] = await Promise.all([
        habitsResponse.json(),
        checkInsResponse.json(),
      ]);

      setHabits(habitsData);
      setCheckIns(checkInsData);
    } catch {
      setError(
        "Unable to load your data. Please check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          daily_target: Number(dailyTarget),
        }),
      });

      if (!response.ok) {
        const details = await response.json();

        throw new Error(
          details.detail
            ? JSON.stringify(details.detail)
            : "Could not create the habit."
        );
      }

      const newHabit = await response.json();

      setHabits((current) => [...current, newHabit]);
      setTitle("");
      setCategory("movement");
      setDailyTarget("10");
    } catch (error) {
      setError(error.message || "Could not create the habit.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckIn(event) {
    event.preventDefault();
    setCheckInMessage("");
    setError("");
    setCheckInSaving(true);

    try {
      const response = await fetch(`${API_URL}/check-ins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          details.detail
            ? JSON.stringify(details.detail)
            : "Could not save your check-in."
        );
      }

      const savedCheckIn = await response.json();

      setCheckIns((current) => [savedCheckIn, ...current]);
      setNote("");
      setBarrier("");

      if (savedCheckIn.status === "missed") {
        setCheckInMessage(
          "Check-in saved! Finding a helpful suggestion..."
        );

        const suggestionResponse = await fetch(
          `${API_URL}/check-ins/${savedCheckIn.id}/suggestion`
        );

        if (!suggestionResponse.ok) {
          throw new Error(
            "Your check-in was saved, but the suggestion could not be loaded."
          );
        }

        const suggestionData = await suggestionResponse.json();

        setCheckInMessage(
          `Your check-in is saved. Here's an idea to try: ${suggestionData.suggestion}`
        );
      } else {
        setCheckInMessage("Your daily check-in has been saved! 🌱");
      }
    } catch (error) {
      setError(error.message || "Could not save your check-in.");
    } finally {
      setCheckInSaving(false);
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

  const totalCheckIns = checkIns.length;

  const completionPercentage =
    totalCheckIns === 0
      ? 0
      : Math.round((completedCount / totalCheckIns) * 100);

  function getHabitTitle(goalId) {
    const habit = habits.find((item) => item.id === goalId);
    return habit ? habit.title : `Habit #${goalId}`;
  }

  function formatStatus(value) {
    return value.replaceAll("_", " ");
  }

  return (
    <main>
      <header>
        <h1>ReStart 🌱</h1>
        <p>Small steps. Healthier habits.</p>
      </header>

      {error && <p role="alert">{error}</p>}

      <section>
        <h2>Create a habit</h2>
        <p>Choose one small step you want to work toward.</p>

        <form className="habit-form" onSubmit={handleSubmit}>
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

          <label htmlFor="daily-target">Daily target (minutes)</label>
          <input
            id="daily-target"
            type="number"
            min="1"
            max="1440"
            value={dailyTarget}
            onChange={(event) => setDailyTarget(event.target.value)}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create habit"}
          </button>
        </form>
      </section>

      <section>
        <h2>Daily check-in</h2>
        <p>
          Progress isn't all-or-nothing. Check in honestly, at your own pace.
        </p>

        {habits.length === 0 ? (
          <p>Create a habit first to record a check-in.</p>
        ) : (
          <form className="habit-form" onSubmit={handleCheckIn}>
            <label htmlFor="checkin-habit">Which habit?</label>
            <select
              id="checkin-habit"
              value={selectedHabit}
              onChange={(event) => setSelectedHabit(event.target.value)}
              required
            >
              <option value="">Choose a habit</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.title}
                </option>
              ))}
            </select>

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

            {status === "missed" && (
              <>
                <label htmlFor="checkin-barrier">
                  What got in the way?
                </label>
                <select
                  id="checkin-barrier"
                  value={barrier}
                  onChange={(event) => setBarrier(event.target.value)}
                >
                  <option value="">Choose an option (optional)</option>
                  <option value="not_enough_time">Not enough time</option>
                  <option value="low_energy">Low energy</option>
                  <option value="forgot">Forgot</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}

            <label htmlFor="checkin-note">Optional note</label>
            <textarea
              id="checkin-note"
              rows="3"
              maxLength="300"
              placeholder="How did today go?"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />

            <button
              type="submit"
              disabled={checkInSaving || !selectedHabit}
            >
              {checkInSaving ? "Saving..." : "Save daily check-in"}
            </button>
          </form>
        )}

        {checkInMessage && (
          <p className="success-message">{checkInMessage}</p>
        )}
      </section>

      <section>
        <h2>Your progress</h2>
        <p>Every check-in is a chance to learn and begin again.</p>

        {loading ? (
          <p>Loading your progress...</p>
        ) : (
          <>
            <div className="progress-grid">
              <article className="progress-card">
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </article>

              <article className="progress-card">
                <span>Partially completed</span>
                <strong>{partialCount}</strong>
              </article>

              <article className="progress-card">
                <span>Missed</span>
                <strong>{missedCount}</strong>
              </article>
            </div>

            <div className="completion-summary">
              <div className="completion-label">
                <span>Fully completed</span>
                <strong>{completionPercentage}%</strong>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-label="Fully completed check-ins"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <p>
                {completedCount} of {totalCheckIns} check-ins fully completed.
              </p>
            </div>

            <h3>Check-in history</h3>

            {checkIns.length === 0 ? (
              <p>
                Your check-ins will appear here when you record them.
              </p>
            ) : (
              <div className="history-list">
                {checkIns.map((item) => (
                  <article className="history-card" key={item.id}>
                    <div className="history-header">
                      <strong>{getHabitTitle(item.goal_id)}</strong>

                      <span className={`status status-${item.status}`}>
                        {formatStatus(item.status)}
                      </span>
                    </div>

                    {item.note && <p>{item.note}</p>}

                    {item.barrier && (
                      <p className="history-detail">
                        Barrier: {formatStatus(item.barrier)}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section>
        <h2>Your habits, your pace</h2>

        {loading && <p>Loading your habits...</p>}

        {!loading && habits.length === 0 && (
          <p>No habits yet. Your first small step starts here!</p>
        )}

        {!loading &&
          habits.map((habit) => (
            <article className="habit-card" key={habit.id}>
              <div className="habit-card-header">
                <span className="habit-category">{habit.category}</span>
                <span className="habit-icon" aria-hidden="true">
                  🌱
                </span>
              </div>

              <h3>{habit.title}</h3>

              <p className="habit-target">
                Daily target: {habit.daily_target} minutes
              </p>
            </article>
          ))}
      </section>
    </main>
  );
}

export default App;
