import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { Calendar, FileDown, House, NotebookPen, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AppSidebar = ({ ...props }) => {
	const [selectedUrl, setSelectedUrl] = useState("");
	const token = JSON.parse(atob(Cookies.get("auth_session").split(".")[1]));

	const isAdmin = token.role === "admin";

	const data = {
		navMain: [
			{
				title: "Dashboard Menu",
				url: "#",
				items: [
					{
						title: "Home",
						url: "/",
						icons: <House />,
						isActive: selectedUrl === "/",
					},
					{
						title: "Schedule",
						url: "/schedule",
						icons: <Calendar />,
						isActive: selectedUrl === "/schedule",
					},
					{
						title: "Laporan Kerusakan",
						url: "/laporan",
						icons: <NotebookPen />,
						isActive: selectedUrl === "/laporan",
					},
					{
						title: "Unduh Laporan",
						url: "/unduh",
						icons: <FileDown />,
						isActive: selectedUrl === "/unduh",
					},
					// Conditionally render the User menu item
					...(isAdmin
						? [
								{
									title: "User",
									url: "/user",
									icons: <User />,
									isActive: selectedUrl === "/user",
								},
						  ]
						: []),
				],
			},
		],
	};

	const handleSelectedUrl = (url) => {
		setSelectedUrl(url);
	};

	return (
		<Sidebar {...props}>
			<SidebarHeader className="flex flex-row items-center h-16 border-b">
				<img src="/logobrand.png" alt="" className="w-12 h-12" />
				<div className="">
				<h1 className="text-base font-semibold">PE Trouble Report</h1>
					<p className="text-sm text-muted-foreground">Sistem Informasi</p>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="flex flex-col gap-2">
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={item.isActive}
											className="text-base"
										>
											<Link
												to={item.url}
												onClick={() => handleSelectedUrl(item.url)}
											>
												{item.icons}
												{item.title}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
};

export default AppSidebar;
