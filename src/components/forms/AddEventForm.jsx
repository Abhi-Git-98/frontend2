import { useState, useEffect } from "react";
import API from "../../api";

export default function ManageEvents() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: "",
    rules: [], // 🔥 RULES
  });

  const [imageFile, setImageFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data || []);
      if (!selectedEventId && res.data.length > 0) {
        setSelectedEventId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH PARTICIPANTS ================= */
  useEffect(() => {
    if (selectedEventId) fetchParticipants(selectedEventId);
  }, [selectedEventId]);

  const fetchParticipants = async (eventId) => {
    try {
      const res = await API.get(`/events/${eventId}/participants`);
      setParticipants(res.data || []);
    } catch {
      setParticipants([]);
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE EVENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "rules") {
        form.rules.forEach((r) => formData.append("rules[]", r));
      } else {
        formData.append(key, form[key]);
      }
    });

    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await API.put(`/events/${editingId}`, formData);
      } else {
        await API.post("/events", formData);
      }

      setForm({
        name: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        maxParticipants: "",
        rules: [],
      });

      setImageFile(null);
      setEditingId(null);
      fetchEvents();
    } catch {
      alert("❌ Event save failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await API.delete(`/events/${id}`);
    fetchEvents();
  };

  /* ================= EDIT ================= */
  const handleEdit = (event) => {
    setForm({
      name: event.name || "",
      description: event.description || "",
      date: event.date ? event.date.split("T")[0] : "",
      time: event.time || "",
      venue: event.venue || "",
      maxParticipants: event.maxParticipants || "",
      rules: event.rules || [],
    });
    setEditingId(event._id);
    setImageFile(null);
  };

  /* ================= UI ================= */
  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">Manage Events</h2>

      {/* ================= EVENT FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center gap-3 mb-5"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Event Name"
          className="col-md-6 p-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Event Description"
          className="col-md-6 p-2 border rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="col-md-6 p-2 border rounded"
          required
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="col-md-6 p-2 border rounded"
        />

        <input
          type="text"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Venue"
          className="col-md-6 p-2 border rounded"
        />

        <input
          type="number"
          name="maxParticipants"
          value={form.maxParticipants}
          onChange={handleChange}
          placeholder="Max Participants"
          className="col-md-6 p-2 border rounded"
          required
        />

        {/* ================= RULES ================= */}
        <div className="col-md-6 w-100">
          <h6 className="fw-bold">Event Rules</h6>

          {form.rules.map((rule, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                placeholder={`Rule ${i + 1}`}
                value={rule}
                onChange={(e) => {
                  const updated = [...form.rules];
                  updated[i] = e.target.value;
                  setForm({ ...form, rules: updated });
                }}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  setForm({
                    ...form,
                    rules: form.rules.filter((_, idx) => idx !== i),
                  })
                }
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setForm({ ...form, rules: [...form.rules, ""] })}
          >
            ➕ Add Rule
          </button>
        </div>

        <button
          type="submit"
          className={`btn ${editingId ? "btn-warning" : "btn-primary"}`}
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </form>

      {/* ================= EVENTS GRID ================= */}
      <div className="row">
        {events.map((ev) => (
          <div key={ev._id} className="col-md-3 mb-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <h6>{ev.name}</h6>
                <p className="small">
                  👥 {ev.currentParticipants || 0}/{ev.maxParticipants}
                </p>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(ev)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(ev._id)}
                  >
                    🗑️
                  </button>
                </div>

                <button
                  className="btn btn-info btn-sm mt-2"
                  onClick={() => setSelectedEventId(ev._id)}
                >
                  Participants
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PARTICIPANTS ================= */}
      {participants.length > 0 && (
        <table className="table table-striped mt-4">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.fullName}</td>
                <td>{p.email}</td>
                <td>{p.institution || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
