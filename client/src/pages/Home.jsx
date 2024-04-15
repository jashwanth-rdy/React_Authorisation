import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      Home
      <Link to="/user/signup">Signup</Link>
      <Link to="/user/login">login</Link>
    </div>
  );
}

export default Home;
