import { getAllData } from "@/lib/api";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

const HomeCard = () => {
	const [dataLaporan, setDataLaporan] = useState([]);
	const [dataSchedule, setDataSchedule] = useState([]);

	const fetchData = async () => {
		try {
			const [responseLaporan, responseSchedule] = await Promise.all([
				getAllData("laporan"),
				getAllData("schedule"),
			]);

			setDataLaporan(responseLaporan.data);
			setDataSchedule(responseSchedule.data);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card className="p-6 rounded-md shadow-none">
				<p className="text-muted-foreground">Total Laporan</p>
				<h1 className="text-2xl font-bold">{dataLaporan.length}</h1>
			</Card>
			<Card className="p-6 rounded-md shadow-none">
				<p className="text-muted-foreground">Total Schedule</p>
				<h1 className="text-2xl font-bold">{dataSchedule.length}</h1>
			</Card>
		</div>
	);
};

export default HomeCard;
