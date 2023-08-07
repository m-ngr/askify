import { Container, Tab, Tabs } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const tabs = ["profile", "categories", "account"];

const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("profile");
  const { user, userLoading } = useContext(UserContext);

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate("/login");
    const tab = location.pathname.split("/").at(-1) ?? "";
    if (tabs.includes(tab)) {
      setSelectedTab(tab);
    } else {
      navigate("profile");
    }
  }, [location.pathname, navigate, user, userLoading]);

  return (
    <>
      <Tabs centered value={selectedTab} sx={{ pb: 2 }}>
        <Tab label="Profile" value="profile" component={Link} to="profile" />
        <Tab
          label="Categories"
          value="categories"
          component={Link}
          to="categories"
        />
        <Tab label="Account" value="account" component={Link} to="account" />
      </Tabs>
      <Container component="main" maxWidth="xs">
        <Outlet />
      </Container>
    </>
  );
};

export default SettingsLayout;
