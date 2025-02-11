import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnduhRekaman from "./UnduhRekaman";
import UnduhSchedule from "./UnduhSchedule";

const UnduhLaporan = () => {
	return (
		<div className="flex flex-col justify-center items-center h-full">
			<Tabs defaultValue="rekaman" className="w-[600px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="rekaman">Unduh Laporan Rekaman</TabsTrigger>
					<TabsTrigger value="schedule">Unduh Laporan Schedule</TabsTrigger>
				</TabsList>
				<TabsContent value="rekaman">
					<UnduhRekaman />
				</TabsContent>
				<TabsContent value="schedule">
					<UnduhSchedule />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default UnduhLaporan;
