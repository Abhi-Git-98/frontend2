import { useEffect, useState } from "react";
import API from "../api"; // axios instance
import "../css/leaderboard.css";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/leaderboard");
      setData(res.data.leaderboard);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // 🔁 every 5 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <h2 className="loading">Loading leaderboard...</h2>;

  return (
    <div className="leaderboard-container">
      <h1>🏆 Live Leaderboard</h1>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Path No</th>
            <th>Locations</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.path_no} className={index < 3 ? "top" : ""}>
              <td>{index + 1}</td>
              <td>{item.path_no}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
