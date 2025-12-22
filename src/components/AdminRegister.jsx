import { useState } from "react";
import API from "../api";

export default function AdminRegister() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 IITB email restriction
    
    if (!form.email.endsWith("@iitb.ac.in")) {
      alert("❌ only iitb email allowed!");
      return;
    }

    try {
      await API.post("/admin/register", form);
      alert("✅ Admin registered successfully!");
    } catch (err) {
      alert("❌ Error registering admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Register Admin</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
      >
        <input
          type="email"
          name="email"
          placeholder="IITB Email (@iitb.ac.in)"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-gray-700"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
}
