import { Checkbox, Flex, Paper, PasswordInput, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthService } from "../Service/AuthService";

export const CreateUserForm = () => {
  const { handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    const { data: registerData } = await AuthService.signup({
      ...data,
      isAdmin: data.isAdmin === "" ? false : true,
    });

    if (registerData.errors) {
      Object.values(registerData.errors).forEach((error) => {
        toast.error(`${error[0]}`);
      });
      return;
    } else {
      modals.closeAll();
      toast.success("Sign Up Success");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap={16}>
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
                  <Checkbox {...field} label="Is Admin?" />
                </Fragment>
              );
            }}
          />

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </Flex>
      </form>
    </>
  );
};
