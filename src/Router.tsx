import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "src/layouts/MainLayout";
import ROUTES from "src/common/Routes";

import Dashboard from "src/pages/Dashboard";
import Users from "src/pages/Users";
import Categories from "src/pages/Categories";
import Challenges from "src/pages/Challenges";
import Login from "./pages/Login";

const Router = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route path={ROUTES.MAIN.PATH} element={<Dashboard />} />
          <Route path={ROUTES.USERS.PATH} element={<Users />} />
          <Route path={ROUTES.CATEGORIES.PATH} element={<Categories />} />
          <Route path={ROUTES.CHALLENGES.PATH} element={<Challenges />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
