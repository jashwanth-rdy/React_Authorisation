import React from "react";
import { TextField, Button, Stack } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/user";

  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const handleError = (err) =>
    toast.error(err, {
      position: "top-right",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
    });

  const onSubmit = async (fdata) => {
    console.log(fdata);
    try {
      const { data } = await axios.post(
        "/user/login",
        {
          ...fdata,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        const { accessToken, role, user } = data;
        // handleSuccess(message);
        setAuth({ user, role, accessToken });
        reset();
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          margin: "30px 400px 0px 400px",
          border: "1px solid",
          borderColor: "rgba(0,0,0,.17)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "50px 30px 40px 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <b>Login</b>
          </div>
          <br />
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} width={250}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button variant="contained" type="submit">
                Login
              </Button>
            </Stack>
          </form>
          <div className="mt-2">
            Don't have an account?
            <Link to="/user/signup">
              <Button variant="text">Signup</Button>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
