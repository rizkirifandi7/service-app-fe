import { Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";
import User from "./user/User";
import ScheduleApp from "./schedule/ScheduleApp";
import UnduhLaporan from "@/components/unduh-laporan/UnduhLaporan";
import DetailSchedule from "@/components/schedule/DetailSchedule";
import DetailRekaman from "@/components/rekaman/DetailRekaman";

const Login = lazy(() => import("./auth/Login"));
const Home = lazy(() => import("./home/Home"));
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
						<Route path="/laporan" element={<Rekaman />} />
						<Route path="/laporan/:id" element={<DetailRekaman />} />
						<Route path="/schedule" element={<ScheduleApp />} />
						<Route path="/schedule/:id" element={<DetailSchedule />} />
						<Route path="/unduh" element={<UnduhLaporan />} />
						<Route path="/user" element={<User />} />
					</Route>
				</Route>
				<Route path="/login" element={<Login />} />
			</Routes>
		</Suspense>
	);
};

export default MainLayout;
