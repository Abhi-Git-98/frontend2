import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token"); // token check
  return isLoggedIn ? children : <Navigate to="/login" />;
}
