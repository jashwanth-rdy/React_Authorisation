import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { ToastContainer, toast } from "react-toastify";

function Uhome() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const usertype = auth?.role === 1 ? "user" : "stud";
  const signOut = async () => {
    const { message } = await logout(usertype);
    if (message) {
      handleSuccess(message);
      navigate(`/${usertype}/login`);
    }
  };
  return (
    <div>
      Uhome
      <div>
        <button className="btn btn-dark bttn" onClick={signOut}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Uhome;
