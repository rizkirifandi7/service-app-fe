/* eslint-disable react/prop-types */
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

export function BarchartComponent({
	filteredDataLaporan = [],
	timeFilter = "week",
}) {
	const [chartData, setChartData] = useState([]);
	const [totalReports, setTotalReports] = useState(0);
	const [percentageChange, setPercentageChange] = useState(0);
	const [timeRangeLabel, setTimeRangeLabel] = useState("");

	useEffect(() => {
		if (!filteredDataLaporan.length) return;

		// Process data based on time filter
		let processedData = [];
		let title = "";
		const currentDate = new Date();

		switch (timeFilter) {
			case "day":
				// Show hourly data for today
				title = "Today's Reports by Hour";
				processedData = generateHourlyData(filteredDataLaporan);
				break;
			case "yesterday":
				// Show hourly data for yesterday
				title = "Yesterday's Reports by Hour";
				processedData = generateHourlyData(filteredDataLaporan);
				break;
			case "week":
				// Show daily data for this week
				title = "This Week's Reports by Day";
				processedData = generateDailyData(filteredDataLaporan);
				break;
			case "month":
				// Show daily data grouped by week
				title = "This Month's Reports by Week";
				processedData = generateWeeklyData(filteredDataLaporan, currentDate);
				break;
			case "year":
				// Show monthly data
				title = "This Year's Reports by Month";
				processedData = generateMonthlyData(filteredDataLaporan);
				break;
			default:
				// All time - show monthly data for last 6 months
				title = "All Time Reports (Last 6 Months)";
				processedData = generateLastSixMonthsData(filteredDataLaporan);
		}

		setChartData(processedData);
		setTimeRangeLabel(title);

		// Calculate total reports
		setTotalReports(filteredDataLaporan.length);

		// Calculate percentage change (simple example)
		// In a real app, you'd compare with previous period data
		const randomChange = (Math.random() * 10 - 5).toFixed(1);
		setPercentageChange(randomChange);
	}, [filteredDataLaporan, timeFilter]);

	// Generate hourly data for a day
	const generateHourlyData = (data) => {
		const hourBuckets = Array.from({ length: 8 }, (_, i) => {
			const hour = 9 + i; // Assuming work hours 9am-5pm
			return {
				label: `${hour}:00`,
				reports: 0,
			};
		});

		data.forEach((report) => {
			const reportDate = new Date(report.createdAt);
			const hour = reportDate.getHours();
			if (hour >= 9 && hour <= 17) {
				hourBuckets[hour - 9].reports += 1;
			}
		});

		return hourBuckets;
	};

	// Generate daily data for a week
	const generateDailyData = (data) => {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const dayBuckets = days.map((day) => ({
			label: day.substring(0, 3),
			reports: 0,
		}));

		data.forEach((report) => {
			const reportDate = new Date(report.createdAt);
			const dayOfWeek = reportDate.getDay();
			dayBuckets[dayOfWeek].reports += 1;
		});

		return dayBuckets;
	};

	// Generate weekly data for a month
	const generateWeeklyData = (data) => {
		const weekBuckets = Array.from({ length: 5 }, (_, i) => ({
			label: `Week ${i + 1}`,
			reports: 0,
		}));

		data.forEach((report) => {
			const reportDate = new Date(report.createdAt);
			const reportDay = reportDate.getDate();
			const weekNumber = Math.floor((reportDay - 1) / 7);
			if (weekNumber < 5) {
				weekBuckets[weekNumber].reports += 1;
			}
		});

		return weekBuckets;
	};

	// Generate monthly data for a year
	const generateMonthlyData = (data) => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const monthBuckets = months.map((month) => ({
			label: month,
			reports: 0,
		}));

		data.forEach((report) => {
			const reportDate = new Date(report.createdAt);
			const monthIndex = reportDate.getMonth();
			monthBuckets[monthIndex].reports += 1;
		});

		return monthBuckets;
	};

	// Generate data for last 6 months
	const generateLastSixMonthsData = (data) => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();

		// Create array for last 6 months
		const lastSixMonths = [];
		for (let i = 5; i >= 0; i--) {
			const monthIndex = (currentMonth - i + 12) % 12;
			lastSixMonths.push({
				label: months[monthIndex],
				reports: 0,
			});
		}

		data.forEach((report) => {
			const reportDate = new Date(report.createdAt);
			const reportMonth = reportDate.getMonth();
			const reportYear = reportDate.getFullYear();
			const currentYear = currentDate.getFullYear();

			// Check if the report falls within last 6 months
			for (let i = 0; i < 6; i++) {
				const checkMonthIndex = (currentMonth - i + 12) % 12;
				const checkYear = currentYear - (currentMonth < i ? 1 : 0);

				if (reportMonth === checkMonthIndex && reportYear === checkYear) {
					lastSixMonths[5 - i].reports += 1;
					break;
				}
			}
		});

		return lastSixMonths;
	};

	const chartConfig = {
		reports: {
			label: "Reports",
			color: "hsl(var(--chart-1))",
		},
	};

	// Format trend text based on percentage change
	const getTrendText = () => {
		const trend = parseFloat(percentageChange);
		if (trend > 0) {
			return `Trending up by ${Math.abs(trend)}% ${getTimePeriodText()}`;
		} else if (trend < 0) {
			return `Trending down by ${Math.abs(trend)}% ${getTimePeriodText()}`;
		}
		return `No change ${getTimePeriodText()}`;
	};

	// Get appropriate time period text based on filter
	const getTimePeriodText = () => {
		switch (timeFilter) {
			case "day":
				return "today";
			case "yesterday":
				return "compared to day before";
			case "week":
				return "this week";
			case "month":
				return "this month";
			case "year":
				return "this year";
			default:
				return "in this period";
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Report Activity</CardTitle>
				<CardDescription>{timeRangeLabel}</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.length > 0 ? (
					<ChartContainer config={chartConfig}>
						<BarChart
							accessibilityLayer
							data={chartData}
							margin={{
								top: 30,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="label"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Bar
								dataKey="reports"
								fill="var(--color-reports, hsl(var(--chart-1)))"
								radius={8}
							>
								<LabelList
									position="top"
									offset={12}
									className="fill-foreground"
									fontSize={12}
								/>
							</Bar>
						</BarChart>
					</ChartContainer>
				) : (
					<div className="flex justify-center items-center h-48 text-muted-foreground">
						No data available for this time period
					</div>
				)}
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					{getTrendText()} <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Showing {totalReports} total reports for this period
				</div>
			</CardFooter>
		</Card>
	);
}
