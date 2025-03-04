import axios from "axios";
import { parseISO, format, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { id } from "date-fns/locale";

const ScheduleHome = () => {
	const [schedule, setSchedule] = useState([]);
	const today = new Date(); // Get current date

	const fetchData = async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/schedule`
		);
		setSchedule(response.data.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	// Filter schedule for today's date only
	const todaySchedule = schedule.filter((item) =>
		isSameDay(parseISO(item.tanggal), today)
	);

	return (
		<div className="border p-4 rounded-md bg-white max-w-3xl">
			<h1 className="text-2xl font-bold">Schedule</h1>
			<h2 className="text-lg mt-2">
				{format(today, "EEEE, dd MMMM yyyy", { locale: id })}
			</h2>

			<div className="mt-4 w-full">
				<div className="space-y-2">
					{todaySchedule
						.filter((item) => item.status !== "Completed")
						.map((item) => (
							<div key={item.id} className="p-4 border rounded-md text-sm">
								<p>
									<strong>PIC:</strong> {item.pic}
								</p>
								<p>
									<strong>Line:</strong> {item.line}
								</p>
								<p className="truncate w-1/2">
									<strong>Mesin:</strong> {item.mesin}
								</p>
								<p className="truncate w-1/2">
									<strong>Kerusakan:</strong> {item.kerusakan}
								</p>
								<p className="truncate w-1/2">
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
							</div>
						))}
					{todaySchedule.length === 0 && (
						<div className="text-center p-4 bg-gray-50 rounded-md">
							Tidak ada jadwal untuk hari ini
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ScheduleHome;
