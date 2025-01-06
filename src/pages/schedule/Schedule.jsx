import React from "react";
import DataTable from "../../components/DataTable";
import { getAllData } from "@/lib/api";
import TambahSchedule from "@/components/schedule/TambahSchedule";
import HapusSchedule from "@/components/schedule/HapusSchedule";
import UpdateSchedule from "@/components/schedule/UpdateSchedule";
import Cookies from "js-cookie";

const Schedule = () => {
	const [data, setData] = React.useState([]);

	const columns = [
		{
			accessorKey: "pic",
			header: "PIC",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("pic")}</div>
			),
		},
		{
			accessorKey: "mesin",
			header: "Mesin",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("mesin")}</div>
			),
		},
		{
			accessorKey: "tanggal_perbaikan",
			header: "Tanggal Perbaikan",
			cell: ({ row }) => (
				<div className="capitalize">
					{new Date(row.getValue("tanggal_perbaikan")).toLocaleDateString(
						"id-ID",
						{
							weekday: "long",
							year: "2-digit",
							month: "2-digit",
							day: "2-digit",
						}
					)}
				</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const id = row.original.id;
				const rowData = row.original;
				return (
					<div className="flex items-center gap-2">
						<UpdateSchedule fetchData={fetchData} id={id} rowData={rowData} />
						<HapusSchedule id={id} fetchData={fetchData} />
					</div>
				);
			},
		},
	];

	const user = JSON.parse(atob(Cookies.get("auth_session").split(".")[1]));

	const fetchData = async () => {
		try {
			const response =
				user.role === "admin"
					? await getAllData("schedule")
					: await getAllData("schedule/user");
			const data = response.data;
			setData(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	React.useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<DataTable
				columns={columns}
				data={data}
				TambahComponent={() => <TambahSchedule fetchData={fetchData} />}
				title="Dashboard Schedule"
				search="pic"
			/>
		</div>
	);
};

export default Schedule;
