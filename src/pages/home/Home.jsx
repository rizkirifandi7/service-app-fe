import ScheduleHome from "@/components/home/ScheduleHome";
import { Card } from "@/components/ui/card";
import { getAllData } from "@/lib/api";
import { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarchartComponent } from "@/components/chart/BarChart";

const Home = () => {
	const [dataLaporan, setDataLaporan] = useState([]);
	const [dataSchedule, setDataSchedule] = useState([]);
	const [filteredDataLaporan, setFilteredDataLaporan] = useState([]);
	const [filteredDataSchedule, setFilteredDataSchedule] = useState([]);
	const [timeFilter, setTimeFilter] = useState("week");

	const fetchData = async () => {
		try {
			const [responseLaporan, responseSchedule] = await Promise.all([
				getAllData("laporan"),
				getAllData("schedule"),
			]);

			setDataLaporan(responseLaporan.data);
			setDataSchedule(responseSchedule.data);

			// Apply default filter (weekly)
			applyFilter("week", responseLaporan.data, responseSchedule.data);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}
	};

	const applyFilter = (
		filter,
		laporanData = dataLaporan,
		scheduleData = dataSchedule
	) => {
		const currentDate = new Date();
		let startDate;
		let endDate;

		switch (filter) {
			case "day":
				startDate = new Date(currentDate);
				startDate.setHours(0, 0, 0, 0);
				break;
			case "yesterday":
				startDate = new Date(currentDate);
				startDate.setDate(currentDate.getDate() - 1);
				startDate.setHours(0, 0, 0, 0);
				endDate = new Date(currentDate);
				endDate.setHours(0, 0, 0, 0);
				break;
			case "week":
				startDate = new Date(currentDate);
				startDate.setDate(currentDate.getDate() - currentDate.getDay());
				startDate.setHours(0, 0, 0, 0);
				break;
			case "month":
				startDate = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					1
				);
				break;
			case "year":
				startDate = new Date(currentDate.getFullYear(), 0, 1);
				break;
			default:
				startDate = new Date(0); // All time
		}

		const filteredLaporan = laporanData.filter((item) => {
			const itemDate = new Date(item.createdAt || item.created_at || item.date);
			if (filter === "yesterday") {
				return itemDate >= startDate && itemDate < endDate;
			}
			return itemDate >= startDate;
		});

		const filteredSchedule = scheduleData.filter((item) => {
			const itemDate = new Date(item.createdAt || item.created_at || item.date);
			if (filter === "yesterday") {
				return itemDate >= startDate && itemDate < endDate;
			}
			return itemDate >= startDate;
		});

		setFilteredDataLaporan(filteredLaporan);
		setFilteredDataSchedule(filteredSchedule);
	};

	const handleFilterChange = (value) => {
		setTimeFilter(value);
		applyFilter(value);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Dashboard Home</h1>
				<Select value={timeFilter} onValueChange={handleFilterChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by time" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="day">Today</SelectItem>
						<SelectItem value="yesterday">Yesterday</SelectItem>
						<SelectItem value="week">This Week</SelectItem>
						<SelectItem value="month">This Month</SelectItem>
						<SelectItem value="year">This Year</SelectItem>
						<SelectItem value="all">All Time</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col gap-4 mt-4">
				<div className="flex items-start gap-4">
					<div className="space-y-8 w-full">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card className="p-6 rounded-md shadow-none">
								<p className="text-muted-foreground">
									{timeFilter === "day" && "Today's Reports"}
									{timeFilter === "yesterday" && "Yesterday's Reports"}
									{timeFilter === "week" && "This Week's Reports"}
									{timeFilter === "month" && "This Month's Reports"}
									{timeFilter === "year" && "This Year's Reports"}
									{timeFilter === "all" && "All Time Reports"}
								</p>
								<h1 className="text-2xl font-bold">
									{filteredDataLaporan.length}
								</h1>
							</Card>
							<Card className="p-6 rounded-md shadow-none">
								<p className="text-muted-foreground">
									{timeFilter === "day" && "Today's Schedules"}
									{timeFilter === "yesterday" && "Yesterday's Schedules"}
									{timeFilter === "week" && "This Week's Schedules"}
									{timeFilter === "month" && "This Month's Schedules"}
									{timeFilter === "year" && "This Year's Schedules"}
									{timeFilter === "all" && "All Time Schedules"}
								</p>
								<h1 className="text-2xl font-bold">
									{filteredDataSchedule.length}
								</h1>
							</Card>
						</div>
						<BarchartComponent
							filteredDataLaporan={filteredDataLaporan}
							timeFilter={timeFilter}
						/>
					</div>
					<div className="w-full">
						<ScheduleHome />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
