import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
} from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header";

const DefaultLayout = () => {
  return (
    <>
      <AppShell padding={25} header={{ height: { base: 48, sm: 60, lg: 76 } }}>
        <AppShellHeader>
          <Header />
        </AppShellHeader>
        <AppShellMain>
          <Outlet />
        </AppShellMain>
      </AppShell>
    </>
  );
};

export default DefaultLayout;
