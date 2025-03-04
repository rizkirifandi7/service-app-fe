/* eslint-disable react/prop-types */
import HapusSchedule from "@/components/schedule/HapusSchedule";
import TambahSchedule from "@/components/schedule/TambahSchedule";
import UpdateSchedule from "@/components/schedule/UpdateSchedule";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { parseISO, getDay, format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, Clock } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Component for displaying schedule item
const ScheduleItem = ({ item, fetchData }) => (
	<div className="p-2 bg-blue-50 rounded-md">
		<div className="flex justify-between items-start mb-1">
			<span className="inline-block px-2 py-0.5 bg-gray-200 text-xs rounded-full font-medium">
				{item.day}
			</span>
			<div className="flex gap-1">
				{item.overtime === "Lembur" && (
					<Badge
						variant="outline"
						className="bg-purple-100 text-purple-800 border-purple-300 text-xs"
					>
						Lembur
					</Badge>
				)}
				<span
					className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
						item.status === "Pending"
							? "bg-yellow-100 text-yellow-800"
							: item.status === "In Progress" || item.status === "Ongoing"
							? "bg-blue-100 text-blue-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{item.status}
				</span>
			</div>
		</div>
		<p>
			<strong>PIC:</strong> {item.pic}
		</p>
		<p>
			<strong>Line:</strong> {item.line}
		</p>
		<p className="truncate">
			<strong>Mesin:</strong> {item.mesin}
		</p>
		<p className="truncate">
			<strong>Kerusakan:</strong> {item.kerusakan}
		</p>
		<p className="truncate">
			<strong>Maintenance:</strong> {item.maintenance}
		</p>
		<p>
			<strong>Tgl Perbaikan:</strong>{" "}
			{format(new Date(item.tanggal), "EEEE, dd/MM/yyyy", { locale: id })}
		</p>
		<div className="flex items-center gap-1 mt-2">
			<UpdateSchedule id={item.id} fetchData={fetchData} />
			<HapusSchedule id={item.id} fetchData={fetchData} />
			<Link to={`/schedule/${item.id}`} className="text-blue-500">
				<Button
					variant="outline"
					size="icon"
					className="shadow-none bg-yellow-500 text-white"
				>
					<Eye />
				</Button>
			</Link>
		</div>
	</div>
);

const ScheduleApp = () => {
	const [schedule, setSchedule] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeFilter, setActiveFilter] = useState("all");
	const [overtimeFilter, setOvertimeFilter] = useState(false);

	const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
	const weekdayDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
	const weekendDays = ["Sabtu", "Minggu"];

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/schedule`
			);
			setSchedule(response.data.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching schedule data:", err);
			setError("Gagal memuat data jadwal");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const getDayName = (dateString) => {
		const date = parseISO(dateString);
		const dayIndex = getDay(date);
		return days[(dayIndex + 6) % 7]; // Adjust for Monday as first day
	};

	// Process active schedules
	const activeSchedules = useMemo(() => {
		if (!schedule.length) return [];

		return schedule
			.filter((item) => item.tanggal && item.status !== "Completed")
			.map((item) => {
				try {
					const dayName = getDayName(item.tanggal);
					return { ...item, day: dayName };
				} catch (err) {
					console.error(`Error processing schedule item: ${err.message}`, item);
					return { ...item, day: "Unknown" };
				}
			})
			.sort((a, b) => {
				// Sort by day order first
				const dayOrderA = days.indexOf(a.day);
				const dayOrderB = days.indexOf(b.day);
				if (dayOrderA !== dayOrderB) return dayOrderA - dayOrderB;

				// Then by date
				return new Date(a.tanggal) - new Date(b.tanggal);
			});
	}, [schedule, days]);

	// Process completed schedules
	const completedSchedules = useMemo(() => {
		if (!schedule.length) return [];

		return schedule
			.filter((item) => item.tanggal && item.status === "Completed")
			.map((item) => {
				try {
					const dayName = getDayName(item.tanggal);
					return { ...item, day: dayName };
				} catch (err) {
					console.error(`Error processing schedule item: ${err.message}`, item);
					return { ...item, day: "Unknown" };
				}
			})
			.sort((a, b) => {
				// Sort by completion date (newest first)
				return new Date(b.tanggal) - new Date(a.tanggal);
			});
	}, [schedule, days]);

	const filteredActiveSchedules = useMemo(() => {
		let filtered = [...activeSchedules];

		// Apply day filter
		if (activeFilter !== "all") {
			filtered = filtered.filter((item) => item.day === activeFilter);
		}

		// Apply overtime filter
		if (overtimeFilter) {
			filtered = filtered.filter((item) => {
				const isWeekend = weekendDays.includes(item.day);
				const isOvertime = item.overtime === "Lembur";
				return isWeekend || isOvertime;
			});
		}

		return filtered;
	}, [activeSchedules, activeFilter, overtimeFilter, weekendDays]);

	if (error) {
		return (
			<div className="p-4 bg-red-100 rounded-md text-red-700">
				<p>{error}</p>
				<Button onClick={fetchData} className="mt-2">
					Coba lagi
				</Button>
			</div>
		);
	}

	return (
		<div>
			<div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Dashboard Schedule</h1>
				<TambahSchedule fetchData={fetchData} />
			</div>

			{loading ? (
				<div className="flex justify-center py-8">
					<p>Loading data...</p>
				</div>
			) : (
				<Tabs defaultValue="active" className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="active">Jadwal Aktif</TabsTrigger>
						<TabsTrigger value="completed">Jadwal Selesai</TabsTrigger>
					</TabsList>

					<TabsContent value="active">
						<Card className="p-4">
							{/* Filter controls */}
							<div className="flex flex-col gap-4 mb-4 sm:flex-row sm:justify-between">
								{/* Day filters */}
								<div className="flex flex-wrap gap-2">
									<Button
										variant={activeFilter === "all" ? "default" : "outline"}
										onClick={() => setActiveFilter("all")}
										className="text-sm"
									>
										Semua Hari
									</Button>
									{weekdayDays.map((day) => (
										<Button
											key={day}
											variant={activeFilter === day ? "default" : "outline"}
											onClick={() => setActiveFilter(day)}
											className="text-sm"
										>
											{day}
										</Button>
									))}
								</div>

								{/* Overtime filter */}
								<Button
									variant={overtimeFilter ? "default" : "outline"}
									onClick={() => setOvertimeFilter(!overtimeFilter)}
									className="text-sm flex items-center gap-2"
								>
									<Clock size={16} />
									<span>Weekend & Lembur</span>
								</Button>
							</div>

							{filteredActiveSchedules.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
									{filteredActiveSchedules.map((item) => (
										<ScheduleItem
											key={item.id}
											item={item}
											fetchData={fetchData}
										/>
									))}
								</div>
							) : (
								<div className="p-8 bg-gray-50 rounded-md text-center text-gray-500">
									Tidak ada jadwal aktif{" "}
									{activeFilter !== "all" ? `untuk hari ${activeFilter}` : ""}
									{overtimeFilter ? " dengan lembur atau weekend" : ""}
								</div>
							)}
						</Card>
					</TabsContent>

					<TabsContent value="completed">
						<Card className="p-4">
							{completedSchedules.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
									{completedSchedules.map((item) => (
										<ScheduleItem
											key={item.id}
											item={item}
											fetchData={fetchData}
										/>
									))}
								</div>
							) : (
								<div className="p-8 bg-gray-50 rounded-md text-center text-gray-500">
									Tidak ada jadwal yang telah selesai
								</div>
							)}
						</Card>
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
};

export default ScheduleApp;
