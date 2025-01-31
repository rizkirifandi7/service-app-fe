import HomeCard from "@/components/home/HomeCard";

const Home = () => {
	return (
		<div>
			<h1 className="text-2xl font-bold">Dashboard Home</h1>
			<div className="flex flex-col gap-4 mt-4">
				<HomeCard />
				{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="w-full h-full">
						<Rekaman />
					</div>
					<div className="w-full h-full">
						<Schedule />
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Home;
