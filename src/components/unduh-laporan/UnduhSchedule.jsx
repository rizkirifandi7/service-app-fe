import { Button } from "@/components/ui/button";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

// Form schema
const FormSchema = z.object({
	startDate: z.date({
		required_error: "Start date is required.",
	}),
	endDate: z.date({
		required_error: "End date is required.",
	}),
});

const UnduhSchedule = () => {
	const [dataSchedule, setDataSchedule] = useState([]);
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
			const responseSchedule = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/schedule`
			);
			setDataSchedule(responseSchedule.data.data);
		};

		fetchData();
	}, []);

	const filterDataByDate = (startDate, endDate) => {
		const filteredData = dataSchedule.filter((item) => {
			const rekamanDate = new Date(item.tanggal);
			return (
				(!startDate || rekamanDate >= new Date(startDate)) &&
				(!endDate || rekamanDate <= new Date(endDate))
			);
		});

		const aggregatedData = [];

		filteredData.forEach((item) => {
			aggregatedData.push({
				pic: item.pic,
				line: item.line,
				mesin: item.mesin,
				kerusakan: item.kerusakan,
				maintenance: item.maintenance,
				tanggal: item.tanggal,
				status: item.status,
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
			"PIC",
			"Line",
			"Mesin",
			"Kerusakan",
			"Maintenance",
			"Tanggal",
			"Status",
		];

		const formattedData = extractedData.map((item) => ({
			PIC: item.pic,
			Line: item.line,
			Mesin: item.mesin,
			Kerusakan: item.kerusakan,
			Maintenance: item.maintenance,
			Tanggal: new Intl.DateTimeFormat("id-ID", {
				weekday: "long",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}).format(new Date(item.tanggal)),
			Status: item.status,
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
		XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Schedule");

		// Save file
		XLSX.writeFile(workbook, "laporan-schedule.xlsx");
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
				<CardTitle>Unduh Laporan Schedule</CardTitle>
				<CardDescription>
					Unduh laporan schedule berdasarkan tanggal.
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
							{isLoading ? "Processing..." : "Unduh Laporan Schedule"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default UnduhSchedule;
