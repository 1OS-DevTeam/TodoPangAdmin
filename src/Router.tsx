import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "src/layouts/MainLayout";
import ROUTES from "src/common/Routes";

import Dashboard from "src/pages/Dashboard";
import Users from "src/pages/Users";
import Categories from "src/pages/Categories";
import Challenges from "src/pages/Challenges";
import Login from "./pages/Login";
import RequireAuth from "src/components/RequireAuth";

const Router = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path={ROUTES.MAIN.PATH} element={<Dashboard />} />
          <Route path={ROUTES.USERS.PATH} element={<Users />} />
          <Route path={ROUTES.CATEGORIES.PATH} element={<Categories />} />
          <Route path={ROUTES.CHALLENGES.PATH} element={<Challenges />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
