import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async (usertype) => {
    setAuth({});
    try {
      const response = await axios.post(`/${usertype}/logout`);
    } catch (err) {
      console.error(err);
    }
    return response.data;
  };

  return logout;
};

export default useLogout;
