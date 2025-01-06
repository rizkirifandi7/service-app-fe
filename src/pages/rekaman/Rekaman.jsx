import { useState, useEffect, useMemo, useCallback } from "react";
import DataTable from "../../components/DataTable";
import HapusRekaman from "@/components/rekaman/HapusRekaman";
import TambahRekaman from "@/components/rekaman/TambahRekaman";
import { getAllData } from "@/lib/api";
import UpdateRekaman from "@/components/rekaman/UpdateRekaman";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";

const Rekaman = () => {
	const [data, setData] = useState([]);

	const columns = useMemo(
		() => [
			{
				accessorKey: "nama",
				header: "Nama",
				cell: ({ row }) => (
					<div className="capitalize">{row.getValue("nama")}</div>
				),
			},
			{
				accessorKey: "line",
				header: "Line",
				cell: ({ row }) => (
					<div className="capitalize">{row.getValue("line")}</div>
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
				accessorKey: "deskripsi_kerusakan",
				header: "Kerusakan",
				cell: ({ row }) => (
					<div className="capitalize">
						{row.getValue("deskripsi_kerusakan")}
					</div>
				),
			},
			{
				accessorKey: "tindakan",
				header: "Tindakan",
				cell: ({ row }) => (
					<div className="capitalize">{row.getValue("tindakan")}</div>
				),
			},
			{
				accessorKey: "analisa",
				header: "Analisa",
				cell: ({ row }) => (
					<div className="capitalize">{row.getValue("analisa")}</div>
				),
			},
			{
				accessorKey: "gambar",
				header: "Gambar",
				cell: ({ row }) => {
					const fileName = row.getValue("gambar");
					const fileUrl = fileName;

					return (
						<div className="lowercase">
							{fileName ? (
								<Dialog>
									<DialogTrigger>
										<img
											src={fileUrl}
											alt={fileName}
											className="w-20 h-20 object-cover rounded-md"
										/>
									</DialogTrigger>
									<DialogContent>
										<DialogTitle>Detail Gambar</DialogTitle>
										<div className="">
											<img
												src={fileUrl}
												alt={fileName}
												className="w-full h-full object-cover rounded-md"
											/>
										</div>
									</DialogContent>
								</Dialog>
							) : (
								<a
									href={fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline"
								>
									{fileName}
								</a>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: "waktu_mulai_mesin",
				header: "Waktu Mulai",
				cell: ({ row }) => (
					<div className="capitalize">
						{new Date(row.getValue("waktu_mulai_mesin")).toLocaleDateString(
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
				accessorKey: "waktu_selesai_mesin",
				header: "Waktu Selesai",
				cell: ({ row }) => (
					<div className="capitalize">
						{new Date(row.getValue("waktu_selesai_mesin")).toLocaleDateString(
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
							<UpdateRekaman fetchData={fetchData} id={id} rowData={rowData} />
							<HapusRekaman id={id} fetchData={fetchData} />
						</div>
					);
				},
			},
		],
		[]
	);

	const user = JSON.parse(atob(Cookies.get("auth_session").split(".")[1]));

	const fetchData = useCallback(async () => {
		try {
			const response =
				user.role === "admin"
					? await getAllData("laporan")
					: await getAllData(`laporan/user/${user.id}`);

			const data = response.data;
			setData(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [user.role, user.id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			<DataTable
				columns={columns}
				data={data}
				TambahComponent={() => <TambahRekaman fetchData={fetchData} />}
				title="Dashboard Rekaman"
				search="nama"
				pageSize={5}
			/>
		</>
	);
};

export default Rekaman;
