/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { addDataSchedule, getAllData } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
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

const FormSchema = z.object({
	pic: z.string().nonempty("Pic harus diisi."),
	line: z.string().nonempty("Line harus diisi."),
	mesin: z.string().nonempty("Mesin harus diisi."),
	kerusakan: z.string().nonempty("Kerusakan harus diisi."),
	maintenance: z.string().nonempty("Maintenance harus diisi."),
	tanggal: z.any(),
	status: z.any(),
});

const TambahSchedule = ({ fetchData }) => {
	const [openTambah, setOpenTambah] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [dataUser, setDataUser] = useState([]);

	const fetchDataUser = async () => {
		const response = await getAllData("user");
		if (response) {
			setDataUser(response.data);
		}
	};

	useEffect(() => {
		fetchDataUser();
	}, []);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pic: "",
			line: "",
			mesin: "",
			kerusakan: "",
			maintenance: "",
			tanggal: "",
			status: "",
		},
	});

	const handleTambah = async (data) => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("pic", data.pic);
			formData.append("line", data.line);
			formData.append("mesin", data.mesin);
			formData.append("kerusakan", data.kerusakan);
			formData.append("maintenance", data.maintenance);
			formData.append("tanggal", data.tanggal);
			formData.append("status", data.status);

			const response = await addDataSchedule("schedule", data);

			if (response.status === "success") {
				toast.success("Schedule berhasil ditambahkan");
				form.reset();
				setOpenTambah(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error adding schedule:", error);
			toast.error("Gagal menambahkan schedule");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={openTambah} onOpenChange={setOpenTambah}>
			<DialogTrigger asChild>
				<Button className="bg-blue-500">
					<PlusCircle />
					Tambah Schedule
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tambah Schedule</DialogTitle>
					<DialogDescription>Tambahkan schedule baru.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleTambah)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="pic"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Pic</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Pilih pic" />
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
											<SelectItem value="Clocking">Clocking</SelectItem>
											<SelectItem value="Vacuum Pump">Vacuum Pump</SelectItem>
											<SelectItem value="Running Test">Running Test</SelectItem>
											<SelectItem value="Final">Final</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
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
							name="kerusakan"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Kerusakan</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan kerusakan..."
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
							name="maintenance"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Maintenance</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan maintenance..."
											{...field}
											type="text"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="w-fit space-y-2">
							<Label>Tanggal Perbaikan</Label>
							<Input
								type="date"
								className="w-full"
								{...form.register("tanggal")}
							/>
						</div>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Pilih status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Ongoing">Ongoing</SelectItem>
											<SelectItem value="Completed">Completed</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="submit"
								className="w-full mt-2 bg-blue-500"
								disabled={isLoading}
							>
								{isLoading ? "Sedang menambahkan..." : "Simpan"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default TambahSchedule;
