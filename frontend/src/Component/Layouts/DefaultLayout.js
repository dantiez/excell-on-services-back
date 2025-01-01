import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
} from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header";
import { NavbarSimpleColored } from "./Nav";

const DefaultLayout = () => {
  return (
    <>
      <AppShell
        padding={25}
        header={{ height: { base: 48, sm: 60, lg: 76 } }}
        navbar={{ width: 250 }}
      >
        <AppShellHeader>
          <Header />
        </AppShellHeader>
        <AppShellNavbar>
          <NavbarSimpleColored />
        </AppShellNavbar>
        <AppShellMain>
          <Outlet />
        </AppShellMain>
      </AppShell>
    </>
  );
};

export default DefaultLayout;
