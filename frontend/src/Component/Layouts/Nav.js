import { useState } from "react";
import {
  Icon2fa,
  IconBellRinging,
  IconChevronsRight,
  IconDatabaseImport,
  IconExchange,
  IconFingerprint,
  IconHome,
  IconKey,
  IconLogout,
  IconPhone,
  IconReceipt2,
  IconServicemark,
  IconSettings,
  IconSwitchHorizontal,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import classes from "./Nav.module.css";
import { getAccessToken, getAccessTokenData, getUserData } from "../AuthStore";
import { useNavigate } from "react-router-dom";
import { Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { AuthService } from "../Service/AuthService";
import { useDisclosure } from "@mantine/hooks";
import { clsx } from "clsx";

// const data = [
//   { link: "", label: "Notifications",},
//   { link: "", label: "Billing", icon: IconReceipt2 },
//   { link: "", label: "Security", icon: IconFingerprint },
//   { link: "", label: "SSH Keys", icon: IconKey },
//   { link: "", label: "Databases", icon: IconDatabaseImport },
//   { link: "", label: "Authentication", icon: Icon2fa },
//   { link: "", label: "Other Settings", icon: IconSettings },
// ];
const getNav = (userId, isAdmin) => {
  if (isAdmin) {
    return [
      { label: "Dashboard", link: "Dashboard", icon: IconHome },
      { label: "Manage User", link: "manage-user", icon: IconUsers },
      { label: "Services", link: "Services", icon: IconServicemark },
    ];
  }
  return [
    {
      label: "Home",
      link: "Home",
      icon: IconHome,
    },
    {
      label: "Profile",
      link: `Profile/${userId}`,
      icon: IconUserCog,
    },

    {
      label: "Transaction",
      link: `Transaction/${userId}`,
      icon: IconExchange,
    },
    {
      label: "About Us",
      link: "AboutUs",
      icon: IconUsers,
    },
    {
      label: "Contact",
      link: "Contact",
      icon: IconPhone,
    },
  ];
};

export function NavbarSimpleColored() {
  const [active, setActive] = useState("Billing");
  const navigate = useNavigate();
  const userData = getUserData();
  const token = getAccessToken();
  const tokenData = getAccessTokenData();

  const data = getNav(userData.id, userData.active);

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
    </nav>
  );
}
