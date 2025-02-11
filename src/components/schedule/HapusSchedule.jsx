/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteData } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const HapusSchedule = ({ id, fetchData }) => {
  const [openHapus, setOpenHapus] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteData(`schedule/${selectedId}`);
      if (response.status === "success") {
        toast.success("Schedule berhasil dihapus");
        setOpenHapus(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Gagal menghapus schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={openHapus} onOpenChange={setOpenHapus}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shadow-none bg-red-500 text-white"
            onClick={() => {
              setSelectedId(id);
            }}
          >
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Schedule</DialogTitle>
            <DialogDescription>
              Apakah anda yakin ingin menghapus schedule ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleDelete()}
              disabled={isLoading}
            >
              {isLoading ? "Menghapus..." : "Hapus"}
            </Button>
            <div className="w-full" onClick={() => setOpenHapus(false)}>
              <Button variant="outline" className="w-full">
                Batal
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HapusSchedule;