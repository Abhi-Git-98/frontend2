import { useState, useEffect } from "react";
import API from "../../api";

export default function ManageEvents() {
  const [form, setForm] = useState({ name: "", description: "", date:"", time:"", venue:"" });
  const [imageFile, setImageFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);

  // 🧩 Fetch all events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      console.log("Events fetched:", res.data);
      setEvents(res.data);
      // If no selected event, pick first
      if (!selectedEventId && res.data.length > 0) setSelectedEventId(res.data[0]._id);
    } catch (err) {
      console.error("FetchEvents error:", err.response || err);
    }
  };

  // 🧩 Fetch participants for selected event
  const fetchParticipants = async (eventId) => {
    try {
      const res = await API.get(`/events/${eventId}/participants`);
      const data = Array.isArray(res.data) ? res.data : res.data.participants || [];
      setParticipants(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setParticipants([]);
    }
  };

  useEffect(() => {
    if (selectedEventId) fetchParticipants(selectedEventId);
  }, [selectedEventId]);

  // 🧩 Form change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🧩 Submit event form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await API.put(`/events/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setForm({ name: "", description: "", date:"", time:"", venue:"" });
      setImageFile(null);
      setEditingId(null);
      await fetchEvents();
    } catch (err) {
      console.error("Error adding/updating event:", err);
      alert("❌ Error adding/updating event");
    }
  };

  // 🧩 Delete event
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await API.delete(`/events/${id}`);
        alert("🗑️ Event deleted!");
        fetchEvents();
      } catch {
        alert("Delete failed");
      }
    }
  };

  // 🧩 Edit event
  const handleEdit = (event) => {
    setForm({
      name: event.name || "",
      description: event.description || "",
      date: event.date ? event.date.split("T")[0] : "",
      time: event.time || "",
      venue: event.venue || "",
    });
    setEditingId(event._id);
    setImageFile(null);
  };

  return (
    <div className="container my-4">
      <h2 className="text-2xl font-bold mb-4">Manage Events & Participants</h2>

      {/* ✏️ Add/Edit Event Form */}
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center gap-3 mb-5">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" className="col-md-6 p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Event Description" className="col-md-6 p-4 border rounded" />
        <input type="date" name="date" value={form.date} onChange={handleChange} className="col-md-6 p-2 border rounded" required />
        <input type="time" name="time" value={form.time} onChange={handleChange} className="col-md-6 p-2 border rounded" />
        <input type="text" name="venue" value={form.venue} onChange={handleChange} placeholder="Venue" className="col-md-6 p-2 border rounded" required />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="form-control col-md-2" />
        {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="img-thumbnail mt-2" style={{ width: "150px", height: "200px", objectFit: "cover" }} />}
        <button type="submit" className={`px-4 py-2 rounded text-white ${editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}>
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </form>

      {/* 📋 Events List */}
      <div className="row mb-4">
        {events.map((ev) => (
          <div key={ev._id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
            <div className={`card h-100 text-center ${selectedEventId === ev._id ? "border-primary border-2" : ""}`}>
              {ev.image && <img src={`https://genvision-26.onrender.com/${ev.image.replace(/^\/+/, "")}`} alt={ev.name} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} />}
              <div className="card-body p-2">
                <h6 className="card-title">{ev.name}</h6>
                <div className="d-flex justify-content-center gap-2">
                  <button onClick={() => handleEdit(ev)} className="btn btn-sm btn-warning">✏️</button>
                  <button onClick={() => handleDelete(ev._id)} className="btn btn-sm btn-danger">🗑️</button>
                </div>
                <button onClick={() => setSelectedEventId(ev._id)} className="btn btn-sm btn-info">Participants</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📋 Participants Table */}
      {selectedEventId && (
        <div className="mt-4">
          <h4 className="mb-3">Participants for Selected Event</h4>
          {participants.length === 0 ? (
            <div className="text-muted">No participants registered yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Payment</th>
                    <th>Accommodation</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => (
                    <tr key={p._id}>
                      <td>{idx + 1}</td>
                      <td>{p.fullName}</td>
                      <td>{p.email}</td>
                      <td>{p.mobileNumber || "-"}</td>
                      <td>{p.institution || "-"}</td>
                      <td>{p.paymentStatus || "pending"}</td>
                      <td>{p.accommodationStatus || "pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
