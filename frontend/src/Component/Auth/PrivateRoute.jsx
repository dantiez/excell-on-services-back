import { Navigate } from "react-router-dom";
import { getAccessTokenData, getUserData } from "../AuthStore";

export const PrivateRoute = ({ isAdmin = false, children }) => {
  const tokenData = getUserData();
  if (!tokenData) return <Navigate to={"/login"} replace />;
  console.log(tokenData);
  if (isAdmin && !tokenData?.active) return <>You dont have permission</>;

  return <>{children}</>;
};
