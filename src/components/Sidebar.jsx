/* eslint-disable react/prop-types */
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import AppSidebar from './AppSidebar'
import HeaderDashboard from "./HeaderDashboard"

const Sidebar = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <HeaderDashboard />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Sidebar