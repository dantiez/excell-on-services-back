import { Flex, Paper, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { getAccessTokenData, getUserData } from "../AuthStore";

export const PrivateRoute = ({ isAdmin = false, children }) => {
  const tokenData = getUserData();
  const navigate = useNavigate();
  if (!tokenData) return <Navigate to={"/login"} replace />;

  if (isAdmin != tokenData.active) {
    modals.openConfirmModal({
      title: "Permisions Denied",
      children: <>You do not have Permision for this page</>,
      onConfirm: () => {
        navigate("/", { replace: true });
      },
      labels: { confirm: "Go back" },
    });
    return (
      <Flex justify={"center"} align={"center"}>
        <Paper shadow={"md"}>
          <Text>Permision Denied</Text>
          <Button onClick={() => navigate("/", { replace: true })}>
            {" "}
            Go Back Home
          </Button>
        </Paper>
      </Flex>
    );
  }
  return <>{children}</>;
};
