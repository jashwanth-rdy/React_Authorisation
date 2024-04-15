import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import PersistLogin from "./components/PersistLogin";
import NotFound from "./components/NotFound";

import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Uhome from "./pages/Uhome";
import Home from "./pages/Home";

const ROLE = {
  Instructor: 0,
  User1: 1,
};
function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* User Routes */}
        <Route element={<PersistLogin usertype={"user"} />}>
          <Route element={<RequireAuth allowedRole={ROLE.User1} />}>
            <Route path="/user" element={<Uhome />} />
          </Route>
        </Route>

        {/* Not Found Routes */}
        <Route path="*" element={<NotFound />}></Route>
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
