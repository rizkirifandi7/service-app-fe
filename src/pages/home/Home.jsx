import HomeCard from "@/components/home/HomeCard";
import RekamanHome from "@/components/home/RekamanHome";
import ScheduleHome from "@/components/home/ScheduleHome";

const Home = () => {
	return (
		<div>
			<h1 className="text-2xl font-bold">Dashboard Home</h1>
			<div className="flex flex-col gap-4 mt-4">
				<div className="flex items-start gap-4">
					<div className="space-y-8 w-full">
						<HomeCard/>
						<RekamanHome/>
					</div>
					<div className="w-full">
						<ScheduleHome/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
