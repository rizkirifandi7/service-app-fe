import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "./ui/sidebar"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import { toast } from "sonner"

const HeaderDashboard = () => {
  const handleLogout = () => {
    Cookies.remove("auth_session")
    toast.success("Logout success")
  }

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center h-full gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Admin</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20 mr-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/login" onClick={handleLogout}>
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default HeaderDashboard