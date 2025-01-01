import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../Service/AuthService";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, PasswordInput, TextInput } from "@mantine/core";
import { Fragment } from "react";
import { toast } from "sonner";

const Register = (isLogin) => {
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    const { data: registerData } = await AuthService.signup({
      ...data,
      isAdmin: data.isAdmin === "" ? false : true,
    });
    console.log(registerData);
    if (registerData.errors) {
      Object.values(registerData.errors).forEach((error) => {
        toast.error(`${error[0]}`);
      });
      navigate("/register");
      return;
    } else if (registerData.error) {
      toast.error(registerData.error);
      return;
    } else {
      toast.success("Sign Up Success");
    }

    navigate("/login");
  };
  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100"
        style={{
          backgroundImage:
            "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
        }}
      >
        <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
          <h2 className="mb-3 text-primary">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              defaultValue={""}
              control={control}
              rules={{ required: "Email must not be blank" }}
              render={({ field, fieldState }) => {
                return (
                  <TextInput
                    {...field}
                    label="Email"
                    placeholder="Input Email"
                    error={fieldState.error?.message}
                  />
                );
              }}
            />
            <Controller
              name="firstName"
              defaultValue={""}
              control={control}
              rules={{ required: "First Name must not be blank" }}
              render={({ field, fieldState }) => {
                return (
                  <Fragment>
                    <TextInput
                      {...field}
                      label="Your First Name"
                      placeholder="Input First Name"
                      id="your-firstname"
                      error={fieldState.error?.message}
                    />
                  </Fragment>
                );
              }}
            />
            <Controller
              name="lastName"
              defaultValue={""}
              control={control}
              rules={{ required: "Last Name must not be blank" }}
              render={({ field, fieldState }) => {
                return (
                  <Fragment>
                    <TextInput
                      {...field}
                      label="Your Last Name"
                      placeholder="Input Last Name"
                      id="your-lastname"
                      error={fieldState.error?.message}
                    />
                  </Fragment>
                );
              }}
            />

            <Controller
              name="password"
              defaultValue={""}
              control={control}
              rules={{ required: "Password must not be blank" }}
              render={({ field, fieldState }) => {
                return (
                  <Fragment>
                    <PasswordInput
                      {...field}
                      label="Your password"
                      placeholder="Input password"
                      id="your-password"
                      error={fieldState.error?.message}
                    />
                  </Fragment>
                );
              }}
            />
            <Controller
              name="confirmPassword"
              defaultValue={""}
              control={control}
              rules={{ required: "Confirm Password must not be blank" }}
              render={({ field, fieldState }) => {
                return (
                  <Fragment>
                    <PasswordInput
                      {...field}
                      label="Confirm Your Password"
                      placeholder="Input password"
                      id="your-cf-password"
                      error={fieldState.error?.message}
                    />
                  </Fragment>
                );
              }}
            />
            <Controller
              name="isAdmin"
              defaultValue={""}
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Fragment>
                    <Checkbox {...field} label="Are you an Admin?" />
                  </Fragment>
                );
              }}
            />

            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>

          <p className="container my-2">Already have an account ?</p>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
