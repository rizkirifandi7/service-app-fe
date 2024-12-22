import { Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";

const Login = lazy(() => import("./auth/Login"));
const Home = lazy(() => import("./home/Home"));
const Schedule = lazy(() => import("./schedule/Schedule"));
const Rekaman = lazy(() => import("./rekaman/Rekaman"));

const MainLayout = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Sidebar>
                <Outlet />
              </Sidebar>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/rekaman" element={<Rekaman />} />
            <Route path="/schedule" element={<Schedule />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default MainLayout