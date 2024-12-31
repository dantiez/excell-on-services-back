import { useEffect, useState } from "react";
import { IconChevronDown, IconLogout, IconSettings } from "@tabler/icons-react";
import cx from "clsx";
import {
    Avatar,
    Burger,
    Container,
    Group,
    Menu,
    Tabs,
    Text,
    UnstyledButton,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getAccessTokenData, getActions } from "../../AuthStore";
import UserService from "../../Service/UserService";
import { toast } from "sonner";
import { AuthService } from "../../Service/AuthService";
import { async } from "q";

const tabs = [
    {
        label: "Home",
        link: "/Home",
    },
    {
        label: "Profile",
        link: `/Profile/${8}`,
    },
    {
        label: "Services",
        link: "#",
    },
    {
        label: "Transaction",
        link: `/Transaction/${8}`,
    },
    {
        label: "About Us",
        link: "/AboutUs",
    },
    {
        label: "Contact",
        link: "/Contact",
    },
];
export function Header() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const [user, setUser] = useState()
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const token = getAccessToken()
    const tokenData = getAccessTokenData();
    const { clearTokens } = getActions()
    const getUser = async (userId) => {
        const user = await UserService.getUserById(userId)
        if (!user) {
            toast.error("No User")
            return;
        }
        setUser(user);
        return;
    }

    const handleLogout = async () => {
        await AuthService.logout(token, user.nameid)
        navigate("/login");
    }

    useEffect(() => {
        getUser(tokenData?.nameid)
    }, [tokenData])

    const items = tabs.map((tab) => (
        <Tabs.Tab
            value={tab.link}
            key={tab.label}
            onClick={() => navigate(tab.link)}
        >
            {tab.label}
        </Tabs.Tab>
    ));

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} size="md">
                <Group justify="space-between">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

                    <Menu
                        width={260}
                        position="bottom-end"
                        transitionProps={{ transition: "pop-top-right" }}
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                        withinPortal
                    >
                        <Menu.Target>
                            <UnstyledButton
                                className={cx(classes.user, {
                                    [classes.userActive]: userMenuOpened,
                                })}
                            >
                                <Group gap={7}>
                                    <Text fw={500} size="sm" lh={1} mr={3}>
                                        {`${user?.firstName} ${user?.lastName}`}
                                    </Text>
                                    <IconChevronDown size={12} stroke={1.5} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Settings</Menu.Label>
                            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                                Account Information
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                leftSection={<IconLogout size={16} stroke={1.5} />}
                                onClick={() => { handleLogout() }}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Container>
            <Container size="md">
                <Tabs
                    defaultValue="Home"
                    variant="outline"
                    visibleFrom="sm"
                    classNames={{
                        root: classes.tabs,
                        list: classes.tabsList,
                        tab: classes.tab,
                    }}
                >
                    <Tabs.List>{items}</Tabs.List>
                </Tabs>
            </Container>
        </div>
    );
}
