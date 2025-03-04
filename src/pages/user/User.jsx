import React from "react";
import DataTable from "../../components/DataTable";
import { getAllData } from "@/lib/api";
import UpdateUser from "@/components/user/UpdateUser";
import HapusUser from "@/components/user/HapusUser";
import TambahUser from "@/components/user/TambahUser";

const User = () => {
	const [data, setData] = React.useState([]);

	const columns = [
		{
			accessorKey: "nama",
			header: "Nama",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("nama")}</div>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue("email")}</div>
			),
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("role") === "pegawai" ? "karyawan" : "admin"}</div>
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
						<UpdateUser fetchData={fetchData} id={id} rowData={rowData} />
						<HapusUser id={id} fetchData={fetchData} />
					</div>
				);
			},
		},
	];

	const fetchData = async () => {
		try {
			const response = await getAllData("user");
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
				TambahComponent={() => <TambahUser fetchData={fetchData} />}
				title="Dashboard User"
				search="nama"
			/>
		</div>
	);
};

export default User;
