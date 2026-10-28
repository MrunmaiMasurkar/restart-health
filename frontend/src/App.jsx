
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("movement");
  const [dailyTarget, setDailyTarget] = useState("10");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/goals`);

      if (!response.ok) {
        throw new Error("Could not load your habits.");
      }

      const data = await response.json();
      setHabits(data);
    } catch {
      setError("Unable to connect to the backend. Please try again.");
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

      setHabits((currentHabits) => [...currentHabits, newHabit]);
      setTitle("");
      setCategory("movement");
      setDailyTarget("10");
    } catch (error) {
      setError(error.message || "Could not create the habit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <header>
        <h1>ReStart 🌱</h1>
        <p>Small steps. Healthier habits.</p>
      </header>

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
        <h2>Your habits, your pace</h2>
        <p>Every small step counts. You can always begin again.</p>

        {error && <p role="alert">{error}</p>}

        {loading && <p>Loading your habits...</p>}

        {!loading && !error && habits.length === 0 && (
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
