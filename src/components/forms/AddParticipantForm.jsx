import { useState, useEffect } from "react";
import API from "../../api";

export default function ManageParticipants() {
  const [participants, setParticipants] = useState([]);
  const [editing, setEditing] = useState(null);

  // -----------------------------------------------
  // Fetch Participants (WITH populated events)
  // -----------------------------------------------
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await API.get("/participants");
      setParticipants(res.data);
    } catch (err) {
      alert("Failed to fetch participants");
    }
  };

  // -----------------------------------------------
  // Open Edit Form
  // -----------------------------------------------
  const handleEdit = (p) => {
    setEditing({
      ...p,
      paymentStatus: p.paymentStatus?.toLowerCase() || "pending",
      accommodationStatus: p.accommodationStatus?.toLowerCase() || "pending",
      // 🔥 IMPORTANT: events AS OBJECTS, NOT IDs
      events: p.events || [],
    });
  };

  // -----------------------------------------------
  // Update Editable Fields
  // -----------------------------------------------
  const handleChange = (e) => {
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  // -----------------------------------------------
  // Save Updated Participant
  // -----------------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        paymentStatus: editing.paymentStatus,
        accommodationStatus: editing.accommodationStatus,
      };

      await API.put(`/participants/${editing._id}`, payload);

      alert("Participant updated successfully ✅");
      await fetchParticipants();
      setEditing(null);
    } catch (err) {
      alert("Error updating participant ❌");
    }
  };

  // -----------------------------------------------
  // Delete Participant
  // -----------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this participant?")) return;

    try {
      await API.delete(`/participants/${id}`);
      setParticipants((prev) => prev.filter((p) => p._id !== id));
      alert("Deleted successfully 🗑️");
    } catch {
      alert("Delete failed");
    }
  };

  // -----------------------------------------------
  // JSX
  // -----------------------------------------------
  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-3">🎓 Participants List</h2>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
              <th>Event(s)</th>
              <th>Payment</th>
              <th>Accommodation Required</th>
              <th>Accommodation Status</th>
              <th>Mumbaikar</th>
              <th>Reg ID</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {participants.map((p) => (
              <tr key={p._id}>
                <td>{p.fullName}</td>
                <td>{p.email}</td>
                <td>{p.mobileNumber}</td>
                <td>{p.institution}</td>

                {/* EVENTS DISPLAY */}
                <td>
                  {p.events && p.events.length > 0
                    ? p.events.map((ev) => ev.name).join(", ")
                    : "—"}
                </td>

                <td>{p.paymentStatus}</td>
                <td>{p.accommodationRequired}</td>
                <td>{p.accommodationStatus}</td>
                <td>{p.isMumbaikar}</td>
                <td>{p.registration_id}</td>

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

      {/* EDIT FORM */}
      {editing && (
        <div className="p-4 mt-4 border rounded bg-light shadow-sm">
          <h4 className="mb-3">
            Edit Participant:{" "}
            <span className="text-primary">{editing.fullName}</span>
          </h4>

          <form className="row g-3" onSubmit={handleUpdate}>
            {/* NAME */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <div className="form-control bg-light">
                {editing.fullName}
              </div>
            </div>

            {/* EMAIL */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <div className="form-control bg-light">
                {editing.email}
              </div>
            </div>

            {/* PAYMENT */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Payment Status</label>
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

            {/* ACCOMMODATION */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Accommodation Status
              </label>
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

            {/* EVENTS – VIEW ONLY */}
            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Registered Events
              </label>

              {editing.events && editing.events.length > 0 ? (
                <ul className="list-group">
                  {editing.events.map((ev) => (
                    <li key={ev._id} className="list-group-item">
                      {ev.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted">
                  No events registered
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-success px-4 fw-semibold"
              >
                💾 Save Changes
              </button>

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
      )}
    </div>
  );
}
