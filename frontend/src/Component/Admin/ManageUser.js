import {
  ActionIcon,
  Flex,
  Group,
  Badge,
  Paper,
  Center,
  Text,
  Button,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconEyeCheck, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { getUserData } from "../AuthStore";
import UserService from "../Service/UserService";
import { EditUserForm } from "./EditUserForm";
import Register from "../Auth/Register";
import { CreateUserForm } from "./CreateUserForm";
export const ManageUser = () => {
  const [listUser, setListUser] = useState([]);
  const userData = getUserData();
  const getAllUser = async () => {
    await UserService.getAllUsers().then((rs) => {
      if (rs) {
        const filterUser = rs["$values"];
        setListUser(filterUser);
      }
    });
  };

  const deleteUser = async (id) => {
    const rs = await UserService.deleteUser(id);
    if (!rs) {
      toast.error("Delete Failed");
    }
    toast.success("Delete Success");
    await getAllUser();
  };

  const handleDelete = async (id) => {
    modals.openConfirmModal({
      title: "Delete User",
      children: <Text> Are you sure to delete this user</Text>,
      onConfirm: () => deleteUser(id),
      onCancel: () => {
        toast.info("Canceled Delete User");
      },
      labels: { confirm: "Confirm", cancel: "Cancel" },
    });
  };
  const handleCreateUser = async () => {
    modals.open({
      title: "Create new User",
      children: (
        <>
          <CreateUserForm />
        </>
      ),
      onClose: () => getAllUser(),
    });
  };
  const handleEdit = async (id) => {
    modals.open({
      title: "Edit User",
      children: (
        <>
          <EditUserForm id={id} />
        </>
      ),
      onClose: () => getAllUser(),
    });
  };

  useEffect(() => {
    getAllUser();
  }, []);
  const columns = [
    {
      accessor: "id",
      title: "User ID",
    },
    {
      accessor: "email",
      title: "Email",
    },
    {
      accessor: "firstName",
      title: "First Name",
    },
    {
      accessor: "lastName",
      title: "Last Name",
    },
    {
      accessor: "active",
      title: "Role",
      render: (record) => {
        return record.active ? (
          <Badge color="blue">Admin</Badge>
        ) : (
          <Badge color="cyan">Client</Badge>
        );
      },
    },
    {
      accessor: "#",
      title: "Actions",
      render: (record) => {
        if (record.active) return <></>;
        return (
          <>
            <Group gap={4} justify="left">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="blue"
                onClick={() => {
                  handleEdit(record.id);
                }}
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="red"
                onClick={() => {
                  handleDelete(record.id);
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Paper shadow="md">
        <Flex direction="column">
          <div>
            <Button
              onClick={() => {
                handleCreateUser();
              }}
            >
              Create User
            </Button>
          </div>
          <DataTable columns={columns} records={listUser} />
        </Flex>
      </Paper>
    </>
  );
};
