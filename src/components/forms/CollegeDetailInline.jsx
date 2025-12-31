import React, { useState, useEffect } from "react";
import API from "../../api";
import "../../css/collegeInline.css";

export default function CollegeDetailInline({ college, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    location: college.location || "",
    bioRelatedDepartment: college.bioRelatedDepartment || "",
    outreachStatus: college.outreachStatus || "pending",
  });
  const [contactNumbers, setContactNumbers] = useState(
    college.contactNumbers || []
  );
  const [reviews, setReviews] = useState(college.reviews || []);
  const [newReview, setNewReview] = useState("");

  /* ---------- Sync props if college changes ---------- */
  useEffect(() => {
    setForm({
      location: college.location || "",
      bioRelatedDepartment: college.bioRelatedDepartment || "",
      outreachStatus: college.outreachStatus || "pending",
    });
    setContactNumbers(college.contactNumbers || []);
    setReviews(college.reviews || []);
  }, [college]);

  /* ---------- INPUT HANDLER ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- CONTACTS ---------- */
  const updateContact = (i, value) => {
    const updated = [...contactNumbers];
    updated[i] = value;
    setContactNumbers(updated);
  };

  const addContact = () => setContactNumbers([...contactNumbers, ""]);
  const removeContact = (i) =>
    setContactNumbers(contactNumbers.filter((_, idx) => idx !== i));

  /* ---------- REVIEWS ---------- */
  const addReview = async () => {
    if (!newReview.trim()) return;

    const tempReview = { _id: Date.now().toString(), text: newReview.trim() };
    setReviews([...reviews, tempReview]);
    setNewReview("");

    try {
      const res = await API.post(`/colleges/${college._id}/reviews`, {
        text: tempReview.text,
      });
      setReviews(res.data.reviews);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Failed to add review:", err);
      alert("Failed to add review");
      setReviews(reviews); // rollback
    }
  };

  const deleteReview = async (reviewId) => {
    const updated = reviews.filter((r) => r._id !== reviewId);
    setReviews(updated);

    try {
      const res = await API.delete(
        `/colleges/${college._id}/reviews/${reviewId}`
      );
      setReviews(res.data.reviews);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review");
      setReviews(reviews); // rollback
    }
  };

  /* ---------- SAVE INLINE CHANGES ---------- */
  const saveChanges = async () => {
    try {
      const payload = { ...form, contactNumbers };
      await API.put(`/colleges/${college._id}`, payload);
      if (onUpdate) onUpdate();
      setEdit(false);
      alert("✅ College updated successfully!");
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save changes");
    }
  };

  return (
    <div className="college-inline-card">
      {/* HEADER */}
      <div className="inline-header">
        <h3>{college.collegeName}</h3>
        <button className="edit-btn" onClick={() => setEdit(!edit)}>
          {edit ? "❌ Cancel" : "✏️ Edit"}
        </button>
      </div>

      {/* LOCATION */}
      <div className="inline-row">
        <label>📍 Location</label>
        {edit ? (
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        ) : (
          <span>{college.location || "N/A"}</span>
        )}
      </div>

      {/* BIO DEPT */}
      <div className="inline-row">
        <label>🧬 Bio Dept</label>
        {edit ? (
          <input
            name="bioRelatedDepartment"
            value={form.bioRelatedDepartment}
            onChange={handleChange}
          />
        ) : (
          <span>{college.bioRelatedDepartment || "N/A"}</span>
        )}
      </div>

      {/* EMAIL */}
      <div className="inline-row">
        <label>📧 Email</label>
        <span>{college.email}</span>
      </div>

      {/* OUTREACH */}
      <div className="inline-row">
        <label>📊 Outreach</label>
        {edit ? (
          <select
            name="outreachStatus"
            value={form.outreachStatus}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
            <option value="replied">Replied</option>
            <option value="ignored">Ignored</option>
          </select>
        ) : (
          <span>{college.outreachStatus}</span>
        )}
      </div>

      {/* CONTACTS */}
      <div className="section">
        <label>📞 Contacts</label>
        {contactNumbers.map((num, i) => (
          <div key={i} className="contact-row">
            {edit ? (
              <>
                <input
                  value={num}
                  onChange={(e) => updateContact(i, e.target.value)}
                />
                <button onClick={() => removeContact(i)}>🗑</button>
              </>
            ) : (
              <span>{num}</span>
            )}
          </div>
        ))}
        {edit && (
          <button className="add-btn" onClick={addContact}>
            ➕ Add Contact
          </button>
        )}
      </div>

      {/* REVIEWS */}
      <div className="section">
        <label>📝 Reviews / Notes</label>
        {reviews.map((r) => (
          <div key={r._id} className="review-row">
            <span>• {r.text}</span>
            {edit && <button onClick={() => deleteReview(r._id)}>🗑</button>}
          </div>
        ))}
        {edit && (
          <div className="review-add">
            <input
              placeholder="Add new review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <button onClick={addReview}>➕</button>
          </div>
        )}
      </div>

      {/* SAVE */}
      {edit && (
        <button className="save-btn" onClick={saveChanges}>
          💾 Save Changes
        </button>
      )}
    </div>
  );
}
