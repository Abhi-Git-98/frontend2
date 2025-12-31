import React, { useEffect, useState } from "react";
import API from "../../api";
import CollegeDetailInline from "./CollegeDetailInline";
import "../../css/manageColleges.css";

export default function ManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // outreachStatus filter
  const [filterLocation, setFilterLocation] = useState(""); // location filter

  const fetchColleges = async () => {
    // setLoading(true);
    try {
      const res = await API.get("/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // const syncColleges = async () => {
  //   setLoading(true);
  //   await API.post("/colleges/syncColleges");
  //   await fetchColleges();
  //   setLoading(false);
  // };

  const toggleRow = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // unique locations for filter dropdown
  const locations = [
    ...new Set(colleges.map((c) => c.location).filter(Boolean)),
  ];

  // filter & search
  const filteredColleges = colleges.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      c.collegeName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.bioRelatedDepartment || "").toLowerCase().includes(term);

    const matchesStatus = filterStatus
      ? c.outreachStatus === filterStatus
      : true;
    const matchesLocation = filterLocation
      ? c.location === filterLocation
      : true;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="manage-college-page">
      <div className="top-bar">
        <h2>🏫 Manage Colleges</h2>
        {/* <button className="sync-btn" onClick={syncColleges}>
          {loading ? "Syncing..." : "🔄 Sync Colleges"}
        </button> */}
      </div>

      {/* ---------- SEARCH & FILTERS ---------- */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Name, Email or Bio Dept..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="invited">Invited</option>
          <option value="replied">Replied</option>
          <option value="ignored">Ignored</option>
        </select>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <table className="college-table">
        <thead>
          <tr>
            <th>College</th>
            <th>Email</th>
            <th>Status</th>
            <th>Mail</th>
          </tr>
        </thead>

        <tbody>
          {filteredColleges.map((c) => (
            <React.Fragment key={c._id}>
              <tr className="clickable-row" onClick={() => toggleRow(c._id)}>
                <td>
                  {expandedId === c._id ? "🔽" : "▶️"} {c.collegeName}
                </td>
                <td>{c.email}</td>
                <td>{c.outreachStatus}</td>
                <td>{c.mailSent ? "✅" : "❌"}</td>
              </tr>

              {expandedId === c._id && (
                <tr className="expand-row">
                  <td colSpan="4">
                    <CollegeDetailInline college={c} onUpdate={fetchColleges} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
