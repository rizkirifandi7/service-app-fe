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

const DetailRekaman = () => {
	const { id } = useParams();
	const [rekaman, setRekaman] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/laporan/${id}`
			);
			setRekaman(response.data.data);
		};

		fetchData();
	}, [id]);

	return (
		<div className="">
			<Link
				to="/laporan"
				className="border p-2 rounded-md shadow-sm text-sm gap-2 inline-flex items-center mb-4 hover:bg-slate-100"
			>
				<ArrowLeft className="inline-block" size={16} /> Kembali
			</Link>

			<Card className="rounded-md">
				<CardHeader>
					<CardTitle className="text-xl font-bold">Detail Rekaman</CardTitle>
					<CardDescription>Detail rekaman untuk ID: {id}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col space-y-4">
						<DetailItem title="PIC" content={rekaman.nama} />
						<DetailItem title="Line" content={rekaman.line} />
						<DetailItem title="Mesin" content={rekaman.mesin} />
						<DetailItem title="Kerusakan" content={rekaman.deskripsi_kerusakan} />
						<DetailItem title="Tindakan" content={rekaman.tindakan} />
						<DetailItem title="Analisa" content={rekaman.analisa} />
						<DetailItem
							title="Waktu Mulai Mesin"
							content={rekaman.waktu_mulai_mesin}
						/>
						<DetailItem
							title="Waktu Selesai Mesin"
							content={rekaman.waktu_selesai_mesin}
						/>
						<div>
							<h2 className="text-sm font-semibold mb-1.5">Gambar</h2>
							{rekaman.gambar && (
								<img
									src={rekaman.gambar}
									alt="Gambar"
									className="w-20 h-20 object-cover rounded-md"
								/>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DetailRekaman;
