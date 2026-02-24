import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";

function App() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        return res.json();
      })
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.common.localeCompare(b.common)
        );
        setCountries(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = countries.filter((c) =>
    c.common.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <input
          className="search-bar"
          type="text"
          placeholder="Search for countries"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <main className="main">
        {loading && (
          <div className="status">
            <div className="spinner" />
            <p>Loading countries…</p>
          </div>
        )}

        {error && (
          <div className="status error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="status">
            <p>No countries found for "<strong>{query}</strong>"</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid">
            {filtered.map((country) => (
              <div className="card" key={country.common}>
                <div className="flag-wrapper">
                  <img
                    src={country.png}
                    alt={`Flag of ${country.common}`}
                    className="flag"
                    loading="lazy"
                  />
                </div>
                <p className="country-name">{country.common}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
