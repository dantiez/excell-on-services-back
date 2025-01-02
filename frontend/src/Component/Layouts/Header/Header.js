import {
  Avatar,
  Flex,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconLogout,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  getAccessTokenData,
  getActions,
  getUserData,
} from "../../AuthStore";
import { AuthService } from "../../Service/AuthService";
import classes from "./Header.module.css";
import { UpdateCurrentUser } from "../../UpdateUser";
import { modals } from "@mantine/modals";
export function Header() {
  const navigate = useNavigate();
  const userData = getUserData();
  const token = getAccessToken();
  const tokenData = getAccessTokenData();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { clearTokens } = getActions();
  const handleLogout = async () => {
    await AuthService.logout(token, tokenData.nameid);
    clearTokens();
    navigate("/login", { replace: true });
  };

  const handleEditUser = () => {
    modals.open({
      title: "Edit User",
      children: (
        <>
          <UpdateCurrentUser id={userData.id} />
        </>
      ),
    });
  };

  return (
    <Flex direction="row" align={"self-start"}>
      <Menu
        width={260}
        position="bottom"
        transitionProps={{ transition: "pop-top-right" }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={clsx(classes.user, {
              [classes.userActive]: userMenuOpened,
            })}
          >
            <Group gap={7}>
              <Avatar />
              <Text fw={500} size="sm" lh={1} mr={3}>
                {`${userData?.firstName} ${userData?.lastName}`}
              </Text>
              <IconChevronDown size={12} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color="black"
            leftSection={<IconSettingsFilled size={16} stroke={1.5} />}
            onClick={() => {
              handleEditUser();
            }}
          >
            Edit Acount
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
}
