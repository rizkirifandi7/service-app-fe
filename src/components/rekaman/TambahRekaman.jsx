/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addData, getAllData } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

import Cookies from "js-cookie";
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
	nama: z.string().nonempty("Nama harus diisi."),
	line: z.string().nonempty("Line harus diisi."),
	mesin: z.string().nonempty("Mesin harus diisi."),
	deskripsi_kerusakan: z.string().nonempty("Deskripsi harus diisi."),
	gambar: z.any(),
	tindakan: z.string().nonempty("Tindakan harus diisi."),
	analisa: z.string().nonempty("Analisa harus diisi."),
	waktu_mulai_mesin: z.any(),
	waktu_selesai_mesin: z.any(),
});

const TambahRekaman = ({ fetchData }) => {
	const [openTambah, setOpenTambah] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [dataUser, setDataUser] = useState([]);
	const token = Cookies.get("auth_session");

	const fetchDataUser = async () => {
		const response = await getAllData("user");
		if (response) {
			setDataUser(response.data);
		}
	};

	React.useEffect(() => {
		fetchDataUser();
	}, []);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			nama: "",
			line: "",
			mesin: "",
			deskripsi_kerusakan: "",
			gambar: "",
			tindakan: "",
			analisa: "",
			waktu_mulai_mesin: "",
			waktu_selesai_mesin: "",
		},
	});

	const handleTambah = async (data) => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("nama", data.nama);
			formData.append("line", data.line);
			formData.append("mesin", data.mesin);
			formData.append("deskripsi_kerusakan", data.deskripsi_kerusakan);
			formData.append("gambar", data.gambar[0]);
			formData.append("tindakan", data.tindakan);
			formData.append("analisa", data.analisa);
			formData.append("waktu_mulai_mesin", data.waktu_mulai_mesin);
			formData.append("waktu_selesai_mesin", data.waktu_selesai_mesin);

			const response = await addData("laporan", formData, token);

			if (response.status === "success") {
				toast.success("Laporan berhasil ditambahkan");
				form.reset();
				setOpenTambah(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error adding laporan:", error);
			toast.error("Gagal menambahkan laporan");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={openTambah} onOpenChange={setOpenTambah}>
			<DialogTrigger asChild>
				<Button className="bg-blue-500">
					<PlusCircle />
					Tambah Laporan
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[725px]">
				<DialogHeader>
					<DialogTitle>Tambah Laporan</DialogTitle>
					<DialogDescription>Tambahkan laporan baru.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleTambah)}>
						<div className="flex items-start gap-6">
							<div className="w-full space-y-3">
								<FormField
									control={form.control}
									name="nama"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nama</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih nama" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{dataUser.map((user) => (
														<SelectItem key={user.id} value={user.nama}>
															{user.nama}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="line"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Line</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih line" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Injection">Injection</SelectItem>
													<SelectItem value="Vacuum Forming">
														Vacuum Forming
													</SelectItem>
													<SelectItem value="PCM">PCM</SelectItem>
													<SelectItem value="Urethane Door">
														Urethane Door
													</SelectItem>
													<SelectItem value="Urethane Cabinet">
														Urethane Cabinet
													</SelectItem>
													<SelectItem value="Docking">Docking</SelectItem>
													<SelectItem value="Gas Charge">Gas Charge</SelectItem>
													<SelectItem value="Vacuum Pump">
														Vacuum Pump
													</SelectItem>
													<SelectItem value="Running Test">
														Running Test
													</SelectItem>
													<SelectItem value="Final">Final</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex items-center justify-between w-full gap-4">
									<div className="w-full space-y-2">
										<Label>Start Trouble</Label>
										<Input
											type="time"
											{...form.register("waktu_mulai_mesin")}
										/>
									</div>
									<span className="pt-7">-</span>
									<div className="w-full space-y-2">
										<Label>Stop Trouble</Label>
										<Input
											type="time"
											{...form.register("waktu_selesai_mesin")}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Gambar</Label>
									<Input
										type="file"
										className="shadow-none h-full py-1.5"
										onChange={(e) => form.setValue("gambar", e.target.files)}
									/>
								</div>
							</div>
							<div className="w-full space-y-3">
								<FormField
									control={form.control}
									name="mesin"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mesin</FormLabel>
											<FormControl>
												<Input
													className="shadow-none"
													placeholder="masukkan mesin..."
													{...field}
													type="text"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="deskripsi_kerusakan"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Deskripsi Kerusakan</FormLabel>
											<FormControl>
												<Textarea
													className="shadow-none resize-none"
													placeholder="masukkan deskripsi kerusakan..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="tindakan"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tindakan</FormLabel>
											<FormControl>
												<Textarea
													className="shadow-none resize-none"
													placeholder="masukkan tindakan..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="analisa"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Analisa</FormLabel>
											<FormControl>
												<Textarea
													className="shadow-none resize-none"
													placeholder="masukkan analisa..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full mt-4 bg-blue-500"
							disabled={isLoading}
						>
							{isLoading ? "Sedang menambahkan..." : "Simpan"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default TambahRekaman;
