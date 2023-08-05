import { Container, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const tabs = ["profile", "categories", "account"];

const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("profile");

  useEffect(() => {
    const tab = location.pathname.split("/").at(-1) ?? "";
    if (tabs.includes(tab)) {
      setSelectedTab(tab);
    } else {
      navigate("profile");
    }
  }, [location.pathname, navigate]);

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
