import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../Service/AuthService";
import { Controller, useForm } from "react-hook-form";
import { PasswordInput, TextInput } from "@mantine/core";
import { Fragment } from "react";
import { toast, Toaster } from "sonner";
import { getActions, useAccessToken, useActions } from "../AuthStore";
export const Login = () => {
    const { handleSubmit, control } = useForm();
    const navigate = useNavigate();
    const token = useAccessToken()
    const { setAccessToken, setRefreshToken } = getActions()
    const onSubmit = async (data) => {
        const { data: loginData } = await AuthService.login({ email: data.email, password: data.password });

        if (!!loginData.error) {
            toast.error(`Login Failed ${loginData.error}`);
            return;
        }

        setAccessToken(loginData.accessToken);
        setRefreshToken(loginData.refreshToken);
        toast.success("Login Success")
        navigate("/Home");
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
                    <h2 className="mb-3 text-primary">Login</h2>
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
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </form>
                    {/* TO add ' appostopee */}
                    <p className="container my-2">Don&apos;t have an account?</p>
                    <Link to="/register" className="btn btn-secondary">
                        Register
                    </Link>
                </div>
            </div >
        </div >
    );
};

