import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Token: {token}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;