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
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { clsx } from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  getAccessTokenData,
  getUserData,
} from "../../AuthStore";
import { AuthService } from "../../Service/AuthService";
import classes from "./Header.module.css";
export function Header() {
  const navigate = useNavigate();
  const userData = getUserData();
  const token = getAccessToken();
  const tokenData = getAccessTokenData();

  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const handleLogout = async () => {
    await AuthService.logout(token, tokenData.nameid);
    navigate("/login");
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
