import HapusSchedule from "@/components/schedule/HapusSchedule";
import TambahSchedule from "@/components/schedule/TambahSchedule";
import UpdateSchedule from "@/components/schedule/UpdateSchedule";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { parseISO, getDay } from "date-fns";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ScheduleApp = () => {
	const [schedule, setSchedule] = useState([]);

	const fetchData = async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/schedule`
		);
		setSchedule(response.data.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

	const getDayName = (dateString) => {
		const date = parseISO(dateString);
		const dayIndex = getDay(date);
		return days[(dayIndex + 6) % 7];
	};

	const groupedSchedule = days.reduce((acc, day) => {
		acc[day] = [];
		return acc;
	}, {});

	schedule.forEach((item) => {
		const dayName = getDayName(item.tanggal);
		if (groupedSchedule[dayName]) {
			groupedSchedule[dayName].push(item);
		}
	});

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Dashboard Schedule</h1>
				<TambahSchedule fetchData={fetchData} />
			</div>

			<div className="">
				<div className="grid grid-cols-5 gap-2">
					{days.map((day, index) => (
						<h1
							className="border mb-2 rounded-md py-1.5 text-lg font-semibold text-center"
							key={index}
						>
							{day}
						</h1>
					))}
				</div>

				<div className="grid grid-cols-5 gap-2">
					{days.map((day) => (
						<div
							key={day}
							className="border rounded-md border-gray-300 p-2 h-fit"
						>
							{groupedSchedule[day] && (
								<div className="space-y-2 text-sm">
									{groupedSchedule[day]
										.filter((item) => item.status !== "Completed")
										.map((item) => (
											<div key={item.id} className="p-2 bg-blue-50 rounded-md">
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
													{new Intl.DateTimeFormat("id-ID", {
														weekday: "long",
														year: "numeric",
														month: "2-digit",
														day: "2-digit",
													}).format(new Date(item.tanggal))}
												</p>
												<p>
													<strong>Status:</strong> {item.status}
												</p>
												<div className="flex items-center gap-1 mt-2">
													<UpdateSchedule id={item.id} fetchData={fetchData} />
													<HapusSchedule id={item.id} fetchData={fetchData} />
													<Link
														to={`/schedule/${item.id}`}
														className="text-blue-500"
													>
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
										))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ScheduleApp;
