import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RootLayout from "./layouts/RootLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserProvider } from "./contexts/UserContext";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Question from "./pages/Question";
import SettingsLayout from "./layouts/SettingsLayout";
import ProfileSettings from "./pages/settings/Profile";
import CategoriesSettings from "./pages/settings/Categories";
import AccountSettings from "./pages/settings/Account";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="me/inbox" element={<Inbox />} />

        <Route path="me/settings" element={<SettingsLayout />}>
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="categories" element={<CategoriesSettings />} />
          <Route path="account" element={<AccountSettings />} />
        </Route>

        <Route path="q/:id" element={<Question />} />
        <Route path=":username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
