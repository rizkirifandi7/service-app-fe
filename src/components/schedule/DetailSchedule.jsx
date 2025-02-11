/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ArrowLeft } from "lucide-react";

const DetailItem = ({ title, content }) => (
	<div>
		<h2 className="text-sm font-semibold mb-1.5">{title}</h2>
		<p className="border p-3 rounded-md text-sm">{content}</p>
	</div>
);

const DetailSchedule = () => {
	const { id } = useParams();
	const [schedule, setSchedule] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/schedule/${id}`
			);
			setSchedule(response.data.data);
		};

		fetchData();
	}, [id]);

	return (
		<div className="">
			<Link
				to="/schedule"
				className="border p-2 rounded-md shadow-sm text-sm gap-2 inline-flex items-center mb-4 hover:bg-slate-100"
			>
				<ArrowLeft className="inline-block" size={16} /> Kembali
			</Link>

			<Card className="rounded-md">
				<CardHeader>
					<CardTitle className="text-xl font-bold">Detail Schedule</CardTitle>
					<CardDescription>Detail schedule untuk ID: {id}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col space-y-4">
						<DetailItem title="PIC" content={schedule.pic} />
						<DetailItem title="Line" content={schedule.line} />
						<DetailItem title="Mesin" content={schedule.mesin} />
						<DetailItem title="Kerusakan" content={schedule.kerusakan} />
						<DetailItem title="Maintenance" content={schedule.maintenance} />
						<DetailItem
							title="Tanggal"
							content={
								schedule.tanggal
									? new Intl.DateTimeFormat("id-ID", {
											weekday: "long",
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
									  }).format(new Date(schedule.tanggal))
									: "Tanggal tidak tersedia"
							}
						/>
						<DetailItem title="Status" content={schedule.status} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DetailSchedule;
