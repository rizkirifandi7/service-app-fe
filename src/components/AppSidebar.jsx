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
} from "@/components/ui/sidebar"
import { Calendar, House, NotebookPen } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const AppSidebar = ({ ...props }) => {
  const [selectedUrl, setSelectedUrl] = useState("")

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
            title: "Rekaman Kerusakan",
            url: "/rekaman",
            icons: <NotebookPen />,
            isActive: selectedUrl === "/rekaman",
          },
        ],
      },
    ],
  }

  const handleSelectedUrl = (url) => {
    setSelectedUrl(url)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center h-16 border-b">
        <img src="/logobrand.png" alt="" className="w-12 h-12" />
        <div className="">
          <h1 className="text-base font-semibold">Service App</h1>
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
                    <SidebarMenuButton asChild isActive={item.isActive} className="text-base">
                      <Link to={item.url} onClick={() => handleSelectedUrl(item.url)}>{item.icons}{item.title}</Link>
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
  )
}

export default AppSidebar