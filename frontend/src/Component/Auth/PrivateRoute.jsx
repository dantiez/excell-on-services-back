import { Navigate } from "react-router-dom";
import { getAccessTokenData } from "../AuthStore";

export const PrivateRoute = ({ isAdmin = false, children }) => {
  const tokenData = getAccessTokenData();
  if (!tokenData) return <Navigate to={"/login"} replace />;

  if (isAdmin && !tokenData?.isAdmin) return <>You dont have permission</>;

  return <>{children}</>;
};
