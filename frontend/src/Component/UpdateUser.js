import { Button, Flex, Paper, PasswordInput, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { Fragment } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getUserData } from "./AuthStore";
import UserService from "./Service/UserService";
export const UpdateCurrentUser = (id) => {
  const userData = getUserData();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });
  const getUser = async (id) => {
    const user = await UserService.getUserById(id.id);
    if (!user) {
      toast.error("No User");
      return;
    }
    reset({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return;
  };
  const onSubmit = async (data) => {
    const rs = await UserService.updateCurrentUser(id.id, {
      ...data,
      isAdmin: userData.active,
    });
    if (!rs) {
      toast.error("Edit Failed");
      return;
    }
    modals.closeAll();
    toast.success("Edit Success");
  };
  useEffect(() => {
    getUser(id);
  }, []);
  return (
    <>
      <Paper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction={"column"} gap={16}>
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
            <Button fullWidth type="submit">
              Confirm
            </Button>
          </Flex>
        </form>
      </Paper>
    </>
  );
};
