import { useState, useEffect } from "react";
import API from "../../api";

export default function ManageParticipants() {
  const [participants, setParticipants] = useState([]);
  const [editing, setEditing] = useState(null);

  // 🔍 Search & Filters
  const [search, setSearch] = useState("");
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [filterCollege, setFilterCollege] = useState("");

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await API.get("/participants");
      setParticipants(res.data);
    } catch {
      alert("Participants fetch failed 😵");
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (p) => {
    setEditing({
      ...p,
      paymentStatus: p.paymentStatus?.toLowerCase() || "pending",
      accommodationStatus: p.accommodationStatus?.toLowerCase() || "pending",
      events: p.events || [],
    });
  };

  const handleChange = (e) => {
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/participants/${editing._id}`, {
        paymentStatus: editing.paymentStatus,
        accommodationStatus: editing.accommodationStatus,
      });
      alert("Participant updated ✅");
      setEditing(null);
      fetchParticipants();
    } catch {
      alert("Update failed ❌");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete participant?")) return;
    try {
      await API.delete(`/participants/${id}`);
      setParticipants((prev) => prev.filter((p) => p._id !== id));
      alert("Deleted 🗑️");
    } catch {
      alert("Delete failed ❌");
    }
  };

  // ---------------- FILTER LOGIC ----------------
  const filteredParticipants = participants.filter((p) => {
    const searchMatch =
      p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.mobileNumber?.includes(search) ||
      p.institution?.toLowerCase().includes(search.toLowerCase());

    const accommodationMatch = filterAccommodation
      ? p.accommodationStatus === filterAccommodation
      : true;

    const eventMatch = filterEvent
      ? p.events?.some((e) => e.name === filterEvent)
      : true;

    const collegeMatch = filterCollege ? p.institution === filterCollege : true;

    return searchMatch && accommodationMatch && eventMatch && collegeMatch;
  });

  const uniqueEvents = [
    ...new Set(
      participants.flatMap((p) => (p.events ? p.events.map((e) => e.name) : []))
    ),
  ];

  const uniqueColleges = [...new Set(participants.map((p) => p.institution))];

  // ---------------- JSX ----------------
  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-3">🎓 Participants List</h2>

      {/* 🔍 SEARCH & FILTERS */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="🔍 Search name / email / phone / college"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={filterAccommodation}
            onChange={(e) => setFilterAccommodation(e.target.value)}
          >
            <option value="">All Accommodation</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
          >
            <option value="">All Events</option>
            {uniqueEvents.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filterCollege}
            onChange={(e) => setFilterCollege(e.target.value)}
          >
            <option value="">All Colleges</option>
            {uniqueColleges.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
              <th>Events</th>
              <th>Accommodation</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredParticipants.map((p) => (
              <tr key={p._id}>
                <td>{p.fullName}</td>
                <td>{p.email}</td>
                <td>{p.mobileNumber}</td>
                <td>{p.institution}</td>
                <td>
                  {p.events?.length
                    ? p.events.map((e) => e.name).join(", ")
                    : "—"}
                </td>
                <td>{p.accommodationStatus}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => handleEdit(p)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {editing && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit –{" "}
                  <span className="text-primary">{editing.fullName}</span>
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setEditing(null)}
                ></button>
              </div>

              <div className="modal-body">
                <form className="row g-3" onSubmit={handleUpdate}>
                  <div className="col-md-6">
                    <label className="fw-semibold">Name</label>
                    <div className="form-control bg-light">
                      {editing.fullName}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="fw-semibold">Email</label>
                    <div className="form-control bg-light">{editing.email}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="fw-semibold">Payment Status</label>
                    <select
                      name="paymentStatus"
                      value={editing.paymentStatus}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="fw-semibold">Accommodation Status</label>
                    <select
                      name="accommodationStatus"
                      value={editing.accommodationStatus}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="fw-semibold">Registered Events</label>
                    {editing.events.length ? (
                      <ul className="list-group">
                        {editing.events.map((ev) => (
                          <li key={ev._id} className="list-group-item">
                            {ev.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">No events</div>
                    )}
                  </div>

                  <div className="text-center mt-3">
                    <button className="btn btn-success px-4">💾 Save</button>
                    <button
                      type="button"
                      className="btn btn-secondary ms-3"
                      onClick={() => setEditing(null)}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ============== MODAL END ============== */}
    </div>
  );
}
