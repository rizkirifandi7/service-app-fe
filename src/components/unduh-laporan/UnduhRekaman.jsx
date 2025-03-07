import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDate } from "@/lib/formatDate";

// Form schema
const FormSchema = z.object({
	startDate: z.date({
		required_error: "Start date is required.",
	}),
	endDate: z.date({
		required_error: "End date is required.",
	}),
});

const UnduhRekaman = () => {
	const [dataRekaman, setDataRekaman] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			startDate: undefined,
			endDate: undefined,
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			const responseRekaman = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/laporan`
			);
			setDataRekaman(responseRekaman.data.data);
		};

		fetchData();
	}, []);

	const filterDataByDate = (startDate, endDate) => {
		// Create normalized date objects (set to midnight)
		const normalizeDate = (date) => {
			const newDate = new Date(date);
			newDate.setHours(0, 0, 0, 0);
			return newDate;
		};

		const startDateNormalized = startDate ? normalizeDate(startDate) : null;
		const endDateNormalized = endDate ? normalizeDate(endDate) : null;

		// Add a day to end date to include the full end date
		if (endDateNormalized) {
			const nextDay = new Date(endDateNormalized);
			nextDay.setDate(nextDay.getDate() + 1);
			endDateNormalized.setTime(nextDay.getTime());
		}

		const filteredData = dataRekaman.filter((item) => {
			const rekamanDate = normalizeDate(item.tanggal);
			return (
				(!startDateNormalized || rekamanDate >= startDateNormalized) &&
				(!endDateNormalized || rekamanDate < endDateNormalized)
			);
		});

		const aggregatedData = [];

		filteredData.forEach((item) => {
			aggregatedData.push({
				nama: item.nama,
				line: item.line,
				mesin: item.mesin,
				deskripsi_kerusakan: item.deskripsi_kerusakan,
				tindakan: item.tindakan,
				gambar: item.gambar,
				analisa: item.analisa,
				tanggal: item.tanggal,
				start_trouble: item.start_trouble,
				stop_trouble: item.stop_trouble,
			});
		});

		return aggregatedData;
	};

	const exportJsonToExcel = (startDate, endDate) => {
		const extractedData = filterDataByDate(startDate, endDate);

		if (extractedData.length === 0) {
			toast.error("Tidak ada data untuk tanggal yang dipilih.");
			return;
		}

		const excelHeader = [
			"Nama",
			"Line",
			"Mesin",
			"Deskripsi Kerusakan",
			"Tindakan",
			"Gambar",
			"Analisa",
			"Tanggal",
			"Start Trouble",
			"Stop Trouble",
		];

		const formattedData = extractedData.map((item) => ({
			Nama: item.nama,
			Line: item.line,
			Mesin: item.mesin,
			"Deskripsi Kerusakan": item.deskripsi_kerusakan,
			Tindakan: item.tindakan,
			Gambar: item.gambar,
			Analisa: item.analisa,
			Tanggal: formatDate(item.tanggal),
			"Start Trouble": item.start_trouble,
			"Stop Trouble": item.stop_trouble,
		}));

		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(formattedData);

		// Add header
		XLSX.utils.sheet_add_aoa(worksheet, [excelHeader], { origin: "A1" });

		// Set column widths
		worksheet["!cols"] = excelHeader.map((header) => ({
			wch: header.length + 10,
		}));

		// Append worksheet to workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Rekaman");

		// Save file
		XLSX.writeFile(workbook, "laporan-rekaman.xlsx");
	};

	const onSubmit = async (formData) => {
		setIsLoading(true);
		try {
			const { startDate, endDate } = formData;

			if (startDate > endDate) {
				toast.error("Start date cannot be after end date.");
				return;
			}

			exportJsonToExcel(startDate, endDate);
		} catch (error) {
			toast.error("Error exporting data to Excel. Please try again.");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Unduh Laporan Rekaman</CardTitle>
				<CardDescription>
					Unduh laporan rekaman berdasarkan tanggal.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Start Date */}
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Tanggal Awal</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="w-full pl-3 text-left font-normal py-5"
												>
													{field.value
														? format(field.value, "P")
														: "Pilih tanggal awal"}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => date > new Date()}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Tanggal Akhir</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="w-full pl-3 text-left font-normal py-5"
												>
													{field.value
														? format(field.value, "P")
														: "Pilih tanggal akhir"}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => date > new Date()}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full py-5 bg-blue-500"
						>
							{isLoading ? "Processing..." : "Unduh Laporan Rekaman"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default UnduhRekaman;
